import { z } from "zod";


export const attendanceSettingsSchema = z.object({
  attendance_gps_enabled: z.boolean(),

  attendance_radius: z.coerce
    .number()
    .int()
    .min(10, "Attendance radius must be at least 10 meters.")
    .max(1000, "Attendance radius cannot exceed 1000 meters."),

  attendance_max_accuracy: z.coerce
    .number()
    .int()
    .min(5, "Maximum GPS accuracy must be at least 5 meters.")
    .max(200, "Maximum GPS accuracy cannot exceed 200 meters."),


  attendance_latitude: z
    .union([
      z.coerce.number().min(-90).max(90),
      z.null(),
    ]),

  attendance_longitude: z
    .union([
      z.coerce.number().min(-180).max(180),
      z.null(),
    ]),

    attendance_location_accuracy: z.coerce
  .number()
  .min(0)
  .nullable(),
})
.refine(
  (data) => {
    if (
      data.attendance_gps_enabled &&
      (data.attendance_latitude === null ||
        data.attendance_longitude === null)
    ) {
      return false;
    }

    return true;
  },
  {
    message:
      "Please configure the restaurant GPS location.",
    path: ["attendance_latitude"],
  },
);

export type AttendanceSettingsInput =
  z.infer<typeof attendanceSettingsSchema>;