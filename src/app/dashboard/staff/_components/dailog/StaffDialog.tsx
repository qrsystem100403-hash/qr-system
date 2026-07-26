"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

import DashboardBottomSheet from "@/app/components/dashboard/mobile/DashboardBottomSheet";

import type { Staff } from "@/modules/staff/types";
import type {
  CreateStaffInput,
  UpdateStaffInput,
} from "@/modules/staff/schemas";

import {
  createStaffSchema,
  updateStaffSchema,
} from "@/modules/staff/schemas";

import type {
  StaffDialogMode,
  StaffForm,
} from "./staff-dialog-types";

import StaffDialogHeader from "./StaffDialogHeader";
import StaffBasicSection from "./StaffBasicSection";
import StaffEmploymentSection from "./StaffEmploymentSection";
import StaffShiftSection from "./StaffShiftSection";
import StaffCredentialsSection from "./StaffCredentialsSection";
import DialogFooter from "./DialogFooter";


type Props = {
  open: boolean;
  mode: StaffDialogMode;
  staff?: Staff | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    form: CreateStaffInput | UpdateStaffInput,
  ) => Promise<void>;
};

const defaultForm: StaffForm = {
  full_name: "",

  email: "",

  phone: "",

  employee_id: "",

  employee_id_mode: "auto",

  role: "waiter",

  employment_status: "active",

  joined_at: new Date()
    .toISOString()
    .slice(0, 10),

  shift_mode: "custom",

  attendance_shift_start: "10:00",

  attendance_shift_end: "19:00",

  password: "",
};


export default function StaffDialog({
  open,
  mode,
  staff,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const isMobile =
    useMediaQuery("(max-width:768px)");

  const [form, setForm] =
    useState<StaffForm>(defaultForm);

    const [errors, setErrors] = useState<
  Record<string, string>
>({});

function handleClose() {
  setErrors({});

  if (mode === "create") {
    setForm(defaultForm);
  }

  onClose();
}

  useEffect(() => {
    if (!open) return;
    setErrors({});

    if (
      mode === "edit" &&
      staff
    ) {
      setForm({
        full_name:
          staff.profile?.full_name ?? "",

        email:
          staff.profile?.email ?? "",

        phone:
          staff.profile?.phone ?? "",

        employee_id:
          (staff as any)
            .employee_id ?? "",

        employee_id_mode:
  (staff as any)?.employee_id
    ? "custom"
    : "auto",

        role: staff.role,

        employment_status:
          (staff as any)
            .employment_status ??
          "active",

        joined_at:
          (staff as any).joined_at ??
          new Date()
            .toISOString()
            .slice(0, 10),

        shift_mode:
          (staff as any)
            .shift_mode ??
          "custom",

        attendance_shift_start:
          staff.attendance_shift_start ??
          "10:00",

        attendance_shift_end:
          staff.attendance_shift_end ??
          "19:00",

        password: "",
      });

      return;
    }

    setForm(defaultForm);
  }, [
    open,
    mode,
    staff,
  ]);

  const title =
    mode === "create"
      ? "Add Employee"
      : "Edit Employee";


      async function handleSubmit() {

  if (mode === "create") {

    const result =
      createStaffSchema.safeParse(form);

    if (!result.success) {

      const fieldErrors: Record<
        string,
        string
      > = {};

      for (const issue of result.error.issues) {
        const field =
          issue.path[0] as string;

        if (!fieldErrors[field]) {
          fieldErrors[field] =
            issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSubmit(result.data);

    return;
  }

  const result =
    updateStaffSchema.safeParse(form);

  if (!result.success) {

    const fieldErrors: Record<
      string,
      string
    > = {};

    for (const issue of result.error.issues) {
      const field =
        issue.path[0] as string;

      if (!fieldErrors[field]) {
        fieldErrors[field] =
          issue.message;
      }
    }

    setErrors(fieldErrors);
    return;
  }

  setErrors({});
  await onSubmit(result.data);

}

    const content = (
    <>
      <StaffDialogHeader
        mode={mode}
        onClose={handleClose}
      />

      <div
        className="
          flex
          flex-col
          gap-6
          p-6
        "
      >
        <StaffBasicSection
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
        />

        <StaffEmploymentSection
          mode={mode}
          staff={staff}
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
        />

        <StaffShiftSection
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
        />

        {mode === "create" && (
          <StaffCredentialsSection
            form={form}
            setForm={setForm}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </div>

      <DialogFooter
        mode={mode}
        loading={loading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
        
      />
    </>
  );



  if (isMobile) {
    return (
      <DashboardBottomSheet
        open={open}
        title={title}
        onOpenChange={(value) => {
          if (!value) {
            handleClose();
          }
        }}
      >
        {content}
      </DashboardBottomSheet>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[1000]
        flex
        items-center
        justify-center
        bg-black/40
        p-5
      "
    >
      <div
        className="
          flex
          w-full
          max-w-3xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          shadow-[var(--shadow-xl)]
        "
      >
        <div
          className="
            flex-1
            overflow-y-auto
          "
        >
          {content}
        </div>
      </div>
    </div>
  );
}