"use client";

import {
  UserPlus,
  Pencil,
  X,
} from "lucide-react";
import type { StaffDialogMode } from "./staff-dialog-types";

type Props = {
  mode: StaffDialogMode;
  onClose: () => void;
};

export default function StaffDialogHeader({
  mode,
  onClose,
}: Props) {
  const create = mode === "create";

  return (
    <div
      className="
        sticky
        top-0
        z-20
        border-b
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-6
        py-5
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            {create ? (
              <UserPlus className="size-6" />
            ) : (
              <Pencil className="size-5" />
            )}
          </div>

          <div>
            <h2
              className="
                text-xl
                font-bold
                text-[var(--color-heading)]
              "
            >
              {create
                ? "Add Employee"
                : "Edit Employee"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[var(--color-text-muted)]
              "
            >
              {create
                ? "Create a new employee account for your restaurant."
                : "Update employee information and permissions."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            text-[var(--color-text-muted)]
            transition-all
            hover:bg-[var(--color-surface-hover)]
            hover:text-[var(--color-heading)]
          "
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}