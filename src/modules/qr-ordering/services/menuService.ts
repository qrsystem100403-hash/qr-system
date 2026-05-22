import { getRestaurantMenu } from "../repositories/menuRepository"

export async function getMenuService(
  restaurantId: string
) {
  return getRestaurantMenu(
    restaurantId
  )
}