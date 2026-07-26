import Link from "next/link";
import {
  ArrowUpRight,
  Loader2,
  LucideIcon,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import DashboardBadge from "./DashboardBadge";

type TrendType = "up" | "down" | "neutral";

type Trend = {
  value: number;
  type: TrendType;
  label?: string;
};

type Badge = {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
};

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;

  href?: string;
  description?: string;

  prefix?: string;
  suffix?: string;

  trend?: Trend;

  badge?: Badge;

  action?: React.ReactNode;

  footer?: React.ReactNode;

  loading?: boolean;

  color?: "blue" | "green" | "amber" | "red" | "zinc";

  className?: string;
};

const colorMap = {
  blue: {
    bg: "bg-[var(--color-info-soft)]",
    text: "text-[var(--color-info)]",
  },

  green: {
    bg: "bg-[var(--color-success-soft)]",
    text: "text-[var(--color-success)]",
  },

  amber: {
    bg: "bg-[var(--color-warning-soft)]",
    text: "text-[var(--color-warning)]",
  },

  red: {
    bg: "bg-[var(--color-danger-soft)]",
    text: "text-[var(--color-danger)]",
  },

  zinc: {
    bg: "bg-[var(--color-surface-soft)]",
    text: "text-[var(--color-text-muted)]",
  },
} as const;

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  href,
  description,
  prefix,
  suffix,
  trend,
  badge,
  action,
  footer,
  loading = false,
  color = "blue",
  className,
}: Props) {
  const card = (
    <div
      className={cn(
        "group flex h-full flex-col",
        "rounded-[var(--radius-xl)]",
        "border border-[var(--color-border)]",
        "bg-[var(--color-surface)]",
        "p-6",
        "shadow-[var(--shadow-sm)]",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-md)]",
        className
      )}
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
            colorMap[color].bg,
            colorMap[color].text
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <DashboardBadge variant={badge.variant ?? "neutral"}>
              {badge.label}
            </DashboardBadge>
          )}

          {action}

          {href && (
            <ArrowUpRight
              className="
                size-4
                text-[var(--color-text-soft)]
                transition-transform
                duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          )}
        </div>
      </div>

      {/* Body */}

      <div className="mt-6 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
          {title}
        </p>

        {loading ? (
          <div className="mt-5 flex h-12 items-center">
            <Loader2 className="size-6 animate-spin text-[var(--color-text-muted)]" />
          </div>
        ) : (
          <div className="mt-3 flex items-end gap-1">
            {prefix && (
              <span className="pb-1 text-lg font-semibold text-[var(--color-text-muted)]">
                {prefix}
              </span>
            )}

            <span className="text-4xl font-bold tracking-tight text-[var(--color-heading)]">
              {value}
            </span>

            {suffix && (
              <span className="pb-1 text-lg font-semibold text-[var(--color-text-muted)]">
                {suffix}
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            {description}
          </p>
        )}

        {trend && (
          <div className="mt-4 flex items-center gap-2">
            {trend.type === "up" && (
              <TrendingUp className="size-4 text-[var(--color-success)]" />
            )}

            {trend.type === "down" && (
              <TrendingDown className="size-4 text-[var(--color-danger)]" />
            )}

            {trend.type === "neutral" && (
              <Minus className="size-4 text-[var(--color-text-soft)]" />
            )}

            <span
              className={cn(
                "text-sm font-semibold",
                trend.type === "up" &&
                  "text-[var(--color-success)]",
                trend.type === "down" &&
                  "text-[var(--color-danger)]",
                trend.type === "neutral" &&
                  "text-[var(--color-text-muted)]"
              )}
            >
              {trend.value}%
            </span>

            {trend.label && (
              <span className="text-sm text-[var(--color-text-muted)]">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>

      {footer && (
        <div className="mt-6 border-t border-[var(--color-divider)] pt-4">
          {footer}
        </div>
      )}
    </div>
  );

  if (!href) return card;

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}