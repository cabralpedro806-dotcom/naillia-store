// CJdropshipping API v2.0 client.
// Docs: https://developers.cjdropshipping.cn/en/api/api2/

const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

type TokenState = {
  accessToken: string;
  expiresAt: number; // epoch ms
};

let cachedToken: TokenState | null = null;

/**
 * Gets a cached CJ access token, fetching (or refreshing) one if needed.
 * CJ access tokens are valid for 180 days and the API returns the same
 * token if requested again within 24h, so a simple in-memory cache with a
 * safety margin is enough — no need to persist it anywhere.
 */
async function getAccessToken(): Promise<string> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) {
    throw new Error("CJ_API_KEY is not set");
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.accessToken;
  }

  const res = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  const data = await res.json();
  if (!res.ok || !data?.data?.accessToken) {
    throw new Error(
      `CJ getAccessToken failed: ${data?.message ?? res.statusText}`
    );
  }

  const accessToken: string = data.data.accessToken;
  const expiryDate: string | undefined = data.data.accessTokenExpiryDate;
  const expiresAt = expiryDate ? new Date(expiryDate).getTime() : now + 179 * 24 * 60 * 60 * 1000;

  cachedToken = { accessToken, expiresAt };
  return accessToken;
}

export type CjShippingAddress = {
  customerName: string;
  countryCode: string; // 2-letter, e.g. "US"
  country: string;
  province: string;
  city: string;
  address: string;
  zip: string;
  phone?: string;
};

export type CjOrderItem = {
  vid: string; // CJ variant id for the product/SKU being ordered
  quantity: number;
};

/**
 * Forwards a paid order to CJdropshipping so they pack and ship it directly
 * to the customer. Call this from the Stripe webhook once a checkout
 * session completes.
 */
export async function createCjOrder(params: {
  orderNumber: string; // your own order id (e.g. the Stripe session id) — must be unique per call
  shippingAddress: CjShippingAddress;
  items: CjOrderItem[];
  payType?: 1 | 2 | 3; // 1 = pay via CJ page, 2 = pay from CJ balance, 3 = create only, pay later
}) {
  const accessToken = await getAccessToken();
  const fromCountryCode = process.env.CJ_FROM_COUNTRY_CODE || "CN";

  const res = await fetch(`${CJ_BASE_URL}/shopping/order/createOrderV2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": accessToken,
    },
    body: JSON.stringify({
      orderNumber: params.orderNumber,
      fromCountryCode,
      // 3 = create the order but don't pay yet — it sits in your CJ
      // dashboard for you to review and approve/pay manually, same as the
      // Mutual Dropshipping workflow. Pass payType: 2 instead if you want
      // it to auto-pay from your CJ balance with no approval step.
      payType: params.payType ?? 3,
      shippingCustomerName: params.shippingAddress.customerName,
      shippingCountryCode: params.shippingAddress.countryCode,
      shippingCountry: params.shippingAddress.country,
      shippingProvince: params.shippingAddress.province,
      shippingCity: params.shippingAddress.city,
      shippingAddress: params.shippingAddress.address,
      shippingZip: params.shippingAddress.zip,
      shippingPhone: params.shippingAddress.phone ?? "",
      products: params.items.map((item) => ({
        vid: item.vid,
        quantity: item.quantity,
      })),
    }),
  });

  const data = await res.json();
  if (!res.ok || data?.result === false) {
    throw new Error(`CJ createOrderV2 failed: ${data?.message ?? res.statusText}`);
  }

  return data.data; // includes CJ's order id, order amount, etc.
}
