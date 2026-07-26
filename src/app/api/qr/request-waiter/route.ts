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

const requestService = new RequestService();

const schema = z.object({
  orderId: z.string().uuid(),
  trackingToken: z.string().trim().min(4),
  requestType: z.enum([
    "water",
    "spoon",
    "fork",
    "tissue",
    "waiter",
    "other",
  ]),
  customMessage: z
    .string()
    .trim()
    .max(150)
    .optional(),
});

export async function POST(request: Request) {
  try {
    const resolved =
  await resolvePublicRestaurant();

if (!resolved) {
  logger.warn({
    message:
      "Request created for unknown restaurant",
    context: {
      module: "public-request",
      action: "createRequest",
    },
  });

  return notFound(
    "Restaurant not found",
  );
}

const { restaurant } = resolved;
// or:
// const { restaurant, features } = resolved;

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid waiter request payload",
        context: {
          module: "public-request",
          action: "createRequest",
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
      requestType,
      customMessage,
    } = parsed.data;

    if (
      requestType === "other" &&
      !customMessage
    ) {
      return badRequest(
        "Message is required",
      );
    }

    const result =
      await requestService.requestCustomerAssistance({
        restaurantId: restaurant.id,
        orderId,
        trackingToken,
        requestType,
        customMessage,
      });

    if (!result.alreadyRequested) {
      logger.info({
        message:
          "Waiter request created",
        context: {
          module:
            "public-request",
          action:
            "createRequest",
          restaurantId:
            restaurant.id,
          metadata: {
            orderId:
              result.orderId,
            sessionId:
              result.sessionId,
            requestType:
              result.requestType,
          },
        },
      });
    }

    return ok(result);
  } catch (error) {
    logger.error({
      message:
        "Unexpected waiter request error",
      error,
      context: {
        module:
          "public-request",
        action:
          "createRequest",
      },
    });

    return fail(error);
  }
}