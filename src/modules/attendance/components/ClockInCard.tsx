"use client";

import {
  Clock3,
  CalendarDays,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type AttendanceStatus =
  | "not_started"
  | "present"
  | "late";

type Attendance = {
  status: AttendanceStatus;
  clockInAt?: string;
  workedMinutes?: number;
  lateMinutes?: number;
};

type Props = {
  attendance: Attendance | null;
  loading?: boolean;
  onClockIn?: () => void;
};

function formatWorkedTime(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hrs}h ${mins}m`;
}

export default function ClockInCard({
  attendance,
  loading = false,
  onClockIn,
}: Props) {
  const current =
    attendance?.status ?? "not_started";

  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)]">
            <Clock3 className="h-6 w-6 text-[var(--color-primary)]" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Attendance
            </p>

            <h2 className="text-2xl font-black">
              Today's Shift
            </h2>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-6">
        <div className="rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-muted)]">
              Status
            </span>

            {current === "not_started" && (
              <span className="rounded-full bg-neutral-500/10 px-3 py-1 text-xs font-bold text-neutral-500">
                Not Started
              </span>
            )}

            {current === "present" && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
                Present
              </span>
            )}

            {current === "late" && (
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500">
                Late
              </span>
            )}
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <CalendarDays className="h-4 w-4" />
                Shift
              </div>

              <span className="font-semibold">
                10:00 AM – 7:00 PM
              </span>
            </div>

            {attendance?.clockInAt && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Clock3 className="h-4 w-4" />
                  Clock In
                </div>

                <span className="font-semibold">
                  {attendance.clockInAt}
                </span>
              </div>
            )}

            {attendance?.workedMinutes !==
              undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <CheckCircle2 className="h-4 w-4" />
                  Working
                </div>

                <span className="font-bold text-[var(--color-primary)]">
                  {formatWorkedTime(
                    attendance.workedMinutes,
                  )}
                </span>
              </div>
            )}

            {attendance?.lateMinutes !==
              undefined &&
              attendance.lateMinutes > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Late By
                  </div>

                  <span className="font-bold text-orange-500">
                    {attendance.lateMinutes} min
                  </span>
                </div>
              )}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
          <MapPin className="h-5 w-5 text-blue-500" />

          <p className="text-[var(--color-text-muted)]">
            GPS verification is required before
            clocking in.
          </p>
        </div>

        {current === "not_started" && (
          <button
            onClick={onClockIn}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--color-primary)] font-black text-[var(--color-bg)] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Checking Location...
              </>
            ) : (
              <>
                <Clock3 className="h-5 w-5" />
                Clock In
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}