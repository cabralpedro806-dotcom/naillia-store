import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Naillia — Nail & Cuticle Rosehip Oil",
  description:
    "Naillia Nail Care Rosehip Oil — a lightweight daily treatment that nourishes cuticles and helps nails look stronger, smoother, and healthier over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-cream text-brand-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
