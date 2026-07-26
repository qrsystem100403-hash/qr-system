"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { AttendanceSettingsInput } from "@/modules/settings/schemas/attendance-settings.schema";

type Props = {
  settings: AttendanceSettingsInput;
};

export default function SaveAttendanceSettingsButton({
  settings,
}: Props) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      console.log("Sending settings:", settings);

      const response = await fetch(
        "/api/dashboard/settings/attendance",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            "Unable to save attendance settings.",
        );
      }

      toast.success(
        "Attendance settings saved successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Save Attendance Settings
          </>
        )}
      </button>
    </div>
  );
}