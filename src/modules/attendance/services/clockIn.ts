import { SupabaseClient } from "@supabase/supabase-js";

import { ValidationError } from "@/lib/errors/validationError";

import type { ClockInInput } from "../types";
import { getAttendanceDate } from "../utils/getAttendanceDate";
import { calculateDistance } from "../utils/calculateDistance";

export async function clockIn(
  supabase: SupabaseClient,
  input: ClockInInput,
) {
  const {
    data: restaurant,
    error: restaurantError,
  } = await supabase
    .from("restaurants")
    .select(`
      attendance_gps_enabled,
      attendance_radius,
      attendance_max_accuracy,
      attendance_latitude,
      attendance_longitude,
      attendance_grace_minutes
    `)
    .eq("id", input.restaurantId)
    .single();

  if (restaurantError) {
    throw restaurantError;
  }

  if (!restaurant) {
    throw new ValidationError("Restaurant not found.");
  }

  if (!restaurant.attendance_gps_enabled) {
    throw new ValidationError(
      "GPS attendance is disabled for this restaurant.",
    );
  }

  if (
    restaurant.attendance_latitude == null ||
    restaurant.attendance_longitude == null
  ) {
    throw new ValidationError(
      "Restaurant attendance location has not been configured.",
    );
  }

  const {
    data: staff,
    error: staffError,
  } = await supabase
    .from("restaurant_users")
    .select(`
      is_active,
      attendance_shift_start,
      attendance_shift_end
    `)
    .eq("id", input.staffId)
    .single();

  if (staffError) {
    throw staffError;
  }

  if (!staff) {
    throw new ValidationError("Staff member not found.");
  }

  if (!staff.is_active) {
    throw new ValidationError(
      "Your account is inactive.",
    );
  }

  if (
    input.location.accuracy >
    restaurant.attendance_max_accuracy
  ) {
    throw new ValidationError(
      `GPS accuracy is too low (${Math.round(
        input.location.accuracy,
      )}m). Please enable High Accuracy location and try again.`,
    );
  }

  const distance = calculateDistance(
    restaurant.attendance_latitude,
    restaurant.attendance_longitude,
    input.location.latitude,
    input.location.longitude,
  );

  if (
    distance >
    restaurant.attendance_radius
  ) {
    throw new ValidationError(
      `You are ${distance}m away from the restaurant. Move within ${restaurant.attendance_radius}m to clock in.`,
    );
  }

  const now = new Date();
  const today = getAttendanceDate(now);

  const {
    data: existingAttendance,
    error: attendanceError,
  } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("restaurant_id", input.restaurantId)
    .eq("staff_id", input.staffId)
    .eq("shift_date", today)
    .maybeSingle();

  if (attendanceError) {
    throw attendanceError;
  }

  if (existingAttendance) {
    throw new ValidationError(
      "You have already clocked in today.",
    );
  }

  const shiftStartTime =
    staff.attendance_shift_start ??
    "10:00:00";

  const [shiftHour, shiftMinute] =
    shiftStartTime
      .split(":")
      .map(Number);

  const shiftStart = new Date(now);

  shiftStart.setHours(
    shiftHour,
    shiftMinute,
    0,
    0,
  );

  const allowedClockIn = new Date(
    shiftStart.getTime() +
      restaurant.attendance_grace_minutes *
        60 *
        1000,
  );

  const lateMinutes =
    now > allowedClockIn
      ? Math.floor(
          (now.getTime() -
            allowedClockIn.getTime()) /
            60000,
        )
      : 0;

  const status =
    lateMinutes > 0
      ? "late"
      : "present";

  const {
    data: attendance,
    error: insertError,
  } = await supabase
    .from("attendance_logs")
    .insert({
      restaurant_id: input.restaurantId,
      staff_id: input.staffId,
      shift_date: today,
      clock_in_at: now.toISOString(),
      status,
      worked_minutes: 0,
      late_minutes: lateMinutes,
      shift_start: staff.attendance_shift_start,
      shift_end: staff.attendance_shift_end,
      clock_in_lat: input.location.latitude,
      clock_in_lng: input.location.longitude,
      clock_in_accuracy: input.location.accuracy,
      attendance_source: "gps",
      device_id: null,
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return {
    attendance,
    distance,
    lateMinutes,
    status,
  };
}