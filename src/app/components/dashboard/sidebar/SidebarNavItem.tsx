"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
};

export default function SidebarNavItem({
  label,
  href,
  icon: Icon,
  active,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3",
        "h-12 w-full",
        "rounded-2xl",
        "px-3",
        "transition-all duration-300",

        active
          ? [
              "bg-[var(--color-primary-soft)]",
              "text-[var(--color-primary)]",
              "shadow-[var(--shadow-sm)]",
            ]
          : [
              "text-[var(--color-text-muted)]",
              "hover:bg-[var(--color-surface-hover)]",
              "hover:shadow-sm",
              "hover:text-[var(--color-heading)]",
            ],
      ) }
    >
      

      {/* Icon */}

     <div
  className={cn(
    "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
    active
      ? "bg-[var(--color-surface)] scale-105"
      : "group-hover:bg-[var(--color-surface)] group-hover:scale-105"
  )}
>
        <Icon className="size-5" />
      </div>

      {/* Label */}

      <span
  className={cn(
    "flex-1 truncate text-sm transition-colors",
    active ? "font-bold" : "font-medium"
  )}
>
        {label}
      </span>
    </Link>
  );
}
