"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

export type AttendanceStatus =
  | "not_started"
  | "present"
  | "late"
  | "completed";

export type AttendanceSummaryPeriod = {
  present: number;
  late: number;
  absent: number;
  workedMinutes: number;
};

export type StaffDashboardData = {
  restaurant: {
    id: string;
    name: string;
  };

  profile: {
    id: string;
    full_name: string;
    role: string;
    avatar?: string | null;

    shiftStart: string | null;
    shiftEnd: string | null;
  };

  attendance: {
  status: AttendanceStatus;

  clockInAt: string | null;

  clockOutAt: string | null;

  workedTime: string | null;

  workedMinutes: number;

  lateMinutes: number;

  earlyLeaveMinutes: number;

  overtimeMinutes: number;
};
  notifications: {
    unread: number;
  };

  attendanceSummary: {
  week: AttendanceSummaryPeriod;
  month: AttendanceSummaryPeriod;
  year: AttendanceSummaryPeriod;
};

};



const StaffDashboardContext =
  createContext<StaffDashboardData | null>(
    null,
  );

type Props = {
  data: StaffDashboardData;
  children: ReactNode;
};

export default function StaffDashboardProvider({
  data,
  children,
}: Props) {
  return (
    <StaffDashboardContext.Provider
      value={data}
    >
      {children}
    </StaffDashboardContext.Provider>
  );
}

export function useStaffDashboard() {
  const context = useContext(
    StaffDashboardContext,
  );

  if (!context) {
    throw new Error(
      "useStaffDashboard must be used inside StaffDashboardProvider.",
    );
  }

  return context;
}