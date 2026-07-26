import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "amber" | "red" | "zinc";
};

const colors = {
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

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  color = "blue",
}: Props) {
  return (
    <Link
  href={href}
  className="
    group
    relative
    overflow-hidden
    rounded-[var(--radius-xl)]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    p-5
    transition-all
    duration-200
    hover:-translate-y-1
    hover:border-[var(--color-primary-border)]
    hover:shadow-[var(--shadow-md)]
  "
>
  <div className="flex items-start justify-between">
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl",
        colors[color].bg,
        colors[color].text
      )}
    >
      <Icon className="size-6" />
    </div>

    <ArrowUpRight
      className="
        size-5
        text-[var(--color-text-soft)]
        transition-all
        duration-200
        group-hover:translate-x-1
        group-hover:-translate-y-1
      "
    />
  </div>

  <div className="mt-5">
    <h3 className="text-base font-semibold text-[var(--color-heading)]">
      {title}
    </h3>

    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
      {description}
    </p>
  </div>
</Link>
  );
}