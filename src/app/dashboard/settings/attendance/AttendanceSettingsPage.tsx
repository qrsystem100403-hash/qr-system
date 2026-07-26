"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { AttendanceSettingsInput } from "@/modules/settings/schemas/attendance-settings.schema";

import AttendancePolicyCard from "./AttendancePolicyCard";
import RestaurantLocationCard from "./RestaurantLocationCard";
import SaveAttendanceSettingsButton from "./SaveAttendanceSettingsButton";

export default function AttendanceSettingsPage() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] =
    useState<AttendanceSettingsInput>({
      attendance_gps_enabled: true,
      attendance_radius: 100,
      attendance_max_accuracy: 50,

      attendance_latitude: null,
      attendance_longitude: null,
      attendance_location_accuracy: null,
    });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch(
        "/api/dashboard/settings/attendance",
      );

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 mb-2 md:mb-0 ">
      

      <div className="grid gap-6 xl:grid-cols-2">
        <AttendancePolicyCard
          settings={settings}
          setSettings={setSettings}
        />

        <RestaurantLocationCard
          settings={settings}
          setSettings={setSettings}
        />
      </div>

      <SaveAttendanceSettingsButton
        settings={settings}
      />
    </div>
  );
}