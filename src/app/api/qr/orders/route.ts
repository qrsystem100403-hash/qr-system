import { NextResponse } from "next/server"
import { z } from "zod"

import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant"

import { cookies } from "next/headers"
import {
  SESSION_COOKIE_NAME,
} from "@/modules/sessions";
import { AppError } from "@/lib/errors";



import {
  orderBillingService,
  orderCreateService,
  orderMenuValidationService,
  orderRateLimitService,
  orderSessionService,
  orderTableService,
  requestValidationService,
} from "@/modules/orders/container";



const MAX_ITEM_QUANTITY = 20




const cartAddonSchema = z.object({
  id: z.string().uuid(),
})

const cartVariantSchema = z.object({
  id: z.string().uuid(),
})

const cartItemSchema = z.object({
  cartKey: z.string().min(1).max(300),
  id: z.string().uuid(),
  quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
  variant: cartVariantSchema.nullable(),
  addons: z.array(cartAddonSchema).max(10),
})

const orderSchema = z.object({
  tableToken: z.string().min(20).max(100),
  cart: z.array(cartItemSchema).min(1).max(50),
  customerNote: z.string().trim().max(300).optional(),
})







function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown"

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  )
}



export async function POST(request: Request) {


  try {
    const resolved = await resolvePublicRestaurant()

if (!resolved) {
  return NextResponse.json(
    { success: false, error: "Restaurant not found" },
    { status: 404 }
  )
}

const { restaurant } = resolved
// If you need feature flags later:
// const { restaurant, features } = resolved

    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
  {
    success: false,
    error: "Invalid order data",
    issues: parsed.error.flatten(),
  },
  {
    status: 400,
  },
);
    }

    const {
  tableToken,
  cart,
  customerNote,
} = parsed.data
    requestValidationService.validateCart(cart);

    const cleanedCustomerNote = customerNote || null
    const clientIp = getClientIp(request)

    

    

   const restaurantTable =
  await orderTableService.getTableByToken(
    restaurant.id,
    tableToken,
  );

    



const sessionToken =
  (await cookies()).get(
    SESSION_COOKIE_NAME,
  )?.value;

const {
  session,
  newSessionToken,
} = await orderSessionService.resolve(
  restaurant.id,
  restaurantTable.id,
  sessionToken,
);
    
await orderRateLimitService.check(
  restaurant.id,
  restaurantTable.id,
);

    console.info("QR ORDER ATTEMPT:", {
      restaurantId: restaurant.id,
      table: restaurantTable.name,
      clientIp,
    })

    
const {
  validatedCart,
} = await orderMenuValidationService.validateCart(
  restaurant.id,
  cart,
);

  const {
  billing,
  subtotal,
  serviceCharge,
  gstAmount,
  roundOff,
  grandTotal,
} = await orderBillingService.calculate(
  restaurant.id,
  validatedCart,
);
    

requestValidationService.validateGrandTotal(
  grandTotal,
);

    

const order =
  await orderCreateService.createOrder({
    restaurantId: restaurant.id,
    restaurantTable,
    sessionId: session.id,
    validatedCart,
    billing,
    subtotal,
    serviceCharge,
    gstAmount,
    roundOff,
    grandTotal,
    customerNote: cleanedCustomerNote,
  });

const response = NextResponse.json({
  success: true,
  orderId: order.orderId,
  trackingToken: order.trackingToken,
});

if (newSessionToken) {
  response.cookies.set(
    SESSION_COOKIE_NAME,
    newSessionToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    }
  );
}

return response;
  } catch (error) {
    console.error("QR ORDER ERROR:", error)


    if (error instanceof AppError) {
  return NextResponse.json(
    {
      success: false,
      error: error.message,
    },
    {
      status: error.status,
    },
  );
}


    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    )
  }
}