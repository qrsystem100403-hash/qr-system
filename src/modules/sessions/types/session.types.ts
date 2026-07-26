export type SessionStatus =
  | "active"
  | "bill_requested"
  | "completed"
  | "expired";

export interface TableSession {
  id: string;

  restaurant_id: string;

  table_id: string;

  session_token: string;

  status: SessionStatus;

  started_at: string | null;

  expires_at: string | null;

  bill_requested_at: string | null;

  completed_at: string | null;
  
  created_at: string | null;
  
  updated_at: string | null;
}

export interface SessionListItem
  extends Omit<
    TableSession,
    | "status"
    | "started_at"
    | "restaurant_id"
    | "table_id"
    | "session_token"
  > {
  status: "active" | "bill_requested";

  started_at: string;

  payment_status: "pending" | "paid";

  grand_total: number | null;

  restaurant_tables: {
    id: string;
    name: string;
  };

  orders: {
    id: string;
    total: number | null;
    payment_status: string;
    order_status: string;
  }[];
}