import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { getActiveSessions } from "@/modules/sessions/services/getActiveSessions";

export async function GET() {
  try {
    const {
      restaurant,
      restaurantUser,
      supabase,
    } =
      await requireRestaurantUser();

    const sessions =
      await getActiveSessions(
        supabase,
        restaurant.id,
      );

    logger.info({
      message:
        "Active sessions loaded",
      context: {
        module: "sessions",
        action:
          "getActiveSessions",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
      },
    });

    return ok({
      sessions,
    });
  } catch (error) {
    logger.error({
      message:
        "Failed to load active sessions",
      error,
      context: {
        module: "sessions",
        action:
          "getActiveSessions",
      },
    });

    return fail(error);
  }
}