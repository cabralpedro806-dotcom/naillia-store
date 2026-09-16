import Image from "next/image";
import { product } from "@/lib/product";

export default function Ingredients() {
  return (
    <section id="ingredients" className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex justify-center">
          <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-brand-blush">
            <Image
              src={product.images[1]}
              alt="Naillia ingredients"
              width={600}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl italic text-brand-ink sm:text-4xl">
            What&apos;s inside
          </h2>
          <p className="mt-3 text-brand-ink/60">
            A short, honest ingredient list — every drop earns its place.
          </p>

          <dl className="mt-8 space-y-6">
            {product.ingredients.map((ing) => (
              <div key={ing.name} className="border-l-2 border-brand-rose pl-4">
                <dt className="font-display text-lg italic text-brand-ink">{ing.name}</dt>
                <dd className="mt-1 text-sm text-brand-ink/60">{ing.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
