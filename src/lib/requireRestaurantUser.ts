// src/lib/requireRestaurantUser.ts

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { resolveRestaurant } from "@/lib/restaurantResolver"

export type RestaurantRole = "owner" | "staff"

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

  const role = restaurantUser.role as RestaurantRole

  if (role !== "owner" && role !== "staff") {
    redirect("/login")
  }

  return {
    restaurant,
    user,
    role,
    supabase,
  }
}

export async function requireOwnerUser() {
  const session = await requireRestaurantUser()

  if (session.role !== "owner") {
    redirect("/dashboard/orders")
  }

  return session
}