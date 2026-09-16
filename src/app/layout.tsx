import type { Metadata } from "next";
import { Bodoni_Moda, Work_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
      <body className={`${display.variable} ${body.variable} antialiased bg-brand-cream text-brand-ink`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
