import Link from "next/link";
import { Clock, LayoutDashboard, MapPin, } from "lucide-react";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-deep)] py-12"
    >
      <div className="premium-container">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <div className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)] shadow-[0_0_24px_rgba(211,181,74,0.12)] md:size-10">
            <Image
              src="/images/logo.png"
              alt="Friends Cafe logo"
              width={38}
              height={38}
              className="h-5 w-5 object-contain md:h-7 md:w-7"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-normal leading-none tracking-[-0.02em] text-[var(--color-text)] sm:text-md md:text-xl">
              Friends Cafe Chopati
            </p>
            <p className="mt-1 truncate text-[5px] font-extrabold uppercase tracking-[0.28em] text-[var(--color-gold)] sm:text-[6px] md:text-[7px]">
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