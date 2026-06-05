import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const ALLOWED_PAYMENT_ROLES = ["owner", "manager", "cashier"] as const

const schema = z.object({
  orderId: z.string().uuid(),
  paymentStatus: z.literal("paid"),
})

function canUpdatePayment(role: string) {
  return ALLOWED_PAYMENT_ROLES.includes(
    role as (typeof ALLOWED_PAYMENT_ROLES)[number]
  )
}

export async function PATCH(request: Request) {
  try {
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canUpdatePayment(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

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
      console.error("PAYMENT STATUS UPDATE DB ERROR:", updateError)

      return NextResponse.json(
        { success: false, error: "Payment was already updated. Refresh and try again." },
        { status: 409 }
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