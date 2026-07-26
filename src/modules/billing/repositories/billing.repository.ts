import { BaseRepository } from "@/modules/core/database/base.repository";

export class BillingRepository extends BaseRepository {
  async getBillingSettings(
    restaurantId: string,
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("restaurant_billing_settings")
      .select(`
        gst_enabled,
        gst_mode,
        gst_percent,
        service_charge_enabled,
        service_charge_type,
        service_charge_value,
        round_off_enabled
      `)
      .eq("restaurant_id", restaurantId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }
}