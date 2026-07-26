"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { Staff } from "@/modules/staff/types";

type Props = {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onDeleted: () => void;
};



export default function DeleteStaffDialog({
  open,
  staff,
  onClose,
  onDeleted,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  if (!open || !staff) return null;

  async function handleDelete() {
    if (!staff) return;
  setLoading(true);

  try {
    const response = await fetch(
      "/api/dashboard/staff",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: staff.user_id,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data.error ?? "Failed to delete staff.",
      );
      return;
    }

    toast.success("Staff deleted successfully.");

    onDeleted();
    onClose();
  } finally {
    setLoading(false);
  }
}

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] p-4">
    <div
      className="
      w-full
      max-w-md
      rounded-[var(--radius-2xl)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      shadow-[var(--shadow-xl)]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--color-border)] p-6">
        <div className="flex items-center gap-4">
          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[var(--color-danger-soft)]
            "
          >
            <AlertTriangle className="size-6 text-[var(--color-danger)]" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-heading)]">
              Delete Staff
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-[var(--radius-md)]
          text-[var(--color-text-muted)]
          transition
          hover:bg-[var(--color-surface-hover)]
          "
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="p-6">
  <p className="text-sm text-[var(--color-text)]">
    Are you sure you want to delete this staff member?
  </p>

  <div
    className="
    mt-5
    rounded-[var(--radius-lg)]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface-soft)]
    p-4
    "
  >
    <div className="flex items-center gap-4">
      <div
        className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-[var(--color-primary-soft)]
        font-semibold
        text-[var(--color-primary)]
        "
      >
        {staff.profile?.full_name
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?"}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-[var(--color-heading)]">
          {staff.profile?.full_name}
        </h3>

        <p className="truncate text-sm text-[var(--color-text-muted)]">
          {staff.profile?.email}
        </p>

        <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-primary)]">
          {staff.role}
        </p>
      </div>
    </div>
  </div>
</div>

      <div
  className="
  flex
  gap-3
  border-t
  border-[var(--color-border)]
  p-6
  "
>
  <button
    type="button"
    onClick={onClose}
    disabled={loading}
    className="
    flex-1
    h-11
    rounded-[var(--radius-md)]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    font-medium
    text-[var(--color-text)]
    transition
    hover:bg-[var(--color-surface-hover)]
    disabled:opacity-50
    "
  >
    Cancel
  </button>

  <button
  type="button"
  onClick={handleDelete}
  disabled={loading}
    className="
    flex
    flex-1
    h-11
    items-center
    justify-center
    gap-2
    rounded-[var(--radius-md)]
    bg-[var(--color-danger)]
    font-medium
    text-white
    transition
    hover:opacity-90
    disabled:opacity-50
    "
  >
    {loading ? (
      <Loader2 className="size-5 animate-spin" />
    ) : (
      <>
        <Trash2 className="size-4" />
        Delete Staff
      </>
    )}
  </button>
</div>
    </div>
  </div>
);
}

