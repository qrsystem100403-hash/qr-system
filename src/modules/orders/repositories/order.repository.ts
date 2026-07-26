import { BaseRepository } from "@/modules/core/database/base.repository";
import type { OrderStatus } from "@/lib/orders/statuses";
import { AppError } from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error.codes";

const ORDER_SELECT = `
  id,
  order_type,
  table_name,
  customer_name,
  customer_phone,
  address,
  tracking_token,
  subtotal,
  service_charge,
  service_charge_enabled,
  service_charge_type,
  service_charge_value,
  gst_enabled,
  gst_mode,
  gst_percent,
  gst_amount,
  round_off,
  total,
  payment_status,
  order_status,
  customer_note,
  cancel_reason,
  created_at,
  order_items (
    id,
    qty,
    item_price,
    item_name,
    variant_name,
    order_item_addons (
      id,
      addon_name,
      addon_price
    )
  )
`;

type OrderForStatusUpdate = {
  id: string;
  order_status: OrderStatus;
  payment_status: string;
  session_id: string | null;
  table_id: string;
  restaurant_tables: {
    status: string;
  }[];
};

export class OrderRepository extends BaseRepository {
  async getRestaurantOrders(
    restaurantId: string,
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("restaurant_id", restaurantId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async findForStatusUpdate(
    restaurantId: string,
    orderId: string,
  ): Promise<OrderForStatusUpdate> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_status,
        payment_status,
        session_id,
        table_id,
        restaurant_tables!inner(
          status
        )
      `)
      .eq("restaurant_id", restaurantId)
      .eq("id", orderId)
      .single();

    if (error || !data) {
      throw new AppError(
        "Order not found.",
        ERROR_CODES.NOT_FOUND,
        404,
      );
    }

    return data as OrderForStatusUpdate;
  }

  async findForPaymentUpdate(
    restaurantId: string,
    orderId: string,
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        payment_status,
        order_status,
        session_id,
        table_id
      `)
      .eq("restaurant_id", restaurantId)
      .eq("id", orderId)
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

  async markPaid(
    restaurantId: string,
    orderId: string,
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
      })
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId)
      .eq("payment_status", "pending")
      .select("id")
      .single();

    if (error || !data) {
      throw new AppError(
        "Payment was already updated. Refresh and try again.",
        ERROR_CODES.CONFLICT,
        409,
      );
    }

    return data;
  }

  async updateStatus(
    restaurantId: string,
    orderId: string,
    currentStatus: OrderStatus,
    status: OrderStatus,
    cancelReason: string | null,
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
        cancel_reason:
          status === "cancelled"
            ? cancelReason
            : null,
      })
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId)
      .eq("order_status", currentStatus)
      .select("id")
      .single();

    if (error || !data) {
      throw new AppError(
        "Order was already updated. Refresh and try again.",
        ERROR_CODES.CONFLICT,
        409,
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
      .select(`
        payment_status,
        order_status
      `)
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

  async getRecentOrderCount(
    restaurantId: string,
    tableId: string,
    since: string,
  ) {
    const supabase = await this.db();

    const { count, error } = await supabase
      .from("orders")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("restaurant_id", restaurantId)
      .eq("table_id", tableId)
      .gte("created_at", since);

    if (error) {
      throw error;
    }

    return count ?? 0;
  }
}