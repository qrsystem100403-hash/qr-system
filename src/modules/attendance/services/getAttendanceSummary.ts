import { SupabaseClient } from "@supabase/supabase-js";

type AttendanceSummaryPeriod = {
  present: number;
  late: number;
  absent: number;
  workedMinutes: number;
};

export type AttendanceSummary = {
  week: AttendanceSummaryPeriod;
  month: AttendanceSummaryPeriod;
  year: AttendanceSummaryPeriod;
};

function buildSummary(
  rows: {
    status: string;
    worked_minutes: number | null;
  }[],
): AttendanceSummaryPeriod {
  return {
    present: rows.filter(
      (row) => row.status === "present",
    ).length,

    late: rows.filter(
      (row) => row.status === "late",
    ).length,

    absent: rows.filter(
      (row) => row.status === "absent",
    ).length,

    workedMinutes: rows.reduce(
      (total, row) =>
        total + (row.worked_minutes ?? 0),
      0,
    ),
  };
}

export async function getAttendanceSummary(
  supabase: SupabaseClient,
  restaurantId: string,
  staffId: string,
): Promise<AttendanceSummary> {
  const today = new Date();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const monthStart = new Date(today);
  monthStart.setDate(1);

  const yearStart = new Date(
    today.getFullYear(),
    0,
    1,
  );

  const [
    weekResult,
    monthResult,
    yearResult,
  ] = await Promise.all([
    supabase
      .from("attendance_logs")
      .select("status, worked_minutes")
      .eq("restaurant_id", restaurantId)
      .eq("staff_id", staffId)
      .gte(
        "shift_date",
        weekStart.toISOString().slice(0, 10),
      ),

    supabase
      .from("attendance_logs")
      .select("status, worked_minutes")
      .eq("restaurant_id", restaurantId)
      .eq("staff_id", staffId)
      .gte(
        "shift_date",
        monthStart.toISOString().slice(0, 10),
      ),

    supabase
      .from("attendance_logs")
      .select("status, worked_minutes")
      .eq("restaurant_id", restaurantId)
      .eq("staff_id", staffId)
      .gte(
        "shift_date",
        yearStart.toISOString().slice(0, 10),
      ),
  ]);

  if (weekResult.error) {
    throw weekResult.error;
  }

  if (monthResult.error) {
    throw monthResult.error;
  }

  if (yearResult.error) {
    throw yearResult.error;
  }

  return {
    week: buildSummary(
      weekResult.data ?? [],
    ),

    month: buildSummary(
      monthResult.data ?? [],
    ),

    year: buildSummary(
      yearResult.data ?? [],
    ),
  };
}