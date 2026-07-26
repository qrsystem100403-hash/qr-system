import {
  fail,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";

import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";
import { restaurantServices } from "@/modules/core/services";

export async function GET() {
  try {
    const runtime =
      await resolvePublicRestaurant();

    if (!runtime) {
      logger.warn({
        message:
          "Public menu requested for unknown restaurant",
        context: {
          module: "public-menu",
          action: "getMenu",
        },
      });

      return notFound(
        "Restaurant not found",
      );
    }

    const menu =
      await restaurantServices.menu.getPublicMenu(
        runtime.restaurant.id,
      );

    logger.info({
      message:
        "Public menu loaded",
      context: {
        module: "public-menu",
        action: "getMenu",
        restaurantId:
          runtime.restaurant.id,
      },
    });

    return ok(menu);
  } catch (error) {
    logger.error({
      message:
        "Failed to load public menu",
      error,
      context: {
        module: "public-menu",
        action: "getMenu",
      },
    });

    return fail(error);
  }
}