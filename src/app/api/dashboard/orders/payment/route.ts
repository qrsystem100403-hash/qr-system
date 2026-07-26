import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { OrderPaymentService } from "@/modules/orders/services/order-payment.service";

const paymentService = new OrderPaymentService();

const ALLOWED_PAYMENT_ROLES = [
  "owner",
  "manager",
  "cashier",
] as const;

const schema = z.object({
  orderId: z.string().uuid(),
  paymentStatus: z.literal("paid"),
});

function canUpdatePayment(role: string) {
  return ALLOWED_PAYMENT_ROLES.includes(
    role as (typeof ALLOWED_PAYMENT_ROLES)[number],
  );
}

export async function PATCH(request: Request) {
  try {
    const {
      restaurant,
      role,
    } = await requireRestaurantUser();

    if (!canUpdatePayment(role)) {
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

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment data",
        },
        {
          status: 400,
        },
      );
    }

    const { orderId } = parsed.data;

    await paymentService.updatePayment({
      restaurantId: restaurant.id,
      orderId,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "PAYMENT STATUS UPDATE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment status",
      },
      {
        status: 500,
      },
    );
  }
}