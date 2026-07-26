import type { SupabaseClient } from "@supabase/supabase-js";

export class TableRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getByQrToken(
    restaurantId: string,
    qrToken: string,
  ) {
    const { data, error } = await this.supabase
      .from("restaurant_tables")
      .select(
        `
          id,
          name,
          is_active,
          qr_token
        `,
      )
      .eq("restaurant_id", restaurantId)
      .eq("qr_token", qrToken)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}