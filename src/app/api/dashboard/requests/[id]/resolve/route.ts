import { NextResponse } from "next/server"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { restaurant, supabase } =
      await requireRestaurantUser()

    const { error } = await supabase
      .from("requests")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("restaurant_id", restaurant.id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    )
  }
}