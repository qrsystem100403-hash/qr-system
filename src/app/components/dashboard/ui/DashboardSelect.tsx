"use client";

import { ChevronDown } from "lucide-react";
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

export default function DashboardSelect({
  value,
  onChange,
  options,
  className,
}: Props) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11
          min-w-[180px]
          appearance-none
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-4
          pr-10
          text-sm
          font-medium
          text-[var(--color-heading)]
          shadow-[var(--shadow-xs)]
          outline-none
          transition-all
          hover:border-[var(--color-border-strong)]
          focus:border-[var(--color-primary)]
          focus:ring-2
          focus:ring-[var(--color-primary-soft)]
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          size-4
          -translate-y-1/2
          text-[var(--color-text-soft)]
        "
      />
    </div>
  );
}