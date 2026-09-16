"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message ?? "Checkout isn't connected yet.");
      }
    } catch {
      setError("Something went wrong starting checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-3xl italic text-brand-ink">Your Cart</h1>

          {items.length === 0 ? (
            <div className="mt-8 border border-brand-line p-10 text-center">
              <p className="text-brand-ink/60">Your cart is empty.</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-sm bg-brand-rose px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.06em] text-white hover:bg-brand-rose-dark"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <ul className="divide-y divide-brand-line">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-5">
                    <div>
                      <p className="font-medium text-brand-ink">{item.name}</p>
                      <p className="text-sm text-brand-ink/60">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-brand-line px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-brand-ink/60 hover:text-brand-rose"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-brand-ink/60 hover:text-brand-rose"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-brand-ink/40 hover:text-brand-rose"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-between border-t border-brand-line pt-6">
                <span className="text-lg font-medium text-brand-ink">Subtotal</span>
                <span className="text-lg font-semibold text-brand-ink">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {error && (
                <p className="mt-4 bg-brand-blush px-4 py-3 text-sm text-brand-rose">
                  {error}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="mt-6 w-full rounded-sm bg-brand-rose px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-rose-dark disabled:opacity-60"
              >
                {isCheckingOut ? "Redirecting…" : "Checkout"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
