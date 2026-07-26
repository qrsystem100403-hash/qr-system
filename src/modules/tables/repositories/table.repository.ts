import { BaseRepository } from "@/modules/core/database/base.repository";

import type {
  RestaurantTable,
  TableStatus,
} from "../types";

export class TableRepository extends BaseRepository {
  private mapTable(data: any): RestaurantTable {
    return {
      id: data.id,
      restaurant_id: data.restaurant_id,
      name: data.name,
      qr_token: data.qr_token,
      is_active: data.is_active,
      status: data.status as TableStatus,
      last_activity_at: data.last_activity_at,
      created_at: data.created_at,
    };
  }

  async findByQrToken(
    restaurantId: string,
    qrToken: string
  ): Promise<RestaurantTable | null> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("qr_token", qrToken)
      .maybeSingle();

    if (error) throw error;

    return data ? this.mapTable(data) : null;
  }

  async findById(
    tableId: string
  ): Promise<RestaurantTable | null> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("id", tableId)
      .maybeSingle();

    if (error) throw error;

    return data ? this.mapTable(data) : null;
  }

  async updateStatus(
    tableId: string,
    status: TableStatus
  ) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("restaurant_tables")
      .update({
        status,
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", tableId);

    if (error) throw error;
  }

  async touch(tableId: string) {
  const supabase = await this.db();

  const { error } = await supabase
    .from("restaurant_tables")
    .update({
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", tableId);

  if (error) throw error;
}
}