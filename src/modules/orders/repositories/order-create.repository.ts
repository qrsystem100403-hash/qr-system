import { supabaseAdmin } from "@/lib/supabase/admin";

import type {
  CreateOrderPayload,
  CreateOrderItemPayload,
  CreateOrderItemAddonPayload,
} from "../types/order.types";



export class OrderCreateRepository {
  async createOrder(payload: CreateOrderPayload) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert(payload)
      .select("id, tracking_token")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async createOrderItems(
    items: CreateOrderItemPayload[]
  ) {
    const { data, error } = await supabaseAdmin
      .from("order_items")
      .insert(items)
      .select("id, menu_item_id, variant_id, item_name");

    if (error) {
      throw error;
    }

    return data;
  }

  async createOrderItemAddons(
    addons: CreateOrderItemAddonPayload[]
  ) {
    const { error } = await supabaseAdmin
      .from("order_item_addons")
      .insert(addons);

    if (error) {
      throw error;
    }
  }

  async getOrderItemIds(orderId: string) {
    const { data, error } = await supabaseAdmin
      .from("order_items")
      .select("id")
      .eq("order_id", orderId);

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async deleteOrderItemAddons(orderItemIds: string[]) {
    if (orderItemIds.length === 0) return;

    const { error } = await supabaseAdmin
      .from("order_item_addons")
      .delete()
      .in("order_item_id", orderItemIds);

    if (error) {
      throw error;
    }
  }

  async deleteOrderItems(orderId: string) {
    const { error } = await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (error) {
      throw error;
    }
  }

  async deleteOrder(orderId: string) {
    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      throw error;
    }
  }
}