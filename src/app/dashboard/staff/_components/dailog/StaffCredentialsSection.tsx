"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
  Lock,
  Sparkles,
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

export default function StaffCredentialsSection({
  form,
  setForm,
  errors,
  setErrors,
}: Props) {
  const [showPassword, setShowPassword] =
    useState(false);

  function generatePassword() {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";

    let password = "";

    for (let i = 0; i < 12; i++) {
      password += chars.charAt(
        Math.floor(
          Math.random() *
            chars.length,
        ),
      );
    }

    setErrors((prev) => ({
      ...prev,
      password: "",
    }));

    setForm((prev) => ({
      ...prev,
      password,
    }));
  }

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
          Login Credentials
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Set the employee login password.
        </p>
      </div>

      <div className=" space-y-5 p-5">

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-medium
            "
          >
            Password
          </label>
                    <div
            className={`
              flex
              items-center
              rounded-xl
              border
              bg-[var(--color-surface)]
              px-4

              ${
                errors.password
                  ? "border-[var(--color-danger)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >
            <Lock
              className="
                size-5
                text-[var(--color-text-soft)]
              "
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={(e) => {

                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));

                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));

              }}
              placeholder="Enter password"
              className="
                h-12
                flex-1
                bg-transparent
                px-3
                outline-none
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword,
                )
              }
              className="
                mr-2
                rounded-lg
                p-1
                transition
                hover:bg-[var(--color-surface-soft)]
              "
            >
              {showPassword ? (
                <EyeOff className="size-5 text-[var(--color-text-soft)]" />
              ) : (
                <Eye className="size-5 text-[var(--color-text-soft)]" />
              )}
            </button>

            <button
              type="button"
              onClick={generatePassword}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-[var(--color-primary-soft)]
                px-3
                py-2
                text-sm
                font-medium
                text-[var(--color-primary)]
                transition
                hover:opacity-90
              "
            >
              <Sparkles className="size-4" />

              Generate
            </button>

          </div>

          {errors.password && (
            <p
              className="
                mt-2
                text-sm
                text-[var(--color-danger)]
              "
            >
              {errors.password}
            </p>
          )}

          <p
            className="
              mt-2
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            This password will be used with the
            employee ID to sign in to the staff
            application.
          </p>

        </div>

      </div>

    </section>
  );
}