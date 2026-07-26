"use client";

import {
  MoreVertical,
  Phone,
  ShieldCheck,
} from "lucide-react";

import type { Staff } from "@/modules/staff/types";
import RestaurantLogo from "@/app/components/RestaurantLogo";
import StaffRowMenu from "./StaffRowMenu";

type Props = {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function StaffTableRow({
  staff,
  onEdit,
  onToggleStatus,
}: Props) {

  const employmentStatus =
  staff.employment_status
    .replace("_", " ")
    .replace(/\b\w/g, (c) =>
      c.toUpperCase(),
    );
  return (
    <tr
      className="
        border-b
        border-[var(--color-border)]
        transition-colors
        hover:bg-[var(--color-surface-soft)]
      "
    >
      {/* Employee */}

      <td className="px-6 py-4">
        <div className="flex items-center gap-4">

          <div
            className="
              h-12
              w-12
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
              size={48}
            />
          </div>

          <div className="min-w-0">

            <p
  className="
    truncate
    font-semibold
    text-[var(--color-heading)]
  "
>
  {staff.profile?.full_name ?? "Unknown Employee"}
</p>

<p
  className="
    mt-0.5
    truncate
    text-xs
    text-[var(--color-text-muted)]
  "
>
  {staff.profile?.email ?? "No email"}
</p>

            <div
              className="
                mt-1
                flex
                items-center
                gap-1
                text-sm
                text-[var(--color-text-muted)]
              "
            >
              <Phone className="size-3.5" />

              <span>
                {staff.profile?.phone ??
                  "No phone"}
              </span>
            </div>

          </div>

        </div>
      </td>

      {/* Employee ID */}

      <td className="px-4 py-4">

        <span
  className="
    rounded-lg
    bg-[var(--color-surface-soft)]
    px-3
    py-1
    font-mono
    text-sm
    font-semibold
    text-[var(--color-heading)]
  "
>
  {staff.employee_id ?? "--"}
</span>

      </td>

      {/* Role */}

      <td className="px-4 py-4">

        <span
          className="
            inline-flex
            rounded-full
            bg-[var(--color-primary-soft)]
            px-3
            py-1
            text-xs
            font-semibold
            capitalize
            text-[var(--color-primary)]
          "
        >
          {staff.role}
        </span>

      </td>

      {/* Shift */}

      <td className="px-4 py-4">

        <div className="text-sm">
  <p className="font-medium text-[var(--color-heading)] capitalize">
    {staff.shift_mode}
  </p>

  <p className="text-xs text-[var(--color-text-muted)]">
  {staff.attendance_shift_start &&
  staff.attendance_shift_end
    ? `${staff.attendance_shift_start.slice(0, 5)} - ${staff.attendance_shift_end.slice(0, 5)}`
    : "No shift assigned"}
</p>
</div>

      </td>

      {/* Status */}

      <td className="px-4 py-4">

        <span
  className={`
    inline-flex
    items-center
    gap-2
    rounded-full
    px-3
    py-1
    text-xs
    font-semibold

    ${
      staff.employment_status === "active"
        ? "bg-emerald-500/10 text-emerald-600"

        : staff.employment_status === "on_leave"

        ? "bg-amber-500/10 text-amber-600"

        : "bg-red-500/10 text-red-600"
    }
  `}
>
  <span
    className={`
      h-2
      w-2
      rounded-full

      ${
        staff.employment_status === "active"
          ? "bg-emerald-500"

          : staff.employment_status === "on_leave"

          ? "bg-amber-500"

          : "bg-red-500"
      }
    `}
  />

  {employmentStatus}
</span>

      </td>

      {/* Joined */}

      <td
        className="
          px-4
          py-4
          text-sm
          text-[var(--color-text-muted)]
        "
      >
        {staff.joined_at
  ? new Date(
      staff.joined_at,
    ).toLocaleDateString()

  : "--"}
      </td>

      {/* Actions */}

      <td className="px-4 py-4">

        
          <StaffRowMenu
  staff={staff}
  onEdit={onEdit}
  onToggleStatus={onToggleStatus}
/>
      

      </td>
    </tr>
  );
}