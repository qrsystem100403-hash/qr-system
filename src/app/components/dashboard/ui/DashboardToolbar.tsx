"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export default function DashboardToolbar({
  left,
  center,
  right,
  className,
}: Props) {
  return (
    <section
      className={cn(
        `
        mb-6
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
        shadow-[var(--shadow-sm)]
        `,
        className
      )}
    >
      <div
        className="
          flex
          flex-col
          gap-5
        "
      >
        {/* Search */}
        {left && (
          <div className="w-full">
            {left}
          </div>
        )}

        {/* Filters + Actions */}
        <div
          className="
            flex
            flex-col
            gap-4

            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* Filters */}
          <div
            className="
              flex-1
              min-w-0
            "
          >
            {center}
          </div>

          {/* Actions */}
          <div
            className="
              flex
              flex-col
              gap-3

              sm:flex-row

              lg:justify-end
              lg:shrink-0
            "
          >
            {right}
          </div>
        </div>
      </div>
    </section>
  );
}