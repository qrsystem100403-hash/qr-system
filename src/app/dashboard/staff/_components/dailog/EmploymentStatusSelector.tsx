"use client";

import {
  CheckCircle2,
  Clock3,
  Ban,
} from "lucide-react";
import type {
  EmploymentStatus,
} from "./staff-dialog-types";

type Props = {
  value: EmploymentStatus;
  onChange: (
    status: EmploymentStatus,
  ) => void;
};

const statuses = [
  {
    value: "active",
    title: "Active",
    subtitle: "Currently Working",
    icon: CheckCircle2,
    color: `
      border-emerald-500
      bg-emerald-50
      text-emerald-700
      dark:bg-emerald-950/40
      dark:text-emerald-400
    `,
  },
  {
    value: "on_leave",
    title: "On Leave",
    subtitle: "Temporarily Away",
    icon: Clock3,
    color: `
      border-amber-500
      bg-amber-50
      text-amber-700
      dark:bg-amber-950/40
      dark:text-amber-400
    `,
  },
  {
    value: "terminated",
    title: "Terminated",
    subtitle: "No Longer Working",
    icon: Ban,
    color: `
      border-red-500
      bg-red-50
      text-red-700
      dark:bg-red-950/40
      dark:text-red-400
    `,
  },
] as const;

export default function EmploymentStatusSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statuses.map((status) => {
        const Icon = status.icon;

        const active =
          value === status.value;

        return (
          <button
            key={status.value}
            type="button"
            onClick={() =>
              onChange(status.value)
            }
            className={`
              rounded-2xl
              border
              p-4
              text-left
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md

              ${
                active
                  ? status.color
                  : `
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    hover:border-[var(--color-primary)]
                  `
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl

                  ${
                    active
                      ? "bg-white/70 dark:bg-black/20"
                      : "bg-[var(--color-surface-soft)]"
                  }
                `}
              >
                <Icon className="size-5" />
              </div>

              {active && (
                <CheckCircle2 className="size-5" />
              )}
            </div>

            <h4
              className="
                mt-4
                font-semibold
              "
            >
              {status.title}
            </h4>

            <p
              className="
                mt-1
                text-xs
                opacity-80
              "
            >
              {status.subtitle}
            </p>
          </button>
        );
      })}
    </div>
  );
}