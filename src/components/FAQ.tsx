import { product } from "@/lib/product";

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-3xl italic text-brand-ink sm:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-10 divide-y divide-brand-line">
          {product.faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-brand-ink">
                {f.q}
                <span className="ml-4 text-brand-rose transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/60">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
