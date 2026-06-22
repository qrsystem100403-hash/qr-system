import { NextResponse } from "next/server"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const { restaurant } =
      await requireRestaurantUser()

    const { data, error } =
      await supabaseAdmin
        .from("notifications")
        .select(`
          id,
          title,
          message,
          type,
          is_read,
          created_at
        `)
        .eq(
          "restaurant_id",
          restaurant.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(20)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      notifications: data,
    })
  } catch (error) {
    console.error(error)

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