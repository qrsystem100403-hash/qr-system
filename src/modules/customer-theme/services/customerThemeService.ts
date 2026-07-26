import { DEFAULT_CUSTOMER_THEME } from "../runtime/constants/defaultTheme"
import { CustomerThemeRepository } from "../repositories/customerThemeRepository"

import { BaseService } from "@/modules/core/services/base.service";

import type {
  CustomerTheme,
  CustomerThemeUpdate,
} from "../types/theme"

export class CustomerThemeService extends BaseService {
  constructor(
    private readonly repository: CustomerThemeRepository,
  ) {
    super();
  }

async getTheme(
  restaurantId: string,
): Promise<CustomerTheme> {
  let theme =
    await this.repository.findByRestaurantId(
      restaurantId,
    );

  if (!theme) {
    theme =
      await this.repository.create(
        restaurantId,
      );
  }

  return this.applyDefaults(theme);
}

  async createTheme(
    restaurantId: string,
  ): Promise<CustomerTheme> {
    const theme =
      await this.repository.create(
        restaurantId,
      )

    return this.applyDefaults(theme)
  }

  async updateTheme(
    restaurantId: string,
    updates: CustomerThemeUpdate,
  ): Promise<CustomerTheme> {
    const theme =
      await this.repository.update(
        restaurantId,
        updates,
      )

    return this.applyDefaults(theme)
  }

  private applyDefaults(
    theme: CustomerTheme,
  ): CustomerTheme {
    return {
      ...DEFAULT_CUSTOMER_THEME,
      ...theme,
    }
  }
}