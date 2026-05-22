import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { resolveRestaurant } from "@/lib/restaurantResolver"

export async function requireRestaurantUser() {
  const restaurant = await resolveRestaurant()
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const { data: restaurantUser, error } = await supabase
    .from("restaurant_users")
    .select("id, role")
    .eq("restaurant_id", restaurant.id)
    .eq("user_id", user.id)
    .single()

  if (error || !restaurantUser) {
    redirect("/login")
  }

  return {
    restaurant,
    user,
    role: restaurantUser.role as "owner",
    supabase,
  }
}   