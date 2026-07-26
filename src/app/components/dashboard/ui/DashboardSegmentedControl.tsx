"use client";

import { cn } from "@/lib/utils";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  className?: string;
};

export default function DashboardSegmentedControl<
  T extends string,
>({
  value,
  onChange,
  options,
  className,
}: Props<T>) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2",
        className
      )}
    >
      {options.map((option) => {
        const active =
          option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange(option.value)
            }
            className={cn(
              "rounded-[var(--radius-xl)] border p-5 text-left transition-all duration-200",
              active
                ? `
                  border-[var(--color-primary)]
                  bg-[var(--color-primary-soft)]
                  shadow-[var(--shadow-md)]
                `
                : `
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                  hover:border-[var(--color-primary-border)]
                  hover:shadow-[var(--shadow-sm)]
                `
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-heading)]">
                {option.label}
              </h3>

              {active && (
                <div className="size-2 rounded-full bg-[var(--color-primary)]" />
              )}
            </div>

            {option.description && (
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {option.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}