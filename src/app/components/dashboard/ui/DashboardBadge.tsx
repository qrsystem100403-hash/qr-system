import { cn } from "@/lib/utils";

type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const variants: Record<Variant, string> = {
  success: `
    bg-[var(--color-success-soft)]
    text-[var(--color-success)]
    border-[var(--color-success-border)]
  `,
  warning: `
    bg-[var(--color-warning-soft)]
    text-[var(--color-warning)]
    border-[var(--color-warning-border)]
  `,
  danger: `
    bg-[var(--color-danger-soft)]
    text-[var(--color-danger)]
    border-[var(--color-danger-border)]
  `,
  info: `
    bg-[var(--color-info-soft)]
    text-[var(--color-info)]
    border-[var(--color-info-border)]
  `,
  neutral: `
    bg-[var(--color-surface-soft)]
    text-[var(--color-text-muted)]
    border-[var(--color-border)]
  `,
};

export default function DashboardBadge({
  children,
  variant = "neutral",
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-full",
        "border",
        "px-3",
        "py-1",
        "text-xs",
        "font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}