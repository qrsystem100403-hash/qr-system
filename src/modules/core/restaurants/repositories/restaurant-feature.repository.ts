import { BaseRepository } from "@/modules/core/database/base.repository";

const FEATURE_SELECT = `
  restaurant_id,
  kitchen_display_enabled,
  cashier_dashboard_enabled,
  waiter_dashboard_enabled,
  online_orders_enabled,
  attendance_enabled,
  inventory_enabled
`;

export class RestaurantFeatureRepository extends BaseRepository {
  async findByRestaurantId(
    restaurantId: string,
  ) {
    const supabase = await this.db();

    const { data, error } =
      await supabase
        .from("restaurant_features")
        .select(FEATURE_SELECT)
        .eq(
          "restaurant_id",
          restaurantId,
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async createDefaults(
  restaurantId: string,
) {
  const supabase = await this.db();

  const defaults = {
    restaurant_id: restaurantId,

    kitchen_display_enabled: false,

    cashier_dashboard_enabled: false,

    waiter_dashboard_enabled: false,

    online_orders_enabled: false,

    attendance_enabled: false,

    inventory_enabled: false,
  };

  const { data, error } =
    await supabase
      .from("restaurant_features")
      .upsert(defaults)
      .select(FEATURE_SELECT)
      .single();

  if (error) {
    throw error;
  }

  return data;
}

  async update(
    restaurantId: string,
    values: Partial<{
      kitchen_display_enabled: boolean;
      cashier_dashboard_enabled: boolean;
      waiter_dashboard_enabled: boolean;
      online_orders_enabled: boolean;
      attendance_enabled: boolean;
      inventory_enabled: boolean;
    }>,
  ) {
    const supabase = await this.db();

    const { data, error } =
      await supabase
        .from("restaurant_features")
        .update(values)
        .eq(
          "restaurant_id",
          restaurantId,
        )
        .select(FEATURE_SELECT)
        .single();

    if (error) {
      throw error;
    }

    return data;
  }
}