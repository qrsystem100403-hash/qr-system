"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonProps =
  | ({
      asChild?: false;
      variant?: Variant;
      loading?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({
      asChild: true;
      children: React.ReactElement;
      variant?: Variant;
      loading?: boolean;
      className?: string;
    });

const variants: Record<Variant, string> = {
  primary: `
    bg-[var(--color-primary)]
    text-white
    border-transparent
    hover:bg-[var(--color-primary-hover)]
  `,
  secondary: `
    bg-[var(--color-surface)]
    text-[var(--color-text)]
    border-[var(--color-border)]
    hover:bg-[var(--color-surface-soft)]
  `,
  ghost: `
    bg-transparent
    text-[var(--color-text-muted)]
    border-transparent
    hover:bg-[var(--color-surface-soft)]
  `,
  danger: `
    bg-[var(--color-danger)]
    text-white
    border-transparent
    hover:opacity-90
  `,
};

export default function DashboardButton({
  asChild = false,
  variant = "primary",
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "h-11 rounded-[var(--radius-md)] border px-5",
          "text-sm font-semibold transition-all duration-200",
          "active:scale-[0.98]",
          "focus:outline-none",
          "focus:ring-4",
          "focus:ring-[var(--color-primary-ring)]",
          variants[variant],
          className
        )}
      >
        {children}
      </Slot>
    );
  }

  const buttonProps =
  props as React.ButtonHTMLAttributes<HTMLButtonElement>;

const { disabled, ...rest } = buttonProps;

  return (
    <button
      {...buttonProps}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "h-11 rounded-[var(--radius-md)] border px-5",
        "text-sm font-semibold transition-all duration-200",
        "active:scale-[0.98]",
        "disabled:pointer-events-none",
        "disabled:opacity-60",
        "focus:outline-none",
        "focus:ring-4",
        "focus:ring-[var(--color-primary-ring)]",
        variants[variant],
        className
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}