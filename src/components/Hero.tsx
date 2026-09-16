"use client";

import Image from "next/image";
import { useState } from "react";
import { product } from "@/lib/product";
import { useCart } from "@/lib/cart-context";

export default function Hero() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
        <span className="border-b border-brand-rose pb-1 text-xs uppercase tracking-[0.14em] text-brand-rose">
          Rated {product.reviews.average} · {product.reviews.count}+ reviews
        </span>

        <h1 className="font-display text-4xl italic leading-[1.05] text-brand-ink sm:text-5xl">
          Healthier-looking nails start at the cuticle.
        </h1>

        <p className="max-w-md text-lg text-brand-ink/70">
          {product.shortDescription}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-brand-ink">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-lg text-brand-ink/40 line-through">
              ${product.compareAtPrice}
            </span>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={handleAdd}
            className="w-full rounded-sm bg-brand-rose px-9 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-rose-dark sm:w-auto"
          >
            {added ? "Added ✓" : "Add to Cart — $" + product.price}
          </button>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-ink/60">
          <li>Vegan &amp; cruelty-free</li>
          <li>30-day guarantee</li>
          <li>Ships in 2–5 days</li>
        </ul>
      </div>

      <div className="order-1 flex justify-center lg:order-2">
        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-brand-blush">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={720}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
