import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Menu } from "lucide-react";
import { PremiumButton } from "./PremiumButton";

export function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl">
      <div className="premium-container flex h-14 items-center justify-between md:h-16">
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

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[var(--color-text-muted)] lg:flex">
          {["Home", "Menu", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative transition hover:text-[var(--color-gold)] after:absolute after:-bottom-2 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--color-gold)] after:transition-all hover:after:w-full"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/owner/login"
            className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/[0.03] px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] md:inline-flex"
          >
            <LayoutDashboard className="size-4" strokeWidth={1.8} />
            Owner
          </Link>

          <button className="grid size-9 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] lg:hidden">
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}