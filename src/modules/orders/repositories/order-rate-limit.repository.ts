import { BaseRepository } from "@/modules/core/database/base.repository";

export class OrderRateLimitRepository extends BaseRepository {
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