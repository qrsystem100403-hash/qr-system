import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

import type { OrderStatus } from "@/lib/orders/statuses"
import { ORDER_STATUSES } from "@/lib/orders/statuses"

import {
  SIMPLE_TRANSITIONS,
  ADVANCED_TRANSITIONS,
} from "@/lib/orders/transitions"


import { ROLES } from "@/lib/auth/roles"

const schema = z.object({
  orderId: z.string().uuid(),
  status: z.string(),
  cancelReason: z.string().trim().max(200).optional(),
})

const ALLOWED_ORDER_STATUS_ROLES = [
  ROLES.OWNER,
  ROLES.MANAGER,
  ROLES.KITCHEN,
] as const

function canUpdateOrderStatus(role: string) {
  return ALLOWED_ORDER_STATUS_ROLES.includes(
    role as (typeof ALLOWED_ORDER_STATUS_ROLES)[number]
  )
}



function isOrderStatus(
  value: unknown
): value is OrderStatus {
  return Object.values(
    ORDER_STATUSES
  ).includes(value as OrderStatus)
}

export async function PATCH(request: Request) {

  




  try {
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canUpdateOrderStatus(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status data" },
        { status: 400 }
      )
    }

    const { orderId, status, cancelReason } = parsed.data
    if (!isOrderStatus(status)) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid status",
    },
    { status: 400 }
  )
}
    const cleanCancelReason = cancelReason ?? ""

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

    const currentStatus = existingOrder.order_status

    if (!isOrderStatus(currentStatus)) {
      console.error("UNKNOWN ORDER STATUS:", {
        orderId,
        currentStatus,
      })

      return NextResponse.json(
        { success: false, error: "Invalid current order status" },
        { status: 400 }
      )
    }

    const transitions =
  restaurant.workflow_mode === "advanced"
    ? ADVANCED_TRANSITIONS
    : SIMPLE_TRANSITIONS

    const allowedStatuses =
  transitions[
    currentStatus as keyof typeof transitions
  ] as readonly string[] | undefined

if (!allowedStatuses?.includes(status)) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid status flow",
    },
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
      .eq("order_status", currentStatus)
      .select("id")
      .single()

    if (error || !data) {
      console.error("ORDER STATUS UPDATE DB ERROR:", error)

      return NextResponse.json(
        { success: false, error: "Order was already updated. Refresh and try again." },
        { status: 409 }
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