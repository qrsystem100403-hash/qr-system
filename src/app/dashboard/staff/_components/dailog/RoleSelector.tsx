"use client";

import {
  Briefcase,
  CheckCircle2,
  ChefHat,
  CreditCard,
  UserRound,
} from "lucide-react";

import type { StaffForm } from "./staff-dialog-types";

type Role = StaffForm["role"];

type Props = {
  value: Role;
  onChange: (role: Role) => void;
};

const roles = [
  {
    value: "manager",
    title: "Manager",
    icon: Briefcase,
  },
  {
    value: "cashier",
    title: "Cashier",
    icon: CreditCard,
  },
  {
    value: "kitchen",
    title: "Kitchen",
    icon: ChefHat,
  },
  {
    value: "waiter",
    title: "Waiter",
    icon: UserRound,
  },
] as const;

export default function RoleSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((role) => {
        const Icon = role.icon;

        const active =
          value === role.value;

        return (
          <button
            key={role.value}
            type="button"
            onClick={() =>
              onChange(role.value)
            }
            className={`
              relative
              flex
              items-center
              gap-3
              rounded-2xl
              border
              p-3
              transition-all
              duration-200

              ${
                active
                  ? `
                    border-[var(--color-primary)]
                    bg-[var(--color-primary-soft)]
                  `
                  : `
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-surface-hover)]
                  `
              }
            `}
          >
            <div
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl

                ${
                  active
                    ? `
                      bg-[var(--color-primary)]
                      text-white
                    `
                    : `
                      bg-[var(--color-surface-soft)]
                      text-[var(--color-primary)]
                    `
                }
              `}
            >
              <Icon className="size-5" />
            </div>

            <div className="flex-1 text-left">
              <p
                className="
                  font-semibold
                  text-[var(--color-heading)]
                "
              >
                {role.title}
              </p>
            </div>

            {active && (
              <CheckCircle2
                className="
                  size-5
                  text-[var(--color-success)]
                "
              />
            )}
          </button>
        );
      })}
    </div>
  );
}