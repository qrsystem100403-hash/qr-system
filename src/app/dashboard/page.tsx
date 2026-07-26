import { notFound } from "next/navigation";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { ROLES } from "@/lib/auth/roles";

import OwnerDashboard from "../components/dashboard/owner/OwnerDashboard";
import CashierDashboard from "../components/dashboard/staff/roles/cashier/CashierDashboard";
import KitchenDashboard from "../components/dashboard/staff/roles/kitchen/KitchenDashboard";
import WaiterDashboard from "../components/dashboard/staff/roles/waiter/WaiterDashboard";

import StaffDashboardProvider, {
  type StaffDashboardData,
} from "../components/dashboard/staff/shared/StaffDashboardProvider";

import { getTodayAttendance } from "@/modules/attendance/services/getTodayAttendance";

import { getAttendanceSummary } from "@/modules/attendance/services/getAttendanceSummary";

const DASHBOARDS = {
  [ROLES.CASHIER]: CashierDashboard,
  [ROLES.KITCHEN]: KitchenDashboard,
  [ROLES.WAITER]: WaiterDashboard,
} as const;

export default async function DashboardPage() {
  const session =
    await requireRestaurantUser();

  if (session.role === ROLES.OWNER) {
    return <OwnerDashboard />;
  }

  const attendance =
    await getTodayAttendance(
      session.supabase,
      session.restaurant.id,
      session.restaurantUser.id,
    );

    const attendanceSummary =
  await getAttendanceSummary(
    session.supabase,
    session.restaurant.id,
    session.restaurantUser.id,
  );

  const Dashboard =
    DASHBOARDS[
      session.role as keyof typeof DASHBOARDS
    ];

  if (!Dashboard) {
    notFound();
  }

  const dashboardData = {
  restaurant: {
    id: session.restaurant.id,
    name: session.restaurant.name,
  },

  profile: {
    id: session.restaurantUser.id,
    full_name:
      session.profile?.full_name ??
      "Staff Member",
    role: session.role,
    avatar: null,
    shiftStart:
      session.restaurantUser
        .attendance_shift_start,
    shiftEnd:
      session.restaurantUser
        .attendance_shift_end,
  },

 attendance: attendance
  ? {
      status: attendance.clock_out_at
        ? "completed"
        : attendance.status,

      clockInAt: attendance.clock_in_at,

      clockOutAt: attendance.clock_out_at,

      workedTime:
        attendance.worked_minutes != null
          ? `${Math.floor(
              attendance.worked_minutes / 60,
            )}h ${
              attendance.worked_minutes % 60
            }m`
          : null,

      workedMinutes:
        attendance.worked_minutes ?? 0,

      lateMinutes:
        attendance.late_minutes ?? 0,

      earlyLeaveMinutes:
        attendance.early_leave_minutes ?? 0,

      overtimeMinutes:
        attendance.overtime_minutes ?? 0,
    }
  : {
      status: "not_started",

      clockInAt: null,

      clockOutAt: null,

      workedTime: null,

      workedMinutes: 0,

      lateMinutes: 0,

      earlyLeaveMinutes: 0,

      overtimeMinutes: 0,
    },

  attendanceSummary,

  notifications: {
    unread: 0,
  },
} satisfies StaffDashboardData;

  return (
    <StaffDashboardProvider
      data={dashboardData}
    >
      <Dashboard />
    </StaffDashboardProvider>
  );
}