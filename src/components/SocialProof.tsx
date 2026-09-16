import { product } from "@/lib/product";

const testimonials = [
  {
    name: "Maya R.",
    quote:
      "My cuticles used to be so dry and cracked in the winter. Two weeks of using this every night and they actually look hydrated now.",
  },
  {
    name: "Jordan K.",
    quote:
      "Absorbs fast, doesn't feel greasy, and my nails have looked noticeably smoother. Now part of my nightly routine.",
  },
  {
    name: "Priya S.",
    quote:
      "I was skeptical about another 'nail oil' but the difference in how my nails look after a month is real.",
  },
];

export default function SocialProof() {
  return (
    <section id="reviews" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-lg tracking-widest text-brand-gold">★★★★★</div>
          <h2 className="mt-2 font-display text-3xl italic text-brand-ink sm:text-4xl">
            {product.reviews.average} out of 5
          </h2>
          <p className="mt-2 text-brand-ink/60">
            Based on {product.reviews.count}+ verified reviews
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-brand-line bg-brand-line sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-brand-card p-6"
            >
              <div className="text-sm tracking-widest text-brand-gold">★★★★★</div>
              <blockquote className="mt-3 text-sm leading-relaxed text-brand-ink/70">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-brand-ink">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
