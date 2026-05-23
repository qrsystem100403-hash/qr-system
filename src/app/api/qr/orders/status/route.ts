import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

const statusQuerySchema = z.object({
  orderId: z.string().uuid(),
  table: z.string().min(1).max(20),
})

function normalizeTableName(value: string) {
  return decodeURIComponent(value).trim().replace(/\s+/g, "-")
}

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
      table: searchParams.get("table"),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid order request" },
        { status: 400 }
      )
    }

    const { orderId, table } = parsed.data
    const normalizedTable = normalizeTableName(table)

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, restaurant_id, table_name, total, order_status, payment_status, cancel_reason"
      )
      .eq("id", orderId)
      .eq("restaurant_id", restaurant.id)
      .ilike("table_name", normalizedTable)
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
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch order status",
      },
      { status: 500 }
    )
  }
}