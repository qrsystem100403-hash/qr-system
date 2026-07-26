import { SupabaseClient } from "@supabase/supabase-js";

import { ValidationError } from "@/lib/errors/validationError";

import type { ClockInInput } from "../types";
import { calculateDistance } from "../utils/calculateDistance";
import { getAttendanceDate } from "../utils/getAttendanceDate";

export async function clockOut(
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
      attendance_longitude
    `)
    .eq("id", input.restaurantId)
    .single();

  if (restaurantError) {
    throw restaurantError;
  }

  if (!restaurant) {
    throw new ValidationError("Restaurant not found.");
  }

  if (restaurant.attendance_gps_enabled) {
    if (
      restaurant.attendance_latitude == null ||
      restaurant.attendance_longitude == null
    ) {
      throw new ValidationError(
        "Restaurant location is not configured.",
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
        `You are ${distance}m away from the restaurant. Move within ${restaurant.attendance_radius}m to clock out.`,
      );
    }
  }

  const {
    data: staff,
    error: staffError,
  } = await supabase
    .from("restaurant_users")
    .select(`
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

  const today = getAttendanceDate();

  const {
    data: attendance,
    error: attendanceError,
  } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq("restaurant_id", input.restaurantId)
    .eq("staff_id", input.staffId)
    .eq("shift_date", today)
    .single();

  if (attendanceError) {
    throw attendanceError;
  }

  if (!attendance) {
    throw new ValidationError(
      "Attendance record not found for today.",
    );
  }

  if (!attendance.clock_in_at) {
    throw new ValidationError(
      "You have not clocked in today.",
    );
  }

  if (attendance.clock_out_at) {
    throw new ValidationError(
      "You have already clocked out.",
    );
  }

  const now = new Date();

  const clockIn = new Date(
    attendance.clock_in_at,
  );

  const workedMinutes = Math.max(
    0,
    Math.floor(
      (now.getTime() -
        clockIn.getTime()) /
        60000,
    ),
  );

  let earlyLeaveMinutes = 0;
  let overtimeMinutes = 0;

  if (staff.attendance_shift_end) {
    const [hour, minute] =
      staff.attendance_shift_end
        .split(":")
        .map(Number);

    const shiftEnd = new Date(now);

    shiftEnd.setHours(
      hour,
      minute,
      0,
      0,
    );

    if (now < shiftEnd) {
      earlyLeaveMinutes = Math.floor(
        (shiftEnd.getTime() -
          now.getTime()) /
          60000,
      );
    } else {
      overtimeMinutes = Math.floor(
        (now.getTime() -
          shiftEnd.getTime()) /
          60000,
      );
    }
  }

  const {
    data: updatedAttendance,
    error: updateError,
  } = await supabase
    .from("attendance_logs")
    .update({
      clock_out_at: now.toISOString(),
      worked_minutes: workedMinutes,
      early_leave_minutes: earlyLeaveMinutes,
      overtime_minutes: overtimeMinutes,
      clock_out_lat: input.location.latitude,
      clock_out_lng: input.location.longitude,
      clock_out_accuracy: input.location.accuracy,
    })
    .eq("id", attendance.id)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    attendance: updatedAttendance,
    workedMinutes,
    earlyLeaveMinutes,
    overtimeMinutes,
  };
}