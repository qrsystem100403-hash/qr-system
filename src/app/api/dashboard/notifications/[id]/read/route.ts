import { NextResponse } from "next/server"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const { restaurant } =
      await requireRestaurantUser()

    const { id } = await params

    const { error } =
      await supabaseAdmin
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("id", id)
        .eq(
          "restaurant_id",
          restaurant.id
        )

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
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