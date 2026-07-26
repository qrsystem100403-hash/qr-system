import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { restaurant } =
      await requireRestaurantUser();

    const { id } =
      await params;

    const { error } =
      await supabaseAdmin
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("id", id)
        .eq(
          "restaurant_id",
          restaurant.id,
        );

    if (error) {
      logger.error({
        message:
          "Failed to mark notification as read",
        error,
        context: {
          module:
            "notifications",
          action:
            "markAsRead",
          restaurantId:
            restaurant.id,
          metadata: {
            notificationId: id,
          },
        },
      });

      return fail(error);
    }

    logger.audit({
      message:
        "Notification marked as read",
      context: {
        module:
          "notifications",
        action:
          "markAsRead",
        restaurantId:
          restaurant.id,
        metadata: {
          notificationId: id,
        },
      },
    });

    return ok(
      undefined,
      "Notification marked as read.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while marking notification as read",
      error,
      context: {
        module:
          "notifications",
        action:
          "markAsRead",
      },
    });

    return fail(error);
  }
}