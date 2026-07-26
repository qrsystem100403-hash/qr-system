import { BaseRepository } from "@/modules/core/database/base.repository";

import type {
  TableSession,
  SessionStatus,
} from "../types";

export class SessionRepository extends BaseRepository {
  private mapSession(data: any): TableSession {
    return {
  id: data.id,
  restaurant_id: data.restaurant_id,
  table_id: data.table_id,
  session_token: data.session_token,
  status: data.status as SessionStatus,
  started_at: data.started_at,
  expires_at: data.expires_at,
  bill_requested_at: data.bill_requested_at,
  completed_at: data.completed_at,
  created_at: data.created_at,
  updated_at: data.updated_at,
};
  }

  async findByToken(
    token: string
  ): Promise<TableSession | null> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("table_sessions")
      .select("*")
      .eq("session_token", token)
      .maybeSingle();

    if (error) throw error;

    return data ? this.mapSession(data) : null;
  }

  async findActiveByTableId(
  tableId: string
): Promise<TableSession | null> {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("table_sessions")
    .select("*")
    .eq("table_id", tableId)
    .in("status", ["active", "bill_requested"])
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) throw error;

  return data ? this.mapSession(data) : null;
}

  async create(input: {
    restaurant_id: string;
    table_id: string;
    session_token: string;
    expires_at: string;
  }): Promise<TableSession> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("table_sessions")
      .insert(input)
      .select("*")
      .single();

    if (error) throw error;

    return this.mapSession(data);
  }

  async touch(sessionId: string) {
  const supabase = await this.db();

  const { error } = await supabase
    .from("table_sessions")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) throw error;
}

async markBillRequested(
  sessionId: string,
  billing: {
    subtotal: number;
    gst_percent: number | null;
    gst_amount: number;
    service_charge_type: string | null;
    service_charge_value: number | null;
    service_charge_amount: number;
    round_off: number;
    grand_total: number;
    billing_snapshot: any;
  }
) {
  const supabase = await this.db();

  const { error } = await supabase
    .from("table_sessions")
    .update({
      status: "bill_requested",
      bill_requested_at: new Date().toISOString(),

      subtotal: billing.subtotal,

      gst_percent: billing.gst_percent,
      gst_amount: billing.gst_amount,

      service_charge_type:
        billing.service_charge_type,

      service_charge_value:
        billing.service_charge_value,

      service_charge_amount:
        billing.service_charge_amount,

      round_off: billing.round_off,
      grand_total: billing.grand_total,

      billing_snapshot:
        billing.billing_snapshot,

      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) throw error;
}

 

  async complete(sessionId: string) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("table_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) throw error;
  }

  async expire(sessionId: string) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("table_sessions")
      .update({
        status: "expired",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) throw error;
  }

   async updateStatus(
    sessionId: string,
    status: SessionStatus
  ) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("table_sessions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) throw error;
  }

  async findById(id: string) {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("table_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data ? this.mapSession(data) : null;
}
}