"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to an email list provider (Klaviyo, Mailchimp, etc.)
    setSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="font-display text-2xl italic text-brand-ink sm:text-3xl">
          Get 10% off your first order
        </h2>
        <p className="mt-2 text-brand-ink/60">
          Join the list for care tips and early access to new products.
        </p>

        {submitted ? (
          <p className="mt-6 text-brand-rose">You&apos;re in — check your inbox soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full border border-brand-line bg-brand-card px-5 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-rose focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-sm bg-brand-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-rose"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
