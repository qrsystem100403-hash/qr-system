"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
} from "lucide-react";

type Props = {
  present: number;
  late: number;
  workedTime: string;
};

export default function AttendanceSummaryCard({
  present,
  late,
  workedTime,
}: Props) {
  return (
    <section
      className="
      rounded-xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      "
    >
      <div
        className="
        flex
        items-center
        justify-between
        border-b
        border-[var(--color-border)]
        px-5
        py-4
        "
      >
        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-[var(--color-primary)]"
          />

          <h2 className="font-semibold">
            Attendance Summary
          </h2>
        </div>

        <span className="text-sm text-[var(--color-text-muted)]">
          This Week
        </span>
      </div>

      <div className="space-y-4 p-5">

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">
            Present
          </span>

          <span className="font-semibold">
            {present}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">
            Late
          </span>

          <span className="font-semibold">
            {late}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">
            Worked
          </span>

          <span className="font-semibold">
            {workedTime}
          </span>
        </div>

      </div>

      <Link
        href="/dashboard/attendance"
        className="
        flex
        items-center
        justify-between
        border-t
        border-[var(--color-border)]
        px-5
        py-4
        text-sm
        font-medium
        transition
        hover:bg-[var(--color-surface-hover)]
        "
      >
        View Attendance History

        <ChevronRight size={18} />
      </Link>
    </section>
  );
}