import { BaseService } from "@/modules/core/services/base.service";
import { RestaurantFeatureRepository } from "../repositories/restaurant-feature.repository";

export class RestaurantFeatureService extends BaseService {
  private readonly repository =
    new RestaurantFeatureRepository();

  async getFeatures(
    restaurantId: string,
  ) {
    let features =
      await this.repository.findByRestaurantId(
        restaurantId,
      );

    if (!features) {
      features =
        await this.repository.createDefaults(
          restaurantId,
        );
    }

    return features;
  }

  async updateFeatures(
    restaurantId: string,
    values: Partial<{
      kitchen_display_enabled: boolean;
      cashier_dashboard_enabled: boolean;
      waiter_dashboard_enabled: boolean;
      online_orders_enabled: boolean;
      attendance_enabled: boolean;
      inventory_enabled: boolean;
    }>,
  ) {
    return this.repository.update(
      restaurantId,
      values,
    );
  }
}