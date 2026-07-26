import { z } from "zod";
import { VALID_ROLES } from "@/lib/auth/roles";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const employmentStatuses = ["active", "on_leave", "terminated"] as const;

const shiftModes = ["custom", "template"] as const;

export const createStaffSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),

    email: z.string().trim().email("Please enter a valid email address."),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .max(100, "Password cannot exceed 100 characters."),

    role: z.enum(
      VALID_ROLES.filter((role) => role !== "owner") as [string, ...string[]],
      {
        error: "Please select a staff role.",
      },
    ),

    employment_status: z.enum(employmentStatuses).default("active"),

    joined_at: z.string().date().optional(),

    shift_mode: z.enum(shiftModes).default("custom"),

    attendance_shift_start: z
      .string()
      .regex(timeRegex, "Please select a valid shift start time."),

    attendance_shift_end: z
      .string()
      .regex(timeRegex, "Please select a valid shift end time."),
  })
  .refine((data) => data.attendance_shift_start !== data.attendance_shift_end, {
    message: "Shift start and end time cannot be the same.",
    path: ["attendance_shift_end"],
  });

export const updateStaffSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .optional()
      .or(z.literal("")),

    role: z.enum(
      VALID_ROLES.filter((r) => r !== "owner") as [string, ...string[]],
      {
        error: "Please select a staff role.",
      },
    ),

    employee_id: z.string().trim().max(30).optional(),

    employment_status: z.enum(employmentStatuses).default("active"),

    shift_mode: z.enum(shiftModes).default("custom"),

    joined_at: z.string().optional(),

    attendance_shift_start: z
      .string()
      .regex(timeRegex, "Please select a valid shift start time."),

    attendance_shift_end: z
      .string()
      .regex(timeRegex, "Please select a valid shift end time."),
  })
  .refine((data) => data.attendance_shift_start !== data.attendance_shift_end, {
    message: "Shift start and end time cannot be the same.",
    path: ["attendance_shift_end"],
  });

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
