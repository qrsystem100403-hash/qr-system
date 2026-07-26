export type StaffDialogMode =
  | "create"
  | "edit";

export type EmploymentStatus =
  | "active"
  | "on_leave"
  | "terminated";

export type ShiftMode =
  | "custom"
  | "template";

export type EmployeeIdMode =
  | "auto"
  | "custom";

export type StaffForm = {
  full_name: string;

  email: string;

  phone: string;

  employee_id: string;

  employee_id_mode: EmployeeIdMode;

  role:
    | "manager"
    | "cashier"
    | "kitchen"
    | "waiter";

  employment_status: EmploymentStatus;

  joined_at: string;

  shift_mode: ShiftMode;

  attendance_shift_start: string;

  attendance_shift_end: string;

  password: string;
};