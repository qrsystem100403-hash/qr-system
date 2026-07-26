"use client";

import type { Staff } from "@/modules/staff/types";

import StaffTableHeader from "./_components/desktop/StaffTableHeader";
import StaffTableRow from "./_components/desktop/StaffTableRow";
import EmptyStaffTable from "./_components/desktop/EmptyStaffTable";

type Props = {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function StaffManagementTable({
  staff,
  onEdit,
  onToggleStatus,
}: Props) {
  if (!staff.length) {
    return <EmptyStaffTable />;
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        shadow-[var(--shadow-sm)]
      "
    >
      <div
  className="
    h-full
    overflow-auto
  "
>

        <table
  className="
    min-w-full
    border-separate
    border-spacing-0
  "
>

          <StaffTableHeader />

          <tbody>

            {staff.map((member) => (
              <StaffTableRow
                key={member.id}
                staff={member}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
              />
            ))}

          </tbody>

        </table>

      </div>
    </section>
  );
}