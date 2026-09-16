import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { product } from "@/lib/product";

type CartItem = {
  id: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      {
        message:
          "Stripe isn't configured yet. Add STRIPE_SECRET_KEY to .env.local (see .env.example) to enable checkout.",
      },
      { status: 501 }
    );
  }

  let body: { items?: CartItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  // Never trust prices from the client — look them up server-side by id.
  // This is a single-product store today, so there's only one valid id,
  // but this stays correct if more products are added later.
  const catalog: Record<string, { name: string; price: number }> = {
    [product.id]: { name: product.name, price: product.price },
  };

  const lineItems = [];
  for (const item of items) {
    const entry = catalog[item.id];
    if (!entry || !item.quantity || item.quantity < 1) {
      return NextResponse.json(
        { message: `Unrecognized item in cart: ${item.id}` },
        { status: 400 }
      );
    }
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: entry.name },
        unit_amount: Math.round(entry.price * 100),
      },
      quantity: item.quantity,
    });
  }

  const origin = req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { message: "Couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}
