import { SupabaseClient } from "@supabase/supabase-js";
import type { AttendanceSettingsInput } from "../schemas/attendance-settings.schema";

export async function getAttendanceSettings(
  supabase: SupabaseClient,
  restaurantId: string,
): Promise<AttendanceSettingsInput> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(`
  attendance_gps_enabled,
  attendance_radius,
  attendance_max_accuracy,
  attendance_latitude,
  attendance_longitude,
  attendance_location_accuracy,
  attendance_location_updated_at
`)
    .eq("id", restaurantId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}