"use client";

import {
  Clock3,
  LogIn,
  LogOut,
  Timer,
} from "lucide-react";

type Props = {
  employeeName: string;
  role: string;
  shift: string;
  status:
    | "not_started"
    | "present"
    | "late"
    | "completed";
  clockIn?: string | null;
  clockOut?: string | null;
  workedTime?: string | null;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  action: React.ReactNode;
};

export default function StaffAttendanceCard({
  employeeName,
  role,
  shift,
  status,
  clockIn,
  clockOut,
  workedTime,
  earlyLeaveMinutes = 0,
  overtimeMinutes = 0,
  action,
}: Props) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <section
      className="
      overflow-hidden
      rounded-xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      "
    >
      <div className="border-b border-[var(--color-border)] p-5">
        <p className="text-sm text-[var(--color-text-muted)]">
          {greeting}
        </p>

        <h1 className="mt-1 text-xl font-semibold text-[var(--color-heading)]">
          {employeeName}
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {role}
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-muted)]">
            Status
          </span>

          <span
            className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${
              status === "present"
                ? "bg-emerald-100 text-emerald-700"
                : status === "late"
                ? "bg-orange-100 text-orange-700"
                : status === "completed"
                ? "bg-slate-200 text-slate-700"
                : "bg-slate-100 text-slate-600"
            }
            `}
          >
            {status === "not_started"
              ? "Not Started"
              : status.charAt(0).toUpperCase() +
                status.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Clock3
            size={18}
            className="text-[var(--color-text-muted)]"
          />

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Shift
            </p>

            <p className="font-medium">
              {shift}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LogIn
            size={18}
            className="text-[var(--color-text-muted)]"
          />

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Clock In
            </p>

            <p className="font-medium">
              {clockIn ?? "--"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LogOut
            size={18}
            className="text-[var(--color-text-muted)]"
          />

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Clock Out
            </p>

            <p className="font-medium">
              {clockOut ?? "--"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Timer
            size={18}
            className="text-[var(--color-text-muted)]"
          />

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Worked
            </p>

            <p className="font-medium">
              {workedTime ?? "--"}
            </p>
          </div>
        </div>

        {earlyLeaveMinutes > 0 && (
          <div
            className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-orange-200
            bg-orange-50
            px-4
            py-3
            "
          >
            <span className="text-sm text-orange-700">
              Early Leave
            </span>

            <span className="font-semibold text-orange-700">
              {earlyLeaveMinutes} min
            </span>
          </div>
        )}

        {overtimeMinutes > 0 && (
          <div
            className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            "
          >
            <span className="text-sm text-emerald-700">
              Overtime
            </span>

            <span className="font-semibold text-emerald-700">
              {overtimeMinutes} min
            </span>
          </div>
        )}

        <div className="pt-2">
          {action}
        </div>
      </div>
    </section>
  );
}