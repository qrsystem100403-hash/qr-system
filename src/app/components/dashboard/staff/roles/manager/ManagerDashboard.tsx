"use client";

import StaffWorkLayout from "../../shared/StaffWorkLayout";
import StaffAttendanceCard from "../../shared/StaffAttendanceCard";
import AttendanceActionButton from "../../shared/AttendanceActionButton";
import AttendanceSummaryCard from "../../shared/AttendanceSummaryCard";
import { useStaffDashboard } from "../../shared/StaffDashboardProvider";
import { formatWorkedMinutes } from "@/modules/attendance/utils/formatWorkedMinutes";

export default function ManagerDashboard() {
  const {
    attendance,
    attendanceSummary,
    profile,
  } = useStaffDashboard();

  const week = attendanceSummary.week;

  return (
    <StaffWorkLayout
      attendance={
        <StaffAttendanceCard
          employeeName={profile.full_name}
          role="Manager"
          shift={`${profile.shiftStart ?? "--"} - ${profile.shiftEnd ?? "--"}`}
          status={attendance.status}
          clockIn={
            attendance.clockInAt
              ? new Date(
                  attendance.clockInAt,
                ).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null
          }
          clockOut={
            attendance.clockOutAt
              ? new Date(
                  attendance.clockOutAt,
                ).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null
          }
          workedTime={attendance.workedTime}
          earlyLeaveMinutes={
            attendance.earlyLeaveMinutes
          }
          overtimeMinutes={
            attendance.overtimeMinutes
          }
          action={
            <AttendanceActionButton
              status={attendance.status}
            />
          }
        />
      }
    >
      <AttendanceSummaryCard
        present={week.present}
        late={week.late}
        workedTime={formatWorkedMinutes(
          week.workedMinutes,
        )}
      />
    </StaffWorkLayout>
  );
}