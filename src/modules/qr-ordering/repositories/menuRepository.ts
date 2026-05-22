import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getRestaurantMenu(restaurantId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)

  if (error) {
    throw new Error(error.message)
  }

  return data
}