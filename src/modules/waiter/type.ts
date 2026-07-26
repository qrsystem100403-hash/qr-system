export interface WaiterOrder {
  id: string;

  table_name: string | null;

  total: number;

  created_at: string;

  payment_status: string;

  order_status:
    | "preparing"
    | "ready";

  itemCount: number;

  order_items: {
    id: string;
    qty: number;
  }[];
}