import { BaseRepository } from "@/modules/core/database/base.repository";

export class OrderSessionRepository extends BaseRepository {
  async touch(sessionId: string) {
    const supabase = await this.db();

    await supabase
      .from("restaurant_sessions")
      .update({
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", sessionId);
  }
}