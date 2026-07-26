import { supabaseAdmin } from "@/lib/supabase/admin";

import { DatabaseError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export type CreateNotificationInput = {
  restaurantId: string;
  type: string;
  title: string;
  message: string;
  entityType: string;
  entityId?: string | null;
};

export async function createNotification({
  restaurantId,
  type,
  title,
  message,
  entityType,
  entityId,
}: CreateNotificationInput): Promise<void> {
  const { error } = await supabaseAdmin
    .from("notifications")
    .insert({
      restaurant_id: restaurantId,
      type,
      title,
      message,
      entity_type: entityType,
      entity_id: entityId ?? null,
    });

  if (error) {
    logger.error({
      message: "Failed to create notification",
      error,
      context: {
        module: "notifications",
        action: "create",
        restaurantId,
        metadata: {
          type,
          entityType,
          entityId,
        },
      },
    });

    throw new DatabaseError(
      "Failed to create notification",
      error,
    );
  }
}