import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { restaurant } =
      await requireRestaurantUser();

    const { data, error } =
      await supabaseAdmin
        .from("notifications")
        .select(`
          id,
          title,
          message,
          type,
          is_read,
          created_at
        `)
        .eq(
          "restaurant_id",
          restaurant.id,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(20);

    if (error) {
      logger.error({
        message:
          "Failed to load notifications",
        error,
        context: {
          module: "notifications",
          action:
            "getNotifications",
          restaurantId:
            restaurant.id,
        },
      });

      return fail(error);
    }

    return ok({
      notifications: data ?? [],
    });
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while loading notifications",
      error,
      context: {
        module: "notifications",
        action:
          "getNotifications",
      },
    });

    return fail(error);
  }
}