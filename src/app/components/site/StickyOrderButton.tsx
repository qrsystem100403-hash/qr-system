import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function StickyOrderButton() {
  return (
    <Link
      href="#menu"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[var(--color-gold)] px-4 py-3 sm:px-5 sm:py-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-bg)] shadow-[0_18px_45px_rgba(211,181,74,0.28)] transition hover:-translate-y-1 hover:brightness-110"
    >
      <ShoppingBag className="size-4" />
      Order
    </Link>
  );
}