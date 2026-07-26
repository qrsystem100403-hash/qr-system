"use client";

import {
  Badge,
  CalendarDays,
} from "lucide-react";

import type { Staff } from "@/modules/staff/types";

import type {
  StaffDialogMode,
  StaffForm,
} from "./staff-dialog-types";

import RoleSelector from "./RoleSelector";
import EmploymentStatusSelector from "./EmploymentStatusSelector";

type Props = {
  mode: StaffDialogMode;

  staff?: Staff | null;

  form: StaffForm;

  setForm: React.Dispatch<
    React.SetStateAction<StaffForm>
  >;

  errors: Record<string, string>;

  setErrors: React.Dispatch<
    React.SetStateAction<
      Record<string, string>
    >
  >;
};

export default function StaffEmploymentSection({
  mode,
  staff,
  form,
  setForm,
  errors,
  setErrors,
}: Props) {
  const employeeId =
    (staff as any)?.employee_id ?? "";

  return (
    <section
      className="
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
      "
    >
      <div
        className="
          border-b
          border-[var(--color-border)]
          px-5
          py-4
        "
      >
        <h3
          className="
            text-lg
            font-semibold
            text-[var(--color-heading)]
          "
        >
          Employment Information
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Employee details and employment
          configuration.
        </p>
      </div>

      <div className="space-y-6 p-5">

        {/* Employee ID */}

        <div>

          <label
            className="
              mb-3
              block
              text-sm
              font-medium
              text-[var(--color-heading)]
            "
          >
            Employee ID
          </label>

          <div className="space-y-4">

            <div
              className="
                flex
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface-soft)]
                p-1
              "
            >

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    employee_id_mode: "auto",
                    employee_id: "",
                  }))
                }
                className={`
                  flex-1
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition-all

                  ${
                    form.employee_id_mode ===
                    "auto"
                      ? `
                        bg-[var(--color-surface)]
                        text-[var(--color-heading)]
                        shadow-sm
                      `
                      : `
                        text-[var(--color-text-muted)]
                      `
                  }
                `}
              >
                Auto Generate
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    employee_id_mode: "custom",
                  }))
                }
                className={`
                  flex-1
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition-all

                  ${
                    form.employee_id_mode ===
                    "custom"
                      ? `
                        bg-[var(--color-surface)]
                        text-[var(--color-heading)]
                        shadow-sm
                      `
                      : `
                        text-[var(--color-text-muted)]
                      `
                  }
                `}
              >
                Custom
              </button>

            </div>

            {form.employee_id_mode ===
            "custom" ? (

              <div>

                <div
                  className={`
                    flex
                    h-12
                    items-center
                    rounded-xl
                    border
                    px-4

                    ${
                      errors.employee_id
                        ? "border-[var(--color-danger)]"
                        : "border-[var(--color-border)]"
                    }
                  `}
                >

                  <Badge
                    className="
                      size-5
                      text-[var(--color-text-soft)]
                    "
                  />

                  <input
                    value={form.employee_id}
                    onChange={(e) => {

                      setErrors((prev) => ({
                        ...prev,
                        employee_id: "",
                      }));

                      setForm((prev) => ({
                        ...prev,
                        employee_id:
                          e.target.value
                            .toUpperCase(),
                      }));

                    }}
                    placeholder="EMP001"
                    className="
                      h-full
                      flex-1
                      bg-transparent
                      px-3
                      outline-none
                    "
                  />

                </div>

                {errors.employee_id && (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-[var(--color-danger)]
                    "
                  >
                    {errors.employee_id}
                  </p>
                )}

              </div>

            ) : (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-[var(--color-border)]
                  bg-[var(--color-surface-soft)]
                  p-4
                "
              >
                <p
                  className="
                    text-sm
                    text-[var(--color-text-muted)]
                  "
                >
                  Employee ID will be generated
                  automatically after creating
                  the employee.
                </p>
              </div>

            )}

          </div>

        </div>

        {/* Joined Date */}

                <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-[var(--color-heading)]
            "
          >
            Joined Date
          </label>

          <div
            className={`
              flex
              h-12
              items-center
              rounded-xl
              border
              px-4

              ${
                errors.joined_at
                  ? "border-[var(--color-danger)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >

            <CalendarDays
              className="
                size-5
                text-[var(--color-text-soft)]
              "
            />

            <input
              type="date"
              value={form.joined_at}
              onChange={(e) => {

                setErrors((prev) => ({
                  ...prev,
                  joined_at: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  joined_at: e.target.value,
                }));

              }}
              className="
                h-full
                flex-1
                bg-transparent
                px-3
                outline-none
              "
            />

          </div>

          {errors.joined_at && (

            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.joined_at}
            </p>

          )}

        </div>

        {/* Employee Role */}

        <div>

          <label
            className="
              mb-3
              block
              text-sm
              font-medium
              text-[var(--color-heading)]
            "
          >
            Employee Role
          </label>

          <RoleSelector
            value={form.role}
            onChange={(role) => {

              setErrors((prev) => ({
                ...prev,
                role: "",
              }));

              setForm((prev) => ({
                ...prev,
                role,
              }));

            }}
          />

          {errors.role && (

            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.role}
            </p>

          )}

        </div>

                {/* Employment Status */}

        <div>

          <label
            className="
              mb-3
              block
              text-sm
              font-medium
              text-[var(--color-heading)]
            "
          >
            Employment Status
          </label>

          <EmploymentStatusSelector
            value={form.employment_status}
            onChange={(status) => {

              setErrors((prev) => ({
                ...prev,
                employment_status: "",
              }));

              setForm((prev) => ({
                ...prev,
                employment_status: status,
              }));

            }}
          />

          {errors.employment_status && (
            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.employment_status}
            </p>
          )}

        </div>

      </div>

    </section>
  );
}