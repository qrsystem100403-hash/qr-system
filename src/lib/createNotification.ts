import { supabaseAdmin } from "@/lib/supabase/admin"

type CreateNotificationInput = {
  restaurantId: string
  type: string
  title: string
  message: string
  entityType: string
  entityId?: string
}

export async function createNotification({
  restaurantId,
  type,
  title,
  message,
  entityType,
  entityId,
}: CreateNotificationInput) {
  const { error } = await supabaseAdmin
    .from("notifications")
    .insert({
      restaurant_id: restaurantId,
      type,
      title,
      message,
      entity_type: entityType,
      entity_id: entityId ?? null,
    })

  if (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    )
  }
}