import { VALID_ROLES } from "@/lib/auth/roles";

export type StaffRole = Exclude<
  (typeof VALID_ROLES)[number],
  "owner"
>;

export type EmploymentStatus =
  | "active"
  | "on_leave"
  | "terminated";

export type ShiftMode =
  | "custom"
  | "template";

export type StaffProfile = {
  id: string;
  restaurant_id: string;

  full_name: string;
  email: string | null;
  phone: string | null;

  role: StaffRole;

  is_active: boolean;

  attendance_shift_start: string | null;
  attendance_shift_end: string | null;
};

export type Staff = {
  id: string;

  restaurant_id: string;

  user_id: string;

  employee_id: string | null;

  role: StaffRole;

  employment_status: EmploymentStatus;

  joined_at: string | null;

  shift_mode: ShiftMode;

  attendance_shift_start: string | null;

  attendance_shift_end: string | null;

  created_at: string;

  created_by: string | null;

  is_active: boolean;

  profile: StaffProfile | null;
};