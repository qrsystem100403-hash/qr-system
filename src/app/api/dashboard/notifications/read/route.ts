import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const { restaurant } =
      await requireRestaurantUser();

    const { error } =
      await supabaseAdmin
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq(
          "restaurant_id",
          restaurant.id,
        )
        .eq(
          "is_read",
          false,
        );

    if (error) {
      logger.error({
        message:
          "Failed to mark notifications as read",
        error,
        context: {
          module:
            "notifications",
          action:
            "markAllAsRead",
          restaurantId:
            restaurant.id,
        },
      });

      return fail(error);
    }

    logger.audit({
      message:
        "Notifications marked as read",
      context: {
        module:
          "notifications",
        action:
          "markAllAsRead",
        restaurantId:
          restaurant.id,
      },
    });

    return ok(
      undefined,
      "Notifications marked as read.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while marking notifications as read",
      error,
      context: {
        module:
          "notifications",
        action:
          "markAllAsRead",
      },
    });

    return fail(error);
  }
}