import { headers } from "next/headers";

import { DatabaseError } from "@/lib/errors";
import { logger } from "@/lib/logger";

import { RestaurantService } from "@/modules/core/restaurants/services/restaurant.service";
import { normalizeHost } from "@/modules/core/restaurants/utils/restaurant.mapper";

const restaurantService = new RestaurantService();

export async function resolveRestaurant() {
  const headersList = await headers();

  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "";

  const domain = normalizeHost(host);

  try {
    return await restaurantService.resolveByDomain(domain);
  } catch (error) {
    logger.error({
      message: "Failed to resolve restaurant",
      error,
      context: {
        module: "restaurant",
        action: "resolveRestaurant",
        metadata: {
          domain,
        },
      },
    });

    throw new DatabaseError(
      "Failed to resolve restaurant",
      error,
    );
  }
}