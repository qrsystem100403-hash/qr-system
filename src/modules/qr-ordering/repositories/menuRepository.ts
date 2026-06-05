import { supabaseAdmin } from "@/lib/supabase/admin"

export async function getRestaurantMenu(restaurantId: string) {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select(`
      id,
      restaurant_id,
      name,
      price,
      category_id,
      image,
      is_available,
      is_archived,
      tag,
      description,
      rating,
      rating_count,
      menu_item_variants (
        id,
        name,
        price,
        sort_order,
        is_available,
        menu_item_addons (
          id,
          name,
          price,
          sort_order,
          is_active
        )
      )
    `)
    .eq("restaurant_id", restaurantId)
    .eq("is_archived", false)
    .order("name", { ascending: true })

  if (error) {
    console.error("GET RESTAURANT MENU ERROR:", error)
    throw new Error("Failed to fetch restaurant menu")
  }

  return data ?? []
}

export async function getRestaurantMenuCategories(restaurantId: string) {
  const { data, error } = await supabaseAdmin
    .from("menu_categories")
    .select(`
      id,
      name,
      sort_order,
      available_from,
      available_until,
      parent_id
    `)
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("GET RESTAURANT MENU CATEGORIES ERROR:", error)
    throw new Error("Failed to fetch restaurant menu categories")
  }

  return data ?? []
}