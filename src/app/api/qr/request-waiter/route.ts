import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/createNotification"
import { NOTIFICATION_TYPES } from "@/lib/notification-types"

const schema = z.object({
  orderId: z.string().uuid(),
  trackingToken: z.string().trim().min(4),
  requestType: z.enum([
  "water",
  "spoon",
  "fork",
  "tissue",
  "waiter",
  "other",
]),

customMessage: z
  .string()
  .trim()
  .max(150)
  .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        {
          status: 400,
        },
      );
    }

    const {
  orderId,
  trackingToken,
  requestType,
  customMessage,
} = parsed.data;

if (
  requestType === "other" &&
  !customMessage
) {
  return NextResponse.json(
    {
      success: false,
      error: "Message is required",
    },
    {
      status: 400,
    }
  );
}

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        `
  id,
  restaurant_id,
  table_id,
  table_name,
  tracking_token,
  order_status
`,
      )
      .eq("id", orderId)
      .eq("tracking_token", trackingToken.toUpperCase())
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    if (order.order_status === "cancelled") {
      return NextResponse.json(
        {
          success: false,
          error: "Order cancelled",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingRequest } = await supabaseAdmin
      .from("requests")
      .select("id")
      .eq("order_id", order.id)
      .eq("request_type", requestType)
      .eq("status", "pending")
      .maybeSingle();

    if (existingRequest) {
      return NextResponse.json({
        success: true,
        alreadyRequested: true,
      });
    }

    const { error: insertError } = await supabaseAdmin
      .from("requests")
      .insert({
  restaurant_id: order.restaurant_id,
  table_id: order.table_id,
  table_name: order.table_name,
  order_id: order.id,
  request_type: requestType,
  custom_message:
    requestType === "other"
      ? customMessage
      : null,
  status: "pending",
});


    if (insertError) {
      console.error("WAITER REQUEST INSERT ERROR:", insertError);

      
      return NextResponse.json(
        {
          success: false,
          error: "Failed to request assistance",
        },
        {
          status: 500,
        },
      );


    }

   await createNotification({
  restaurantId: order.restaurant_id,

  type:
    NOTIFICATION_TYPES.WAITER_REQUEST,

  title:
    requestType === "other"
      ? "💬 Custom Request"
      : `${requestType
          .charAt(0)
          .toUpperCase()}${requestType.slice(1)} Request`,

  message:
    requestType === "other"
      ? `${order.table_name} • ${customMessage}`
      : `${order.table_name} requested ${requestType}`,

  entityType: "request",
})
   





    await supabaseAdmin
      .from("restaurant_tables")
      .update({
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", order.table_id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("WAITER REQUEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to request assistance",
      },
      {
        status: 500,
      },
    );
  }
}
