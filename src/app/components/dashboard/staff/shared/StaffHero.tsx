"use client";

import {
  Store,
  UserCircle2,
  Clock3,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import { useStaffDashboard } from "./StaffDashboardProvider";

function getCurrentDate() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getCurrentTime() {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export default function StaffHero() {
  const {
  restaurant,
  profile,
  attendance,
} = useStaffDashboard();

  const badge =
    attendance.status === "present"
      ? "bg-emerald-500/10 text-emerald-500"
      : attendance.status === "late"
      ? "bg-orange-500/10 text-orange-500"
      : "bg-slate-500/10 text-slate-500";

  const badgeText =
    attendance.status === "present"
      ? "Present"
      : attendance.status === "late"
      ? "Late"
      : "Not Clocked In";

  return (
    <section className="overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <div className="p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-soft)]">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.full_name}
                  className="h-20 w-20 rounded-3xl object-cover"
                />
              ) : (
                <UserCircle2 className="h-12 w-12 text-[var(--color-primary)]" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-black text-[var(--color-heading)]">
                {profile.full_name}
              </h1>

              <p className="mt-1 text-base font-semibold capitalize text-[var(--color-primary)]">
                {profile.role}
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  {restaurant.name}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {getCurrentDate()}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {getCurrentTime()}
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4 lg:min-w-[240px]">
            <div className="rounded-2xl border border-[var(--color-border)] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Shift
              </p>

              <p className="mt-2 text-xl font-black">
  {profile.shiftStart && profile.shiftEnd
    ? `${profile.shiftStart} - ${profile.shiftEnd}`
    : "No Shift Assigned"}
</p>
            </div>

            <div
              className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${badge}`}
            >
              <BadgeCheck className="h-5 w-5" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Attendance
                </p>

                <p className="text-lg font-black">
                  {badgeText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}