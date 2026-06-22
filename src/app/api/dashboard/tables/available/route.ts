import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const schema = z.object({
  tableId: z.string().uuid(),

  status: z.enum([
    "available",
    "occupied",
    "bill_requested",
  ]),
})

const ALLOWED_ROLES = ["owner", "manager", "cashier"] as const

function canManageTable(role: string) {
  return ALLOWED_ROLES.includes(
    role as (typeof ALLOWED_ROLES)[number]
  )
}

export async function PATCH(request: Request) {
  try {
    const { restaurant, supabase, role } =
      await requireRestaurantUser()

    if (!canManageTable(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()

    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid table" },
        { status: 400 }
      )
    }

    const {
  tableId,
  status,
} = parsed.data

    const updates: Record<
  string,
  unknown
> = {
  status,
  last_activity_at:
    new Date().toISOString(),
}

if (
  status === "available"
) {
  updates.current_session_token =
    null

  updates.session_started_at =
    null

  updates.session_expires_at =
    null
}

const { error } =
  await supabase
    .from("restaurant_tables")
    .update(updates)
    .eq("id", tableId)
    .eq(
      "restaurant_id",
      restaurant.id
    )

    if (error) {
      console.error(
        "TABLE AVAILABLE UPDATE ERROR:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          error: "Failed to update table",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "TABLE AVAILABLE ROUTE ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update table",
      },
      {
        status: 500,
      }
    )
  }
}