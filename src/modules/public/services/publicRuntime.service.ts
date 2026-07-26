import { restaurantServices } from "@/modules/core/services";

import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";

import type { PublicRuntime } from "../types/runtime";

export class PublicRuntimeService {

  async resolve(): Promise<PublicRuntime | null> {
    const runtime = await resolvePublicRestaurant();

    if (!runtime) {
      return null;
    }

    const theme =
  await restaurantServices.customerTheme.getTheme(
    runtime.restaurant.id,
  );

    return {
      restaurant: runtime.restaurant,
      features: runtime.features,
      theme,
    };
  }
}

export const publicRuntimeService =
  new PublicRuntimeService();