import {
  getRestaurantMenu,
  getRestaurantMenuCategories,
} from "../repositories/menuRepository"

export async function getMenuService(restaurantId: string) {
  const [categories, items] = await Promise.all([
    getRestaurantMenuCategories(restaurantId),
    getRestaurantMenu(restaurantId),
  ])

  return {
    categories,
    items,
  }
}