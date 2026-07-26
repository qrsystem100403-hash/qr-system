import { SupabaseClient } from "@supabase/supabase-js";
import type { AttendanceSettingsInput } from "../schemas/attendance-settings.schema";

export async function updateAttendanceSettings(
  supabase: SupabaseClient,
  restaurantId: string,
  settings: AttendanceSettingsInput,
) {
  const { data, error } = await supabase
  .from("restaurants")
  .update({
    attendance_gps_enabled:
      settings.attendance_gps_enabled,
    attendance_radius:
      settings.attendance_radius,
    attendance_max_accuracy:
      settings.attendance_max_accuracy,
    attendance_latitude:
      settings.attendance_latitude,
    attendance_longitude:
      settings.attendance_longitude,
    attendance_location_accuracy:
      settings.attendance_location_accuracy,
    attendance_location_updated_at:
      new Date().toISOString(),
  })
  .eq("id", restaurantId)
  .select();

console.log("UPDATED ROW:", data);

console.log(
  "Updating DB with:",
  settings.attendance_max_accuracy,
);

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}