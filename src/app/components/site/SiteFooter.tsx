import Link from "next/link";
import { Clock, LayoutDashboard, MapPin, ShoppingBag } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-deep)] py-12"
    >
      <div className="premium-container">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                <ShoppingBag className="size-5" strokeWidth={1.8} />
              </div>

              <div>
                <p className="font-heading text-2xl font-semibold leading-none">
                  Friends Cafe
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.34em] text-[var(--color-gold)]">
                  Pure Vegetarian
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              A premium vegetarian restaurant experience with fast QR ordering,
              smooth browsing and simple owner management.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-semibold">Visit</h3>

            <div className="mt-5 space-y-4 text-sm text-[var(--color-text-muted)]">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-gold)]" />
                City Center, India
              </p>

              <p className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-[var(--color-gold)]" />
                Open daily · 9 AM - 11 PM
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-semibold">Quick Links</h3>

            <div className="mt-5 flex flex-col items-start gap-3 text-sm text-[var(--color-text-muted)]">
              <a href="#home" className="hover:text-[var(--color-gold)]">
                Home
              </a>
              <a href="#menu" className="hover:text-[var(--color-gold)]">
                Menu
              </a>
              <a href="#about" className="hover:text-[var(--color-gold)]">
                About
              </a>
              <Link
                href="/owner/login"
                className="inline-flex items-center gap-2 hover:text-[var(--color-gold)]"
              >
                <LayoutDashboard className="size-4" />
                Owner Login
              </Link>
            </div>
          </div>
        </div>

        <div className="soft-divider my-8" />

        <div className="flex flex-col justify-between gap-3 text-xs text-[var(--color-text-soft)] sm:flex-row">
          <p>© {new Date().getFullYear()} Friends Cafe. All rights reserved.</p>
          <p>Powered by QR Ordering Engine</p>
        </div>
      </div>
    </footer>
  );
}