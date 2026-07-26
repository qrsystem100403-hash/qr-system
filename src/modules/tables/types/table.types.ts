export type TableStatus =
  | "available"
  | "occupied"
  | "bill_requested"
  | "reserved"
  | "cleaning"
  | "disabled";

export interface RestaurantTable {
  id: string;

  restaurant_id: string;

  name: string;

  qr_token: string;

  is_active: boolean;

  status: TableStatus;

  last_activity_at: string | null;

  created_at: string;
}