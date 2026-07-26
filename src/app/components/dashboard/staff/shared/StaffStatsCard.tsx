"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type Color =
  | "primary"
  | "green"
  | "orange"
  | "red"
  | "blue";

type Props = {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon: LucideIcon;
  color?: Color;
  action?: React.ReactNode;
};

const colorStyles: Record<
  Color,
  {
    icon: string;
    bg: string;
  }
> = {
  primary: {
    icon: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary-soft)]",
  },
  green: {
    icon: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  orange: {
    icon: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  red: {
    icon: "text-red-500",
    bg: "bg-red-500/10",
  },
  blue: {
    icon: "text-sky-500",
    bg: "bg-sky-500/10",
  },
};

export default function StaffStatsCard({
  title,
  value,
  description,
  icon: Icon,
  color = "primary",
  action,
}: Props) {
  const style = colorStyles[color];

  return (
    <section className="group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg}`}
            >
              <Icon
                className={`h-7 w-7 ${style.icon}`}
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                {title}
              </p>
            </div>
          </div>

          {!action && (
            <ArrowRight className="h-5 w-5 text-[var(--color-text-muted)] transition group-hover:translate-x-1" />
          )}
        </div>

        {/* Value */}
        <div className="mt-7">
          <div className="text-3xl font-black leading-none text-[var(--color-heading)]">
            {value}
          </div>

          {description && (
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        {action && (
          <div className="mt-6 border-t border-[var(--color-border)] pt-5">
            {action}
          </div>
        )}
      </div>
    </section>
  );
}