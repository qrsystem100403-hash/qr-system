import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { RequestService } from "@/modules/requests";

const requestService =
  new RequestService();

export async function PATCH(
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
    const { id } =
      await params;

    const {
      restaurant,
      restaurantUser,
    } =
      await requireRestaurantUser();

    await requestService.resolveRequest(
  restaurant.id,
  id,
);

    logger.audit({
      message:
        "Customer request resolved",
      context: {
        module: "requests",
        action:
          "resolveRequest",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          requestId: id,
        },
      },
    });

    return ok(
      undefined,
      "Request resolved successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while resolving request",
      error,
      context: {
        module: "requests",
        action:
          "resolveRequest",
      },
    });

    return fail(error);
  }
}