"use client";

import Link from "next/link";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl italic text-brand-ink">
            Thank you for your order
          </h1>
          <p className="mt-4 text-brand-ink/70">
            Your payment went through and a confirmation email is on its way.
            We&apos;ll notify you as soon as it ships.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-sm bg-brand-rose px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.06em] text-white hover:bg-brand-rose-dark"
          >
            Continue shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
