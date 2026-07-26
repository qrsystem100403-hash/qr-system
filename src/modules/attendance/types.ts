export type ClockLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type ClockInInput = {
  restaurantId: string;
  staffId: string;
  location: ClockLocation;
};

export type ClockOutInput = {
  restaurantId: string;
  staffId: string;
  location: ClockLocation;
};

export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "half_day"
  | "leave";