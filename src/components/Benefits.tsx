import { product } from "@/lib/product";

export default function Benefits() {
  return (
    <section id="benefits" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl italic text-brand-ink sm:text-4xl">
            Why Naillia
          </h2>
          <p className="mt-3 text-brand-ink/60">
            One bottle, a few drops a day — that&apos;s the whole routine.
          </p>
        </div>

        <div className="mt-12 grid divide-y divide-brand-line border border-brand-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {product.benefits.map((b) => (
            <div key={b.title} className="bg-brand-card p-7">
              <h3 className="font-display text-lg italic text-brand-ink">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/60">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
