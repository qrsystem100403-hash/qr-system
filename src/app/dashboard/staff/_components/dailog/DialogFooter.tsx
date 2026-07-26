"use client";

import { Loader2, Plus, Save } from "lucide-react";
import type { StaffDialogMode } from "./staff-dialog-types";

type Props = {
  mode: StaffDialogMode;
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function DialogFooter({
  mode,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const create = mode === "create";

  return (
    <div
      className="
        sticky
        bottom-0
        z-20
        border-t
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-6
        py-4
      "
    >
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="
            h-12
            rounded-xl
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-6
            font-semibold
            transition-all
            hover:bg-[var(--color-surface-hover)]
            disabled:opacity-50
            sm:w-auto
          "
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="
            flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[var(--color-primary)]
            px-7
            font-semibold
            text-[var(--color-inverse)]
            transition-all
            hover:scale-[1.02]
            hover:bg-[var(--color-primary-hover)]
            active:scale-[0.98]
            disabled:pointer-events-none
            disabled:opacity-60
            sm:w-auto
          "
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Processing...
            </>
          ) : create ? (
            <>
              <Plus className="size-4" />
              Create Employee
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </button>

      </div>
    </div>
  );
}