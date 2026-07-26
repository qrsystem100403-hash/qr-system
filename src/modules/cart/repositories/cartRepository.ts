import { SupabaseClient } from "@supabase/supabase-js";

export class CartRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  async getCartBySession(
    restaurantId: string,
    tableId: string,
    sessionId: string | null,
  ) {
    return this.supabase
      .from("carts")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("table_id", tableId)
      .eq("status", "active")
      .eq("session_id", sessionId)
      .maybeSingle();
  }

  async createCart(data: {
    restaurantId: string;
    tableId: string;
    sessionId: string | null;
  }) {
    return this.supabase
      .from("carts")
      .insert({
        restaurant_id: data.restaurantId,
        table_id: data.tableId,
        session_id: data.sessionId,
      })
      .select()
      .single();
  }

  async getCartItems(cartId: string) {
    return this.supabase
      .from("cart_items")
      .select(`
        *,
        cart_item_addons (*)
      `)
      .eq("cart_id", cartId);
  }

  async deleteCart(cartId: string) {
    return this.supabase
      .from("carts")
      .delete()
      .eq("id", cartId);
  }

  async clearCartItems(cartId: string) {
    return this.supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);
  }
}