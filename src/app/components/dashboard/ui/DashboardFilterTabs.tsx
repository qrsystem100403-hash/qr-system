"use client";

import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
};

export default function DashboardFilterTabs({
  value,
  onChange,
  options,
  className,
}: Props) {
  return (
    <div
  className="
    flex
    overflow-x-auto
    rounded-2xl
    border
    border-[var(--color-border)]
    bg-[var(--color-surface-soft)]
    p-1
    scrollbar-none
  "
>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              rounded-xl
              px-3.5 py-2
              text-sm
              font-semibold
              transition-all
              duration-200

              ${
                active
                  ? `
                    bg-[var(--color-surface)]
                    text-[var(--color-primary)]
                    shadow-[var(--shadow-xs)]
                  `
                  : `
                    text-[var(--color-text-muted)]
                    hover:text-[var(--color-heading)]
                    hover:bg-[var(--color-surface-hover)]
                  `
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}