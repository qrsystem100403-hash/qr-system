export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled"

export type OrderAddon = {
  id: string
  addon_name: string
  addon_price: number
}

export type OrderItem = {
  id: string
  qty: number
  item_price: number
  item_name: string | null
  variant_name: string | null
  order_item_addons: OrderAddon[]
}

export type Order = {
  id: string;
  order_type: string | null;
  table_name: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  address: string | null;
  tracking_token: string |null;

  subtotal: number;
  service_charge: number;
  service_charge_enabled: boolean;
  service_charge_type: string | null;
  service_charge_value: number;
  gst_enabled: boolean;
  gst_mode: string;
  gst_percent: number;
  gst_amount: number;
  round_off: number;

  total: number;

  payment_status: string;
  order_status: OrderStatus;

  customer_note: string | null;
  cancel_reason: string | null;
  created_at: string;

  order_items: OrderItem[];
};

export type StatusTabValue = OrderStatus | "all"

export type DiningSession = {
  sessionId: string;
  tableId: string;
  tableName: string;
  status: "active" | "bill_requested";
  startedAt: string;
  latestOrderAt: string;
  billRequested: boolean;
  paymentStatus: "pending" | "paid";
  total: number;
  orderCount: number;
  orders: Order[];
};