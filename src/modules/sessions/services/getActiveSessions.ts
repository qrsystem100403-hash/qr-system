import { SupabaseClient } from "@supabase/supabase-js";
import type { SessionListItem } from "../types";

export async function getActiveSessions(
  supabase: SupabaseClient,
  restaurantId: string,
): Promise<SessionListItem[]> {
  const { data, error } = await supabase
    .from("table_sessions")
    .select(`
      id,
      restaurant_id,
      table_id,
      session_token,
      status,
      started_at,
      expires_at,
      bill_requested_at,
      completed_at,
      created_at,
      updated_at,
      payment_status,
      grand_total,
      restaurant_tables!inner(
        id,
        name
      ),
      orders(
        id,
        total,
        payment_status,
        order_status
      )
    `)
    .eq("restaurant_id", restaurantId)
    .in("status", [
      "active",
      "bill_requested",
    ])
    .order("started_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((session) => ({
    ...session,
    restaurant_tables: Array.isArray(
      session.restaurant_tables,
    )
      ? session.restaurant_tables[0]
      : session.restaurant_tables,
  })) as SessionListItem[];
}