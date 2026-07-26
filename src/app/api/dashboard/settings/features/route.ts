import { z } from "zod";

import {
  badRequest,
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireOwnerUser } from "@/lib/requireRestaurantUser";

import { RestaurantFeatureService } from "@/modules/core/restaurants/services/restaurant-feature.service";

const featureService =
  new RestaurantFeatureService();

const schema = z.object({
  kitchen_display_enabled:
    z.boolean(),

  cashier_dashboard_enabled:
    z.boolean(),

  waiter_dashboard_enabled:
    z.boolean(),

  online_orders_enabled:
    z.boolean(),

  attendance_enabled:
    z.boolean(),

  inventory_enabled:
    z.boolean(),
});

export async function PATCH(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid restaurant feature payload",
        context: {
          module: "settings",
          action:
            "updateRestaurantFeatures",
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid data.",
        parsed.error.flatten(),
      );
    }

    const {
      restaurant,
      restaurantUser,
    } =
      await requireOwnerUser();

    await featureService.updateFeatures(
      restaurant.id,
      parsed.data,
    );

    logger.audit({
      message:
        "Restaurant features updated",
      context: {
        module: "settings",
        action:
          "updateRestaurantFeatures",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
      },
    });

    return ok(
      undefined,
      "Restaurant features updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to update restaurant features",
      error,
      context: {
        module: "settings",
        action:
          "updateRestaurantFeatures",
      },
    });

    return fail(error);
  }
}