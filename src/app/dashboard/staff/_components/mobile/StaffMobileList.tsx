"use client";

import { useState } from "react";

import type { Staff } from "@/modules/staff/types";

import MobileStaffCard from "./MobileStaffCard";
import MobileStaffInspector from "./MobileStaffInspector";
import EmptyStaff from "./EmptyStaff";

type Props = {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function StaffMobileList({
  staff,
  onEdit,
  onToggleStatus,
}: Props) {
  const [selectedStaff, setSelectedStaff] =
    useState<Staff | null>(null);

  if (!staff.length) {
    return <EmptyStaff />;
  }

  return (
    <>
      <div
        className="
          flex
          flex-col
          gap-4
          pb-24
        "
      >
        {staff.map((member, index) => (
          <MobileStaffCard
            key={member.id}
            staff={member}
            employeeNumber={index + 1}
            onClick={() =>
              setSelectedStaff(member)
            }
          />
        ))}
      </div>

      <MobileStaffInspector
        open={!!selectedStaff}
        staff={selectedStaff}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedStaff(null);
          }
        }}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
    </>
  );
}