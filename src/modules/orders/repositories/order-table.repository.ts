import { BaseRepository } from "@/modules/core/database/base.repository";

export class OrderTableRepository extends BaseRepository {
  async getByQrToken(
    restaurantId: string,
    qrToken: string,
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("restaurant_tables")
      .select(`
        id,
        name,
        is_active,
        qr_token
      `)
      .eq("restaurant_id", restaurantId)
      .eq("qr_token", qrToken)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}