// src/app/api/qr/orders/route.ts

import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

const statusQuerySchema = z.object({
  orderId: z.string().uuid(),
  trackingToken: z.string().trim().min(4).max(32),
  tableToken: z.string().min(20).max(100),
})



export async function GET(request: Request) {
  try {
    const restaurant = await resolvePublicRestaurant()

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)

    const parsed = statusQuerySchema.safeParse({
      orderId: searchParams.get("orderId"),
      trackingToken: searchParams.get("trackingToken"),
      tableToken: searchParams.get("tableToken"),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid order request" },
        { status: 400 }
      )
    }

    const {
  orderId,
  trackingToken,
  tableToken,
} = parsed.data

    const { data: restaurantTable } = await supabaseAdmin
  .from("restaurant_tables")
.select("id")
.eq("restaurant_id", restaurant.id)
.eq("qr_token", tableToken)
.single()

if (!restaurantTable) {
  return NextResponse.json(
    { success: false, error: "Invalid table" },
    { status: 400 }
  )
}

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
  "id, tracking_token, table_id, table_name, total, order_status, payment_status, cancel_reason, created_at" )
      .eq("id", orderId)
      .eq("tracking_token", trackingToken.toUpperCase())
      .eq("restaurant_id", restaurant.id)
      .eq("table_id", restaurantTable.id)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("QR ORDER STATUS ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to fetch order status" },
      { status: 500 }
    )
  }
}