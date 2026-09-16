"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-line bg-brand-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl italic tracking-wide text-brand-ink">
          naillia
        </Link>

        <nav className="hidden gap-8 text-xs uppercase tracking-[0.08em] text-brand-ink/70 sm:flex">
          <a href="#benefits" className="hover:text-brand-rose">Benefits</a>
          <a href="#ingredients" className="hover:text-brand-rose">Ingredients</a>
          <a href="#reviews" className="hover:text-brand-rose">Reviews</a>
          <a href="#faq" className="hover:text-brand-rose">FAQ</a>
        </nav>

        <Link
          href="/cart"
          className="relative inline-flex items-center gap-2 rounded-sm border border-brand-ink px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-brand-ink transition hover:border-brand-rose hover:text-brand-rose"
        >
          Cart
          {itemCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-rose px-1 text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
