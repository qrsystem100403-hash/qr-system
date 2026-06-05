import { NextResponse } from "next/server"
import { getMenuService } from "@/modules/qr-ordering/services/menuService"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

export async function GET() {
  try {
    const restaurant = await resolvePublicRestaurant()

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      )
    }

    const menu = await getMenuService(restaurant.id)

    return NextResponse.json({
      success: true,
      data: menu,
    })
  } catch (error) {
    console.error("QR MENU FETCH ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to fetch menu" },
      { status: 500 }
    )
  }
}