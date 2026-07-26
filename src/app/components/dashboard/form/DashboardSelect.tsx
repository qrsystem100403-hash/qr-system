"use client";

import {
  forwardRef,
  SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type Props =
  SelectHTMLAttributes<HTMLSelectElement>;

const DashboardSelect = forwardRef<
  HTMLSelectElement,
  Props
>(
  (
    {
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          {...props}
          className={clsx(
            `
            h-11
            w-full
            appearance-none
            rounded-[var(--radius-md)]
            border
            px-4
            pr-10
            text-sm
            outline-none
            transition-all
            duration-200
            `,
            className,
          )}
          style={{
            background:
              "var(--color-surface)",
            color:
              "var(--color-text)",
            borderColor:
              "var(--color-border)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor =
              "var(--color-primary)";
            e.currentTarget.style.boxShadow =
              "var(--focus-ring)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              "var(--color-border)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          {children}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{
            color:
              "var(--color-text-muted)",
          }}
        />
      </div>
    );
  },
);

DashboardSelect.displayName =
  "DashboardSelect";

export default DashboardSelect;