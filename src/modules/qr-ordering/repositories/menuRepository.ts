import type { SupabaseClient } from "@supabase/supabase-js";

export class MenuRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  async getPublicMenuItems(
    restaurantId: string,
  ) {
    const { data, error } = await this.supabase
      .from("menu_items")
      .select(`
        id,
        restaurant_id,
        name,
        price,
        category_id,
        image,
        is_available,
        is_archived,
        tag,
        description,
        rating,
        rating_count,
        menu_item_variants (
          id,
          name,
          price,
          sort_order,
          is_available,
          menu_item_addons (
            id,
            name,
            price,
            sort_order,
            is_active
          )
        )
      `)
      .eq("restaurant_id", restaurantId)
      .eq("is_archived", false)
      .order("name", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async getActiveCategories(
    restaurantId: string,
  ) {
    const { data, error } = await this.supabase
      .from("menu_categories")
      .select(`
        id,
        name,
        sort_order,
        available_from,
        available_until,
        parent_id
      `)
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return data ?? [];
  }
}