import { BaseRepository } from "@/modules/core/database/base.repository";
import { AppError } from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error.codes";

export class RequestRepository extends BaseRepository {
  async resolveRequest(
    restaurantId: string,
    requestId: string,
  ) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("requests")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("restaurant_id", restaurantId);

    if (error) {
      throw new AppError(
        "Failed to resolve request.",
        ERROR_CODES.DATABASE_ERROR,
        500,
      );
    }
  }

  async findOrderForBillRequest(
  restaurantId: string,
  orderId: string,
  trackingToken: string,
){
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      restaurant_id,
      table_id,
      table_name,
      tracking_token,
      order_status,
      session_id
    `)
    .eq("restaurant_id", restaurantId)
    .eq("id", orderId)
    .eq(
      "tracking_token",
      trackingToken.toUpperCase(),
    )
    .single();

  if (error || !data) {
    throw new AppError(
      "Order not found.",
      ERROR_CODES.NOT_FOUND,
      404,
    );
  }

  return data;
}

async getSessionOrders(
  sessionId: string,
) {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("orders")
    .select("order_status")
    .eq("session_id", sessionId);

  if (error) {
    throw new AppError(
      "Failed to load session orders.",
      ERROR_CODES.DATABASE_ERROR,
      500,
    );
  }

  return data ?? [];
}

async findPendingBillRequest(
  sessionId: string,
) {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("requests")
    .select("id")
    .eq("session_id", sessionId)
    .eq("request_type", "bill")
    .eq("status", "pending")
    .maybeSingle();

  if (error) {
    throw new AppError(
      "Failed to load bill requests.",
      ERROR_CODES.DATABASE_ERROR,
      500,
    );
  }

  return data;
}

async createBillRequest(params: {
  restaurantId: string;
  tableId: string;
  tableName: string;
  sessionId: string;
  orderId: string;
}) {
  const supabase = await this.db();

  const { error } = await supabase
    .from("requests")
    .insert({
      restaurant_id: params.restaurantId,
      table_id: params.tableId,
      table_name: params.tableName,
      session_id: params.sessionId,
      order_id: params.orderId,
      request_type: "bill",
      status: "pending",
    });

  if (error) {
    throw new AppError(
      "Failed to create bill request.",
      ERROR_CODES.DATABASE_ERROR,
      500,
    );
  }
}

async findOrderForCustomerRequest(
  restaurantId: string,
  orderId: string,
  trackingToken: string,
) {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      restaurant_id,
      table_id,
      table_name,
      order_status,
      session_id
    `)
    .eq("restaurant_id", restaurantId)
    .eq("id", orderId)
    .eq("tracking_token", trackingToken.toUpperCase())
    .single();

  if (error || !data) {
    throw new AppError(
      "Order not found.",
      ERROR_CODES.NOT_FOUND,
      404,
    );
  }

  return data;
}

async findPendingCustomerRequest(
  sessionId: string,
  requestType: string,
) {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("requests")
    .select("id")
    .eq("session_id", sessionId)
    .eq("request_type", requestType)
    .eq("status", "pending")
    .maybeSingle();

  if (error) {
    throw new AppError(
      "Failed to check existing request.",
      ERROR_CODES.DATABASE_ERROR,
      500,
    );
  }

  return data;
}

async createCustomerRequest(params: {
  restaurantId: string;
  tableId: string;
  tableName: string;
  sessionId: string;
  orderId: string;
  requestType: string;
  customMessage: string | null;
}) {
  const supabase = await this.db();

  const { error } = await supabase
    .from("requests")
    .insert({
      restaurant_id: params.restaurantId,
      table_id: params.tableId,
      table_name: params.tableName,
      session_id: params.sessionId,
      order_id: params.orderId,
      request_type: params.requestType,
      custom_message: params.customMessage,
      status: "pending",
    });

  if (error) {
    throw new AppError(
      "Failed to create request.",
      ERROR_CODES.DATABASE_ERROR,
      500,
    );
  }
}

async touchTableActivity(
  tableId: string,
) {
  const supabase = await this.db();

  const { error } = await supabase
    .from("restaurant_tables")
    .update({
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", tableId);

  if (error) {
    throw new AppError(
      "Failed to update table activity.",
      ERROR_CODES.DATABASE_ERROR,
      500,
    );
  }
}
}

