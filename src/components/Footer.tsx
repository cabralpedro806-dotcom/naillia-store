export default function Footer() {
  return (
    <footer className="border-t border-brand-line bg-brand-cream py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-brand-ink/60 sm:flex-row sm:justify-between">
        <span className="font-display text-lg italic text-brand-ink">naillia</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#faq" className="hover:text-brand-rose">FAQ</a>
          <a href="/shipping-returns" className="hover:text-brand-rose">Shipping &amp; Returns</a>
          <a href="/privacy" className="hover:text-brand-rose">Privacy Policy</a>
          <a href="/terms" className="hover:text-brand-rose">Terms of Service</a>
        </nav>
        <span>© {new Date().getFullYear()} Naillia. All rights reserved.</span>
      </div>
    </footer>
  );
}
