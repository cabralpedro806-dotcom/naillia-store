import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

/**
 * Lightweight order store + webhook idempotency, backed by Upstash Redis
 * (works great from serverless/Vercel — no server to run, generous free tier).
 * Create a free database at https://console.upstash.com and put the REST
 * URL + token in .env.local (see .env.example).
 *
 * This is intentionally simple (no ORM/migrations) since the store has one
 * product and low order volume today. If you outgrow it, swap this file for
 * a real Postgres client — nothing else in the app needs to change.
 */
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!redisClient) {
    redisClient = new Redis({ url, token });
  }
  return redisClient;
}

/**
 * Atomically checks whether a Stripe event has already been processed and,
 * if not, marks it as processed — in one round trip, so two concurrent
 * webhook deliveries for the same event can't both pass the check.
 *
 * Returns true if this call just claimed the event (i.e. go ahead and
 * process it). Returns false if it was already processed (skip it).
 *
 * If Redis isn't configured, this always returns true (fail open) — the
 * webhook falls back to relying on CJ's own orderNumber uniqueness. Set up
 * Redis before going live to close this gap for real.
 */
export async function claimStripeEvent(eventId: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true;

  // NX = only set if not already set. Keep the key for 30 days — long
  // enough to cover any realistic Stripe retry window.
  const result = await redis.set(`stripe_event:${eventId}`, Date.now(), {
    nx: true,
    ex: 60 * 60 * 24 * 30,
  });

  return result === "OK";
}

export type OrderRecord = {
  stripeSessionId: string;
  customerEmail: string | null;
  customerName: string | null;
  shippingAddress: unknown;
  items: { id: string; name: string; quantity: number }[];
  amountTotal: number | null;
  cjOrderId: string | null;
  // "pending_cj_approval": order was created on CJ but not yet paid — log
  // into your CJ dashboard to review and approve it (payType: 3).
  // "needs_manual_review": something prevented forwarding to CJ entirely
  // (see the order's notes / server logs for why) — place it by hand.
  status: "pending_cj_approval" | "needs_manual_review";
  createdAt: string;
};

/**
 * Saves an order record and adds it to a recency-sorted index so orders can
 * be listed later (e.g. from a future admin page). No-ops if Redis isn't
 * configured.
 */
export async function saveOrder(order: OrderRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    console.warn(
      "Redis isn't configured — order was NOT persisted:",
      order.stripeSessionId
    );
    return;
  }

  await redis.set(`order:${order.stripeSessionId}`, order);
  await redis.zadd("orders:by_date", {
    score: Date.parse(order.createdAt),
    member: order.stripeSessionId,
  });
}

/** Fetches the most recent orders, newest first. */
export async function listRecentOrders(limit = 50): Promise<OrderRecord[]> {
  const redis = getRedis();
  if (!redis) return [];

  const ids = await redis.zrange<string[]>("orders:by_date", 0, limit - 1, {
    rev: true,
  });
  if (ids.length === 0) return [];

  const orders = await Promise.all(
    ids.map((id) => redis.get<OrderRecord>(`order:${id}`))
  );
  return orders.filter((o): o is OrderRecord => o !== null);
}
