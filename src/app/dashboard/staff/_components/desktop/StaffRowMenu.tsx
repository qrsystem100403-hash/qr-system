"use client";

import { Menu } from "@base-ui/react/menu";
import {
  MoreVertical,
  Pencil,
  UserRound,
  UserMinus,
  Trash2,
  KeyRound,
} from "lucide-react";

import type { Staff } from "@/modules/staff/types";

type Props = {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function StaffRowMenu({
  staff,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          transition-colors
          hover:bg-[var(--color-surface-soft)]
        "
      >
        <MoreVertical className="size-5" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup
            className="
              min-w-[220px]
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-2
              shadow-[var(--shadow-lg)]
            "
          >
            <Menu.Item
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--color-surface-soft)]"
            >
              <UserRound className="size-4" />
              View Profile
            </Menu.Item>

            <Menu.Item
              onClick={() => onEdit(staff)}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--color-surface-soft)]"
            >
              <Pencil className="size-4" />
              Edit Employee
            </Menu.Item>

            <Menu.Item
              onClick={() => onToggleStatus(staff)}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--color-surface-soft)]"
            >
              <UserMinus className="size-4" />
              {staff.profile?.is_active
                ? "Mark On Leave"
                : "Reactivate"}
            </Menu.Item>

            <Menu.Item
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--color-surface-soft)]"
            >
              <KeyRound className="size-4" />
              Reset Password
            </Menu.Item>

            <div className="my-2 h-px bg-[var(--color-border)]" />

            <Menu.Item
              className="
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-red-600
                hover:bg-red-50
                dark:hover:bg-red-950/20
              "
            >
              <Trash2 className="size-4" />
              Delete Employee
            </Menu.Item>

          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}