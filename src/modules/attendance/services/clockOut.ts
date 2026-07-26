import { SupabaseClient } from "@supabase/supabase-js";
import { calculateDistance } from "../utils/calculateDistance";
import { getAttendanceDate } from "../utils/getAttendanceDate";
import type { ClockInInput } from "../types";

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
    throw new Error("Restaurant not found.");
  }

  if (restaurant.attendance_gps_enabled) {
    if (
      restaurant.attendance_latitude == null ||
      restaurant.attendance_longitude == null
    ) {
      throw new Error(
        "Restaurant location is not configured.",
      );
    }

    if (
      input.location.accuracy >
      restaurant.attendance_max_accuracy
    ) {
      throw new Error(
        `GPS accuracy is too low (${Math.round(
          input.location.accuracy,
        )}m).`,
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
      throw new Error(
        `You are ${distance}m away from the restaurant.`,
      );
    }
  }

  const {
    data: staff,
    error: staffError,
  } = await supabase
    .from("restaurant_users")
    .select(
      "attendance_shift_start, attendance_shift_end",
    )
    .eq("id", input.staffId)
    .single();

  if (staffError) {
    throw staffError;
  }

  const today = getAttendanceDate();

  const {
    data: attendance,
    error: attendanceError,
  } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq(
      "restaurant_id",
      input.restaurantId,
    )
    .eq("staff_id", input.staffId)
    .eq("shift_date", today)
    .single();

  if (attendanceError) {
    throw attendanceError;
  }

  if (!attendance.clock_in_at) {
    throw new Error(
      "You have not clocked in today.",
    );
  }

  if (attendance.clock_out_at) {
    throw new Error(
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
      clock_out_at:
        now.toISOString(),

      worked_minutes:
        workedMinutes,

      early_leave_minutes:
        earlyLeaveMinutes,

      overtime_minutes:
        overtimeMinutes,

      clock_out_lat:
        input.location.latitude,

      clock_out_lng:
        input.location.longitude,

      clock_out_accuracy:
        input.location.accuracy,
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