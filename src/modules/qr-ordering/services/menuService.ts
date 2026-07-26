import { MenuRepository } from "../repositories/menuRepository";
import type { PublicMenu } from "../types/menu";

export class MenuService {
  constructor(
    private readonly repository: MenuRepository,
  ) {}

  async getPublicMenu(
    restaurantId: string,
  ): Promise<PublicMenu> {
    const [categories, items] = await Promise.all([
      this.repository.getActiveCategories(
        restaurantId,
      ),
      this.repository.getPublicMenuItems(
        restaurantId,
      ),
    ]);

    return {
      categories,
      items,
    };
  }
}

