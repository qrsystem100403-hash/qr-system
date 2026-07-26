import { BaseRepository } from "@/modules/core/database/base.repository";

export class MenuRepository extends BaseRepository {
  async getMenuItems(
    restaurantId: string,
    itemIds: string[],
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("menu_items")
      .select(
        "id, name, price, category_id, is_available, is_archived",
      )
      .eq("restaurant_id", restaurantId)
      .in("id", itemIds);

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async getVariants(
    restaurantId: string,
    variantIds: string[],
  ) {
    if (variantIds.length === 0) {
      return [];
    }

    const supabase = await this.db();

    const { data, error } = await supabase
      .from("menu_item_variants")
      .select(
        "id, menu_item_id, name, price, is_available",
      )
      .eq("restaurant_id", restaurantId)
      .in("id", variantIds);

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async getAddons(
    restaurantId: string,
    addonIds: string[],
  ) {
    if (addonIds.length === 0) {
      return [];
    }

    const supabase = await this.db();

    const { data, error } = await supabase
      .from("menu_item_addons")
      .select(
        "id, menu_item_id, variant_id, name, price, is_active",
      )
      .eq("restaurant_id", restaurantId)
      .in("id", addonIds);

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async getCategories(
    restaurantId: string,
    categoryIds: string[],
  ) {
    if (categoryIds.length === 0) {
      return [];
    }

    const supabase = await this.db();

    const {
      data: directCategories,
      error: directError,
    } = await supabase
      .from("menu_categories")
      .select(
        "id, name, parent_id, available_from, available_until",
      )
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .in("id", categoryIds);

    if (directError) {
      throw directError;
    }

    const parentIds = Array.from(
      new Set(
        (directCategories ?? [])
          .map((category) => category.parent_id)
          .filter(
            (id): id is string => Boolean(id),
          ),
      ),
    );

    let parentCategories: typeof directCategories = [];

    if (parentIds.length > 0) {
      const { data, error } = await supabase
        .from("menu_categories")
        .select(
          "id, name, parent_id, available_from, available_until",
        )
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true)
        .in("id", parentIds);

      if (error) {
        throw error;
      }

      parentCategories = data ?? [];
    }

    return [
      ...(directCategories ?? []),
      ...parentCategories,
    ];
  }
}