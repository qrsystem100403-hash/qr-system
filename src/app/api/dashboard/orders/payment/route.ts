import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const schema = z.object({
  orderId: z.string().uuid(),
  paymentStatus: z.literal("paid"),
})

export async function PATCH(request: Request) {
  try {
    const { restaurant, supabase } = await requireRestaurantUser()

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payment data" },
        { status: 400 }
      )
    }

    const { orderId } = parsed.data

    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, payment_status, order_status")
      .eq("id", orderId)
      .eq("restaurant_id", restaurant.id)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    if (existingOrder.order_status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "Cancelled order cannot be marked paid" },
        { status: 400 }
      )
    }

    if (existingOrder.payment_status === "paid") {
      return NextResponse.json({ success: true })
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId)
      .eq("restaurant_id", restaurant.id)
      .eq("payment_status", "pending")
      .select("id")
      .single()

    if (updateError || !updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Failed to update payment status" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PAYMENT STATUS UPDATE ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to update payment status" },
      { status: 500 }
    )
  }
}