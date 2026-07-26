"use client";

import { Users } from "lucide-react";
import AddStaffDialog from "./AddStaffDialog";

type Props = {
  totalStaff: number;
};

export default function StaffHeader({
  totalStaff,
}: Props) {
  return (
    <div
      className="
      flex
      flex-col
      gap-6
      rounded-[var(--radius-xl)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      p-6
      shadow-[var(--shadow-sm)]
      lg:flex-row
      lg:items-center
      lg:justify-between
      "
    >
      <div>
        <h1
          className="
          text-2xl
          font-bold
          text-[var(--color-heading)]
          "
        >
          Staff Management
        </h1>

        <p
          className="
          mt-2
          max-w-xl
          text-sm
          text-[var(--color-text-muted)]
          "
        >
          Manage restaurant staff accounts, assign roles, and control
          permissions from one place.
        </p>

        <div
          className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-[var(--color-border)]
          bg-[var(--color-surface-soft)]
          px-4
          py-2
          "
        >
          <Users
            className="
            size-4
            text-[var(--color-primary)]
            "
          />

          <span
            className="
            text-sm
            font-medium
            text-[var(--color-text)]
            "
          >
            {totalStaff} Staff Member
            {totalStaff !== 1 && "s"}
          </span>
        </div>
      </div>

      <div
        className="
        flex
        shrink-0
        items-center
        "
      >
        <AddStaffDialog />
      </div>
    </div>
  );
}