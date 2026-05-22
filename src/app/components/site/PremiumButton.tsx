import Link from "next/link";
import type { ReactNode } from "react";

type PremiumButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "gold" | "outline" | "ghost";
  className?: string;
};

export function PremiumButton({
  children,
  href,
  onClick,
  variant = "gold",
  className = "",
}: PremiumButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] transition duration-300 active:scale-[0.98]";

  const variants = {
    gold:
      "bg-[var(--color-gold)] text-[var(--color-bg)] shadow-[var(--shadow-gold)] hover:bg-[var(--color-gold-soft)]",
    outline:
      "border border-[var(--color-border-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]",
    ghost:
      "text-[var(--color-text-muted)] hover:text-[var(--color-gold)]",
  };

  const finalClass = `${baseClass} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={finalClass}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={finalClass}>
      {children}
    </button>
  );
}