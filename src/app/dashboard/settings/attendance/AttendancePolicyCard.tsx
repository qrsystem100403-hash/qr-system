"use client";

import type { Dispatch, SetStateAction } from "react";
import * as Switch from "@radix-ui/react-switch";
import { MapPinned } from "lucide-react";
import type { AttendanceSettingsInput } from "@/modules/settings/schemas/attendance-settings.schema";

type Props = {
  settings: AttendanceSettingsInput;
  setSettings: Dispatch<
    SetStateAction<AttendanceSettingsInput>
  >;
};

export default function AttendancePolicyCard({
  settings,
  setSettings,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <div className="border-b border-[var(--color-border)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)]">
            <MapPinned className="h-7 w-7 text-[var(--color-primary)]" />
          </div>

          <div>
            <h2 className="text-2xl font-black">
              GPS Settings
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              Configure GPS based attendance validation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {/* GPS Toggle */}

        <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] p-5">
          <div>
            <h3 className="font-black">
              GPS Attendance
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Employees must be inside the
              configured attendance radius to
              clock in.
            </p>
          </div>

          <Switch.Root
            checked={
              settings.attendance_gps_enabled
            }
            onCheckedChange={(checked) =>
              setSettings((previous) => ({
                ...previous,
                attendance_gps_enabled:
                  checked,
              }))
            }
            className="relative h-7 w-12 rounded-full bg-slate-300 transition data-[state=checked]:bg-[var(--color-primary)]"
          >
            <Switch.Thumb className="block h-5 w-5 translate-x-1 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6" />
          </Switch.Root>
        </div>

        {/* Radius */}

        <div>
          <label className="mb-3 block text-sm font-black uppercase tracking-wide text-[var(--color-text-muted)]">
            Attendance Radius
          </label>

          <div className="relative">
            <input
              type="number"
              min={10}
              max={1000}
              value={
                settings.attendance_radius
              }
              onChange={(e) =>
                setSettings((previous) => ({
                  ...previous,
                  attendance_radius:
                    Number(e.target.value),
                }))
              }
              className="h-14 w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-5 pr-16 text-lg font-bold outline-none transition focus:border-[var(--color-primary)]"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-text-muted)]">
              meters
            </span>
          </div>
        </div>

        {/* Accuracy */}

        <div>
          <label className="mb-3 block text-sm font-black uppercase tracking-wide text-[var(--color-text-muted)]">
            Maximum GPS Accuracy
          </label>

          <div className="relative">
            <input
              type="number"
              min={5}
              max={200}
              value={
                settings.attendance_max_accuracy
              }
              onChange={(e) => {
  console.log(
    "Input changed:",
    Number(e.target.value),
  );

  setSettings((previous) => ({
    ...previous,
    attendance_max_accuracy: Number(
      e.target.value,
    ),
  }));
}}
              className="h-14 w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-5 pr-16 text-lg font-bold outline-none transition focus:border-[var(--color-primary)]"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-text-muted)]">
              meters
            </span>
          </div>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Recommended value: <strong>50 meters</strong>.
            Lower values require more precise GPS.
          </p>
        </div>
      </div>
    </section>
  );
}