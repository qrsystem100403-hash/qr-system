export type SessionOrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export type SessionOrderAddon = {
  id: string;
  addon_name: string;
  addon_price: number;
};

export type SessionOrderItem = {
  id: string;
  qty: number;
  item_name: string | null;
  item_price: number;
  variant_name: string | null;
  order_item_addons: SessionOrderAddon[];
};

export type SessionOrder = {
  id: string;
  tracking_token: string;
  total: number;
  payment_status: "pending" | "paid";
  order_status: SessionOrderStatus;
  cancel_reason: string | null;
  customer_note: string | null;
  created_at: string;
  order_items: SessionOrderItem[];
};

export type DiningSession = {
  id: string;
  table_id: string;
  table_name: string;
  status: string;
  started_at: string;
  bill_requested_at: string | null;
  total: number;
  payment_status: "pending" | "paid";
};

export type SessionResponse = {
  success: boolean;
  session: DiningSession;
  orders: SessionOrder[];
};