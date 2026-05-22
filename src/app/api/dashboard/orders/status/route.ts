import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const schema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["preparing", "ready", "served", "cancelled"]),
  cancelReason: z.string().optional(),
})

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled"

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready", "served", "cancelled"],
  ready: ["served", "cancelled"],
  served: [],
  cancelled: [],
}

export async function PATCH(request: Request) {
  try {
    const { restaurant, supabase } = await requireRestaurantUser()

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status data" },
        { status: 400 }
      )
    }

    const { orderId, status, cancelReason } = parsed.data
    const cleanCancelReason = cancelReason?.trim() ?? ""

    if (status === "cancelled" && !cleanCancelReason) {
      return NextResponse.json(
        { success: false, error: "Cancellation reason is required" },
        { status: 400 }
      )
    }

    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_status")
      .eq("id", orderId)
      .eq("restaurant_id", restaurant.id)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    const currentStatus = existingOrder.order_status as OrderStatus

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status flow" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
        cancel_reason: status === "cancelled" ? cleanCancelReason : null,
      })
      .eq("id", orderId)
      .eq("restaurant_id", restaurant.id)
      .select("id")
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Failed to update order" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ORDER STATUS UPDATE ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    )
  }
}