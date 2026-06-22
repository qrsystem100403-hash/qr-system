import { NextResponse } from "next/server"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const { restaurant } =
      await requireRestaurantUser()

    const { error } =
      await supabaseAdmin
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq(
          "restaurant_id",
          restaurant.id
        )
        .eq("is_read", false)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "MARK NOTIFICATIONS READ ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    )
  }
}