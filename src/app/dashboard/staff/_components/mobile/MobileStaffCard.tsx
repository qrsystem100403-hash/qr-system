"use client";

import {
  ChevronRight,
  Phone,
} from "lucide-react";

import RestaurantLogo from "@/app/components/RestaurantLogo";
import type { Staff } from "@/modules/staff/types";

type Props = {
  staff: Staff;
  employeeNumber: number;
  onClick: () => void;
};

export default function MobileStaffCard({
  staff,
  employeeNumber,
  onClick,
}: Props) {
  const roleColor =
    staff.role === "manager"
      ? "bg-violet-500"
      : staff.role === "cashier"
      ? "bg-sky-500"
      : staff.role === "kitchen"
      ? "bg-orange-500"
      : "bg-emerald-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-4
        text-left
        shadow-[var(--shadow-sm)]
        transition-all
        active:scale-[0.98]
      "
    >
      <div className="flex items-start gap-4">

        <div className="relative">

          <div
            className="
              h-14
              w-14
              overflow-hidden
              rounded-2xl
              bg-[var(--color-primary-soft)]
            "
          >
            <RestaurantLogo
              logo={null}
              name={
                staff.profile?.full_name ??
                "Unknown"
              }
              size={56}
            />
          </div>

          <span
            className={`
              absolute
              -bottom-1
              -right-1
              h-4
              w-4
              rounded-full
              border-2
              border-white

              ${
                staff.profile?.is_active
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }
            `}
          />

        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between">

            <div>

              <h3
                className="
                  truncate
                  text-base
                  font-bold
                  text-[var(--color-heading)]
                "
              >
                {staff.profile?.full_name}
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-[var(--color-text-muted)]
                "
              >
                EMP-
                {employeeNumber
                  .toString()
                  .padStart(3, "0")}
              </p>

            </div>

            <ChevronRight
              className="
                size-5
                text-[var(--color-text-soft)]
              "
            />

          </div>

          <div className="mt-3 flex flex-wrap gap-2">

            <span
              className={`
                rounded-full
                ${roleColor}
                px-3
                py-1
                text-xs
                font-semibold
                text-white
              `}
            >
              {staff.role}
            </span>

            <span
              className="
                rounded-full
                bg-[var(--color-surface-soft)]
                px-3
                py-1
                text-xs
                font-semibold
              "
            >
              Custom Shift
            </span>

          </div>

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                text-[var(--color-text-muted)]
              "
            >
              <Phone className="size-4" />

              <span>
                {staff.profile?.phone ??
                  "No Phone"}
              </span>
            </div>

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-bold

                ${
                  staff.profile?.is_active
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }
              `}
            >
              {staff.profile?.is_active
                ? "Active"
                : "On Leave"}
            </span>

          </div>

        </div>

      </div>
    </button>
  );
}