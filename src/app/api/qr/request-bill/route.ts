    // src/app/api/qr/request-bill/route.ts

    import { NextResponse } from "next/server"
    import { z } from "zod"
    import { supabaseAdmin } from "@/lib/supabase/admin"
    import { createNotification } from "@/lib/createNotification"
import { NOTIFICATION_TYPES } from "@/lib/notification-types"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

    const schema = z.object({
    orderId: z.string().uuid(),
    trackingToken: z.string().trim().min(4),
    })

    export async function POST(request: Request) {

        const restaurant =
  await resolvePublicRestaurant()

if (!restaurant) {
  return NextResponse.json(
    {
      success: false,
      error: "Restaurant not found",
    },
    {
      status: 404,
    }
  )
}
    try {
        const body = await request.json()

        const parsed = schema.safeParse(body)

        if (!parsed.success) {
        return NextResponse.json(
            {
            success: false,
            error: "Invalid request",
            },
            {
            status: 400,
            }
        )
        }

        const { orderId, trackingToken } = parsed.data

        const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .select(`
  id,
  restaurant_id,
  table_id,
  table_name,
  tracking_token,
  order_status
`)
        .eq("id", orderId)
        .eq("tracking_token", trackingToken.toUpperCase())
        .single()

        if (orderError || !order) {
        return NextResponse.json(
            {
            success: false,
            error: "Order not found",
            },
            {
            status: 404,
            }
        )
        }

        if (order.order_status === "cancelled") {
        return NextResponse.json(
            {
            success: false,
            error: "Cancelled order cannot request bill",
            },
            {
            status: 400,
            }
        )
        }

        const { data: existingRequest } = await supabaseAdmin
        .from("requests")
        .select("id")
        .eq("order_id", order.id)
        .eq("request_type", "bill")
        .eq("status", "pending")
        .maybeSingle()

        if (existingRequest) {
        return NextResponse.json({
            success: true,
            alreadyRequested: true,
        })
        }

        const { error: billRequestError } = await supabaseAdmin
        .from("requests")
.insert({
  restaurant_id: order.restaurant_id,
  table_id: order.table_id,
  table_name: order.table_name,
  order_id: order.id,

  request_type: "bill",

  status: "pending",
})

        if (billRequestError) {
        console.error(
            "BILL REQUEST INSERT ERROR:",
            billRequestError
        )

        return NextResponse.json(
            {
            success: false,
            error: "Failed to request bill",
            },
            {
            status: 500,
            }
        )
        }

        await createNotification({
  restaurantId: order.restaurant_id,

  type:
    NOTIFICATION_TYPES.BILL_REQUEST,

  title: "Bill Request",

  message:
    `${order.table_name} requested bill`,

  entityType: "request",

  entityId: order.id,
})

        if (
  restaurant.table_workflow_mode !==
  "expert"
) {
  const {
    error: tableUpdateError,
  } = await supabaseAdmin
    .from("restaurant_tables")
    .update({
      status: "bill_requested",

      last_activity_at:
        new Date().toISOString(),
    })
    .eq("id", order.table_id)

  if (tableUpdateError) {
    console.error(
      "TABLE STATUS UPDATE ERROR:",
      tableUpdateError
    )
  }
}

        return NextResponse.json({
        success: true,
        })
    } catch (error) {
        console.error("REQUEST BILL ERROR:", error)

        return NextResponse.json(
        {
            success: false,
            error: "Failed to request bill",
        },
        {
            status: 500,
        }
        )
    }
    }