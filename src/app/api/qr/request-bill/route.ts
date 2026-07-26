import { z } from "zod";

import {
  badRequest,
  fail,
 notFound,
  ok,
} from "@/lib/api";

import { logger } from "@/lib/logger";
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";

import { RequestService } from "@/modules/requests";


const schema = z.object({
  orderId: z.string().uuid(),
  trackingToken: z.string().trim().min(4),
});

const requestService = new RequestService();

export async function POST(request: Request) {
  try {
   const resolved =
  await resolvePublicRestaurant();

if (!resolved) {
  logger.warn({
    message:
      "Bill requested for unknown restaurant",
    context: {
      module: "public-billing",
      action: "requestBill",
    },
  });

  return notFound(
    "Restaurant not found",
  );
}

const { restaurant } = resolved;
// If you need feature flags later:
// const { restaurant, features } = resolved;

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid bill request payload",
        context: {
          module: "public-billing",
          action: "requestBill",
          restaurantId:
            restaurant.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid request",
        parsed.error.flatten(),
      );
    }

    const {
      orderId,
      trackingToken,
    } = parsed.data;

    const result =
  await requestService.requestBill({
    restaurantId: restaurant.id,
    orderId,
    trackingToken,
  });

if (!result.alreadyRequested) {
  logger.info({
    message: "Bill requested successfully",
    context: {
      module: "public-billing",
      action: "requestBill",
      restaurantId: restaurant.id,
      metadata: {
        orderId: result.orderId,
        sessionId: result.sessionId,
      },
    },
  });
}

return ok(result);
  } catch (error) {
    logger.error({
      message:
        "Unexpected bill request error",
      error,
      context: {
        module:
          "public-billing",
        action:
          "requestBill",
      },
    });

    return fail(error);
  }
}