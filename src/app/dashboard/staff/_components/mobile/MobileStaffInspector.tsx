"use client";

import {
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Clock3,
  Pencil,
  UserMinus,
  KeyRound,
  Trash2,
} from "lucide-react";

import DashboardBottomSheet from "@/app/components/dashboard/mobile/DashboardBottomSheet";

import type { Staff } from "@/modules/staff/types";
import RestaurantLogo from "@/app/components/RestaurantLogo";

type Props = {
  open: boolean;
  staff: Staff | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function MobileStaffInspector({
  open,
  staff,
  onOpenChange,
  onEdit,
  onToggleStatus,
}: Props) {
  if (!staff) return null;

  return (
    <DashboardBottomSheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-6 p-5">

        {/* Header */}

        <div className="flex items-center gap-4">

          <div
            className="
              h-20
              w-20
              overflow-hidden
              rounded-3xl
              bg-[var(--color-primary-soft)]
            "
          >
            <RestaurantLogo
              logo={null}
              name={
                staff.profile?.full_name ??
                "Unknown"
              }
              size={80}
            />
          </div>

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-[var(--color-heading)]
              "
            >
              {staff.profile?.full_name}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[var(--color-text-muted)]
              "
            >
              EMP-001
            </p>

            <div className="mt-3">

              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-bold

                  ${
                    staff.profile?.is_active
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }
                `}
              >
                {staff.profile?.is_active
                  ? "Active"
                  : "On Leave"}
              </span>

            </div>

          </div>

        </div>

        {/* Details */}

        <div
          className="
            rounded-3xl
            border
            border-[var(--color-border)]
            bg-[var(--color-surface-soft)]
            p-4
          "
        >

          <InfoRow
            icon={<Briefcase className="size-4" />}
            label="Role"
            value={staff.role}
          />

          <InfoRow
            icon={<Clock3 className="size-4" />}
            label="Shift"
            value="Not Assigned"
          />

          <InfoRow
            icon={<Phone className="size-4" />}
            label="Phone"
            value={
              staff.profile?.phone ??
              "Not Added"
            }
          />

          <InfoRow
            icon={<Mail className="size-4" />}
            label="Email"
            value={
              staff.profile?.email ??
              "Not Added"
            }
          />

          <InfoRow
            icon={<Calendar className="size-4" />}
            label="Joined"
            value={new Date(
              staff.created_at
            ).toLocaleDateString()}
          />

        </div>

        {/* Actions */}

        <div className="space-y-3">

          <ActionButton
            icon={<Pencil className="size-5" />}
            label="Edit Employee"
            onClick={() => {
              onOpenChange(false);
              onEdit(staff);
            }}
          />

          <ActionButton
            icon={<UserMinus className="size-5" />}
            label={
              staff.profile?.is_active
                ? "Mark On Leave"
                : "Reactivate"
            }
            onClick={() => {
              onOpenChange(false);
              onToggleStatus(staff);
            }}
          />

          <ActionButton
            icon={<KeyRound className="size-5" />}
            label="Reset Password"
          />

          <ActionButton
            danger
            icon={<Trash2 className="size-5" />}
            label="Delete Employee"
          />

        </div>

      </div>
    </DashboardBottomSheet>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        py-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          text-[var(--color-text-muted)]
        "
      >
        {icon}
        <span>{label}</span>
      </div>

      <span
        className="
          text-sm
          font-semibold
          text-[var(--color-heading)]
        "
      >
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        px-4
        py-4
        transition-all

        ${
          danger
            ? "border-red-200 text-red-600 hover:bg-red-50"
            : "border-[var(--color-border)] hover:bg-[var(--color-surface-soft)]"
        }
      `}
    >
      {icon}
      <span className="font-semibold">
        {label}
      </span>
    </button>
  );
}