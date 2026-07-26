import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function DashboardIconButton({
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center",

        "h-[var(--icon-button-size-sm)]",
        "w-[var(--icon-button-size-sm)]",

        "md:h-[var(--icon-button-size)]",
        "md:w-[var(--icon-button-size)]",

        "rounded-[var(--radius-md)]",

        "border border-[var(--color-border)]",

        "bg-[var(--color-surface)]",

        "text-[var(--color-text-muted)]",

        "shadow-[var(--shadow-xs)]",

        "transition-all duration-200",

        "hover:border-[var(--color-primary-border)]",
        "hover:bg-[var(--color-primary-soft)]",
        "hover:text-[var(--color-primary)]",
        "hover:shadow-[var(--shadow-sm)]",

        "active:scale-95",

        "disabled:pointer-events-none",
        "disabled:opacity-50",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--color-primary)]",
        "focus-visible:ring-offset-2",

        className
      )}
    >
      {children}
    </button>
  );
}