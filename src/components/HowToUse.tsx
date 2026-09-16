import { product } from "@/lib/product";

export default function HowToUse() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl italic text-brand-ink sm:text-4xl">
            How to use
          </h2>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {product.howToUse.map((s) => (
            <div key={s.step} className="text-center">
              <span className="font-display block text-4xl italic text-brand-rose">
                {s.step}
              </span>
              <h3 className="mt-2 font-display text-lg text-brand-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/60">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
