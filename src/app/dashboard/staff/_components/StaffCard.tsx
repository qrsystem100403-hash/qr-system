import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  SquarePen,
  Trash2,
} from "lucide-react";

import StaffRoleBadge from "./StaffRoleBadge";
import type { Staff } from "@/modules/staff/types";

type Props = {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function StaffCard({
  staff,
  onEdit,
  onToggleStatus,
}: Props) {

    const initials = staff.profile?.full_name
  ?.split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

  const shift =
  staff.attendance_shift_start &&
  staff.attendance_shift_end
    ? `${staff.attendance_shift_start.slice(0, 5)} - ${staff.attendance_shift_end.slice(0, 5)}`
    : "Not Assigned";

  return (
  <div
    className="
    rounded-[var(--radius-xl)]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    p-6
    shadow-[var(--shadow-sm)]
    transition-all
    hover:shadow-[var(--shadow-md)]
    "
  >
    <div className="flex items-start justify-between">
  <div className="flex items-center gap-4">
    <div
      className="
      flex
      h-14
      w-14
      items-center
      justify-center
      rounded-full
      bg-[var(--color-primary-soft)]
      text-lg
      font-bold
      text-[var(--color-primary)]
      "
    >
      {initials || "?"}
    </div>

    <div>
      <h3
        className="
        text-lg
        font-semibold
        text-[var(--color-heading)]
        "
      >
        {staff.profile?.full_name}
      </h3>

      <p
        className="
        mt-1
        text-sm
        text-[var(--color-text-muted)]
        "
      >
        Staff Member
      </p>
    </div>
  </div>

  <div className="flex items-center gap-2">
  <StaffRoleBadge role={staff.role} />

  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      staff.profile?.is_active
        ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
        : "bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
    }`}
  >
    <span
      className={`mr-1.5 h-2 w-2 rounded-full ${
        staff.profile?.is_active
          ? "bg-[var(--color-success)]"
          : "bg-[var(--color-danger)]"
      }`}
    />
    {staff.profile?.is_active ? "Active" : "Inactive"}
  </span>
</div>
</div>

<div className="mt-6 space-y-3">
  <div className="flex items-center gap-3">
    <Mail
      className="
      size-4
      text-[var(--color-text-soft)]
      "
    />

    <span
      className="
      text-sm
      text-[var(--color-text)]
      truncate
      "
    >
      {staff.profile?.email ?? "No email"}
    </span>
  </div>

  <div className="flex items-center gap-3">
    <Phone
      className="
      size-4
      text-[var(--color-text-soft)]
      "
    />

    <span
      className="
      text-sm
      text-[var(--color-text)]
      "
    >
      {staff.profile?.phone || "No phone number"}
    </span>
  </div>

  <div className="flex items-center gap-3">
  <Clock3
    className="
    size-4
    text-[var(--color-text-soft)]
    "
  />

  <span
    className="
    text-sm
    text-[var(--color-text)]
    "
  >
    Shift {shift}
  </span>
</div>

  <div className="flex items-center gap-3">
    <CalendarDays
      className="
      size-4
      text-[var(--color-text-soft)]
      "
    />

    <span
      className="
      text-sm
      text-[var(--color-text-muted)]
      "
    >
      Joined {new Date(staff.created_at).toLocaleDateString()}
    </span>
  </div>
</div>

<div className="mt-6 flex gap-3 border-t border-[var(--color-border)] pt-5">
  <button
    type="button"
    onClick={() => onEdit(staff)}
    className="
    flex-1
    flex
    items-center
    justify-center
    gap-2
    rounded-[var(--radius-md)]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    py-2.5
    text-sm
    font-medium
    text-[var(--color-text)]
    transition
    hover:bg-[var(--color-surface-hover)]
    "
  >
    <SquarePen className="size-4" />
    Edit
  </button>

  <button
    type="button"
    onClick={() => onToggleStatus(staff)}
    className={`
    flex-1
    flex
    items-center
    justify-center
    gap-2
    rounded-[var(--radius-md)]
    border
    ${
  staff.profile?.is_active
    ? "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
    : "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]"
}
    py-2.5
    text-sm
    font-medium
    transition
    hover:opacity-90
    `}
  >
    {staff.profile?.is_active ? (
  <Trash2 className="size-4" />
) : (
  <CheckCircle2 className="size-4" />
)}
    {staff.profile?.is_active ? "Deactivate" : "Activate"}
  </button>
</div>

  </div>
);
}