"use client";

import {
  Mail,
  Phone,
  User,
} from "lucide-react";

import type { StaffForm } from "./staff-dialog-types";

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

export default function StaffBasicSection({
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
          Personal Information
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Basic employee details.
        </p>
      </div>

      <div className="space-y-5 p-5">

        {/* Full Name */}

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
            Full Name
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
                errors.full_name
                  ? "border-[var(--color-danger)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >

            <User
              className="
                size-5
                text-[var(--color-text-soft)]
              "
            />

            <input
              value={form.full_name}
              onChange={(e) => {
                setErrors((prev) => ({
                  ...prev,
                  full_name: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  full_name:
                    e.target.value,
                }));
              }}
              placeholder="Rahul Sharma"
              className="
                h-full
                flex-1
                bg-transparent
                px-3
                outline-none
              "
            />

          </div>

          {errors.full_name && (
            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.full_name}
            </p>
          )}

        </div>

        {/* Email */}
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
            Email Address
          </label>

          <div
            className={`
              flex
              h-12
              items-center
              rounded-xl
              border
              bg-[var(--color-surface)]
              px-4

              ${
                errors.email
                  ? "border-[var(--color-danger)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >

            <Mail
              className="
                size-5
                text-[var(--color-text-soft)]
              "
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              placeholder="employee@email.com"
              className="
                h-full
                flex-1
                bg-transparent
                px-3
                outline-none
                text-[var(--color-text)]
                placeholder:text-[var(--color-text-soft)]
              "
            />

          </div>

          {errors.email && (
            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.email}
            </p>
          )}

        </div>

        {/* Phone */}

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
            Phone Number
          </label>

          <div
            className={`
              flex
              h-12
              items-center
              rounded-xl
              border
              bg-[var(--color-surface)]
              px-4

              ${
                errors.phone
                  ? "border-[var(--color-danger)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >

            <Phone
              className="
                size-5
                text-[var(--color-text-soft)]
              "
            />

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

                setErrors((prev) => ({
                  ...prev,
                  phone: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  phone: value,
                }));
              }}
              placeholder="98XXXXXXXX"
              className="
                h-full
                flex-1
                bg-transparent
                px-3
                outline-none
                text-[var(--color-text)]
                placeholder:text-[var(--color-text-soft)]
              "
            />

          </div>

          {errors.phone && (
            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.phone}
            </p>
          )}

        </div>

      </div>

    </section>
  );
}