"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import StaffDialog from "../_components/dailog/StaffDialog";

import type {
  CreateStaffInput,
  UpdateStaffInput,
} from "@/modules/staff/schemas";



type Props = {
  onCreated?: () => void;
};

export default function AddStaffDialog({
  onCreated,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

 async function handleSubmit(
  form: CreateStaffInput | UpdateStaffInput,
) {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/dashboard/staff",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {

  if (
    data.field &&
    data.error
  ) {
    toast.error(data.error);
  } else {
    toast.error(
      data.error ??
      "Failed to create employee.",
    );
  }

  return;
}

      toast.success(
        "Employee created successfully.",
      );

      setOpen(false);

      await onCreated?.();
    } catch {
      toast.error(
        "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex
          h-11
          items-center
          gap-2
          rounded-[var(--radius-md)]
          bg-[var(--color-primary)]
          px-5
          font-semibold
          text-[var(--color-inverse)]
          shadow-[var(--shadow-sm)]
          transition-all
          hover:bg-[var(--color-primary-hover)]
        "
      >
        <Plus className="size-4" />

        Add Employee
      </button>

      <StaffDialog
        open={open}
        mode="create"
        loading={loading}
        onClose={() =>
          setOpen(false)
        }
        onSubmit={handleSubmit}
      />
    </>
  );
}