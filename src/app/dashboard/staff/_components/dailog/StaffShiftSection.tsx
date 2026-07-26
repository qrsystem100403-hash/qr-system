"use client";

import {
  CalendarClock,
  Clock3,
} from "lucide-react";

import type {
  StaffForm,
} from "./staff-dialog-types";

type Props = {
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

export default function StaffShiftSection({
  form,
  setForm,
  errors,
  setErrors,
}: Props) {
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
          Shift Assignment
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Configure employee working hours.
        </p>
      </div>

      <div className="space-y-5 p-5">

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
            Shift Type
          </label>

          <div
            className="
              flex
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              p-1
            "
          >

            <button
              type="button"
              onClick={() => {

                setErrors((prev) => ({
                  ...prev,
                  shift_mode: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  shift_mode: "template",
                }));

              }}
              className={`
                flex
                h-11
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                text-sm
                font-semibold
                transition-all

                ${
                  form.shift_mode ===
                  "template"
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
              <CalendarClock className="size-4" />

              Template

            </button>

            <button
              type="button"
              onClick={() => {

                setErrors((prev) => ({
                  ...prev,
                  shift_mode: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  shift_mode: "custom",
                }));

              }}
              className={`
                flex
                h-11
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                text-sm
                font-semibold
                transition-all

                ${
                  form.shift_mode ===
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
              <Clock3 className="size-4" />

              Custom

            </button>

          </div>

          {errors.shift_mode && (
            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.shift_mode}
            </p>
          )}

        </div>

        {/* Template */}

                {form.shift_mode === "template" && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">
                  Shift Template
                </h4>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--color-text-muted)]
                  "
                >
                  Assign one of your predefined
                  shifts.
                </p>
              </div>

              <span
                className="
                  rounded-full
                  bg-[var(--color-primary-soft)]
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-[var(--color-primary)]
                "
              >
                Coming Soon
              </span>
            </div>
          </div>
        )}

        {/* Custom */}

        {form.shift_mode === "custom" && (
          <div className="grid gap-4 md:grid-cols-2">

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Shift Start
              </label>

              <input
                type="time"
                value={form.attendance_shift_start}
                onChange={(e) => {

                  setErrors((prev) => ({
                    ...prev,
                    attendance_shift_start: "",
                  }));

                  setForm((prev) => ({
                    ...prev,
                    attendance_shift_start:
                      e.target.value,
                  }));

                }}
                className={`
                  h-12
                  w-full
                  rounded-xl
                  border
                  bg-transparent
                  px-4

                  ${
                    errors.attendance_shift_start
                      ? "border-[var(--color-danger)]"
                      : "border-[var(--color-border)]"
                  }
                `}
              />

              {errors.attendance_shift_start && (
                <p
                  className="
                    mt-2
                    text-sm
                    text-[var(--color-danger)]
                  "
                >
                  {errors.attendance_shift_start}
                </p>
              )}

            </div>

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Shift End
              </label>

              <input
                type="time"
                value={form.attendance_shift_end}
                onChange={(e) => {

                  setErrors((prev) => ({
                    ...prev,
                    attendance_shift_end: "",
                  }));

                  setForm((prev) => ({
                    ...prev,
                    attendance_shift_end:
                      e.target.value,
                  }));

                }}
                className={`
                  h-12
                  w-full
                  rounded-xl
                  border
                  bg-transparent
                  px-4

                  ${
                    errors.attendance_shift_end
                      ? "border-[var(--color-danger)]"
                      : "border-[var(--color-border)]"
                  }
                `}
              />

              {errors.attendance_shift_end && (
                <p
                  className="
                    mt-2
                    text-sm
                    text-[var(--color-danger)]
                  "
                >
                  {errors.attendance_shift_end}
                </p>
              )}

            </div>

          </div>
        )}

      </div>

    </section>
  );
}