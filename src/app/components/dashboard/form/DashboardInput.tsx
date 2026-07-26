"use client";

import {
  forwardRef,
  InputHTMLAttributes,
} from "react";
import clsx from "clsx";

type Props =
  InputHTMLAttributes<HTMLInputElement>;

const DashboardInput = forwardRef<
  HTMLInputElement,
  Props
>(
  (
    {
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        {...props}
        className={clsx(
          `
          h-11
          w-full
          rounded-[var(--radius-md)]
          border
          px-4
          text-sm
          transition-all
          duration-200
          outline-none
          placeholder:text-[var(--color-text-soft)]
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
          boxShadow: "none",
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
      />
    );
  },
);

DashboardInput.displayName =
  "DashboardInput";

export default DashboardInput;