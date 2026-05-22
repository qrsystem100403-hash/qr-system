import { NextResponse } from "next/server"
import { getMenuService } from "@/modules/qr-ordering/services/menuService"
import { getRestaurantBySlug } from "@/modules/qr-ordering/repositories/restaurantRepository"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")?.trim()

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Restaurant slug required" },
        { status: 400 }
      )
    }

    const restaurant = await getRestaurantBySlug(slug)

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