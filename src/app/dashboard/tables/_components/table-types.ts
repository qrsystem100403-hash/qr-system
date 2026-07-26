export type TableWorkflowMode =
  | "simple"
  | "advanced"
  | "expert";

export type TableStatus =
  | "available"
  | "occupied"
  | "bill_requested";

export type RestaurantTable = {
  id: string;
  name: string;
  qr_token: string;

  is_active: boolean;

  status: TableStatus;

  last_activity_at: string | null;

  created_at: string;
};