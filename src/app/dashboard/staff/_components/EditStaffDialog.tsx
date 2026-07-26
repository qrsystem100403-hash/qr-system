"use client";

import { useState } from "react";
import { toast } from "sonner";

import StaffDialog from "../_components/dailog/StaffDialog";

import type { Staff } from "@/modules/staff/types";
import type { UpdateStaffInput } from "@/modules/staff/schemas";

type Props = {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditStaffDialog({
  open,
  staff,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    form: UpdateStaffInput,
  ) {
    if (!staff || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/dashboard/staff",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: staff.user_id,
            ...form,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(
          data.error ??
            "Failed to update employee.",
        );
        return;
      }

      toast.success(
        "Employee updated successfully.",
      );

      onClose();

      await onUpdated();
    } catch {
      toast.error(
        "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!staff) {
    return null;
  }

  return (
    <StaffDialog
      open={open}
      mode="edit"
      staff={staff}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}