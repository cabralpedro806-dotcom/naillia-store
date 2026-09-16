import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createCjOrder } from "@/lib/cj";
import { product } from "@/lib/product";
import { claimStripeEvent, saveOrder } from "@/lib/db";

// Stripe needs the raw request body to verify the webhook signature.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { message: "Stripe webhook isn't configured yet." },
      { status: 501 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: if this exact Stripe event was already processed (e.g. a
  // retried delivery), skip it. Without this, a redelivered webhook could
  // forward the same order to CJ twice. Requires Redis to be configured
  // (see .env.example) — without it, this fails open and relies on CJ's own
  // orderNumber uniqueness as a fallback.
  const isNewEvent = await claimStripeEvent(event.id);
  if (!isNewEvent) {
    console.log(`Skipping already-processed Stripe event ${event.id}`);
    return NextResponse.json({ received: true, deduped: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items", "shipping_details"],
        });

        const shipping = fullSession.collected_information?.shipping_details;
        const address = shipping?.address;
        const orderItems = [
          {
            id: product.id,
            name: product.name,
            quantity:
              (fullSession.line_items?.data ?? []).reduce(
                (sum, li) => sum + (li.quantity ?? 1),
                0
              ) || 1,
          },
        ];

        if (!shipping || !address) {
          console.error(
            `No shipping address on session ${session.id} — can't forward to CJ. Order needs manual handling.`
          );
          await saveOrder({
            stripeSessionId: session.id,
            customerEmail: fullSession.customer_details?.email ?? null,
            customerName: fullSession.customer_details?.name ?? null,
            shippingAddress: null,
            items: orderItems,
            amountTotal: fullSession.amount_total,
            cjOrderId: null,
            status: "needs_manual_review",
            createdAt: new Date().toISOString(),
          });
          break;
        }

        if (!product.cjVid) {
          console.error(
            "CJ_PRODUCT_VID is not set — can't forward order to CJ. Order needs manual handling."
          );
          await saveOrder({
            stripeSessionId: session.id,
            customerEmail: fullSession.customer_details?.email ?? null,
            customerName: fullSession.customer_details?.name ?? null,
            shippingAddress: address,
            items: orderItems,
            amountTotal: fullSession.amount_total,
            cjOrderId: null,
            status: "needs_manual_review",
            createdAt: new Date().toISOString(),
          });
          break;
        }

        const cjOrder = await createCjOrder({
          orderNumber: session.id,
          shippingAddress: {
            customerName: shipping.name ?? fullSession.customer_details?.name ?? "Customer",
            countryCode: address.country ?? "US",
            country: address.country ?? "US",
            province: address.state ?? "",
            city: address.city ?? "",
            address: [address.line1, address.line2].filter(Boolean).join(", "),
            zip: address.postal_code ?? "",
            phone: fullSession.customer_details?.phone ?? undefined,
          },
          items: [{ vid: product.cjVid, quantity: orderItems[0].quantity }],
        });

        console.log(
          `Created CJ order for ${session.id} (CJ order id: ${cjOrder?.orderId ?? "unknown"}) — log into CJ to approve/pay it`
        );

        await saveOrder({
          stripeSessionId: session.id,
          customerEmail: fullSession.customer_details?.email ?? null,
          customerName: fullSession.customer_details?.name ?? null,
          shippingAddress: address,
          items: orderItems,
          amountTotal: fullSession.amount_total,
          cjOrderId: cjOrder?.orderId ?? null,
          status: "pending_cj_approval",
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        // Don't throw — Stripe retries webhooks on failure, and retrying a
        // failed CJ order isn't automatically safe (the event is already
        // claimed above, so a Stripe retry would be deduped anyway). Log
        // loudly so it can be handled manually.
        console.error(`Failed to forward order ${session.id} to CJ:`, err);
      }
      break;
    }
    default:
      // Ignore other event types for now.
      break;
  }

  return NextResponse.json({ received: true });
}
