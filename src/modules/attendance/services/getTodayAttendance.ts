import { SupabaseClient } from "@supabase/supabase-js";

export async function getTodayAttendance(
  supabase: SupabaseClient,
  restaurantId: string,
  staffId: string,
) {
  const today = new Date().toLocaleDateString("en-CA");

  const {
    data,
    error,
  } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("staff_id", staffId)
    .eq("shift_date", today)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}