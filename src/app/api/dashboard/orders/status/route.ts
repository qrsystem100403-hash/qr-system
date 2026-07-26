import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import type { OrderStatus } from "@/lib/orders/statuses";
import { ORDER_STATUSES } from "@/lib/orders/statuses";
import { ROLES } from "@/lib/auth/roles";
import { AppError } from "@/lib/errors";

import { OrderStatusService } from "@/modules/orders/services/order-status.service";

const orderStatusService = new OrderStatusService();

const schema = z.object({
  orderId: z.string().uuid(),
  status: z.string(),
  cancelReason: z.string().trim().max(200).optional(),
});

const ALLOWED_ORDER_STATUS_ROLES = [
  ROLES.OWNER,
  ROLES.MANAGER,
  ROLES.KITCHEN,
] as const;

function canUpdateOrderStatus(role: string) {
  return ALLOWED_ORDER_STATUS_ROLES.includes(
    role as (typeof ALLOWED_ORDER_STATUS_ROLES)[number],
  );
}

function isOrderStatus(
  value: unknown,
): value is OrderStatus {
  return Object.values(
    ORDER_STATUSES,
  ).includes(value as OrderStatus);
}

export async function PATCH(request: Request) {
  try {
    const {
      restaurant,
      role,
    } = await requireRestaurantUser();

    if (!canUpdateOrderStatus(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status data",
        },
        {
          status: 400,
        },
      );
    }

    const {
      orderId,
      status,
      cancelReason,
    } = parsed.data;

    if (!isOrderStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
        },
        {
          status: 400,
        },
      );
    }

    if (
      status === "cancelled" &&
      !cancelReason
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cancellation reason is required",
        },
        {
          status: 400,
        },
      );
    }

    await orderStatusService.updateStatus({
      restaurantId: restaurant.id,
      workflowMode:
        restaurant.workflow_mode,
      tableWorkflowMode:
        restaurant.table_workflow_mode,
      orderId,
      status,
      cancelReason:
        cancelReason ?? null,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        {
          status: error.status,
        },
      );
    }

    console.error(
      "ORDER STATUS UPDATE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update order status",
      },
      {
        status: 500,
      },
    );
  }
}