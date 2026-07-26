"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function DashboardSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: Props) {
  return (
    <div
      className={cn(
        `
        relative
        flex
        h-11
        w-full
        items-center
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface-soft)]
        transition-all
        duration-200

        focus-within:border-[var(--color-primary)]
        focus-within:ring-2
        focus-within:ring-[var(--color-primary-soft)]
        focus-within:shadow-[var(--shadow-sm)]
        `,
        className
      )}
    >
      <Search
        className="
          absolute
          left-4
          size-4
          text-[var(--color-text-muted)]
        "
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          h-full
          w-full
          bg-transparent
          pl-11
          pr-11
          text-sm
          text-[var(--color-heading)]
          outline-none
          placeholder:text-[var(--color-text-soft)]
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            transition-colors
            hover:bg-[var(--color-primary-soft)]
            hover:text-[var(--color-primary)]
          "
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}