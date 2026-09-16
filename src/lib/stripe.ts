import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily creates the Stripe client so the app doesn't crash at build/import
 * time when STRIPE_SECRET_KEY isn't set yet (e.g. before you've created a
 * Stripe account). The checkout route checks for this and returns a clear
 * error instead of a stack trace.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
