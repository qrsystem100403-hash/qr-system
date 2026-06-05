import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const ALLOWED_TABLE_ROLES = ["owner", "manager"] as const

const paramsSchema = z.object({
  tableId: z.string().uuid(),
})

const updateTableSchema = z
  .object({
    name: z.string().trim().min(1).max(30).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.is_active !== undefined, {
    message: "No valid fields provided",
  })

type Params = {
  params: Promise<{
    tableId: string
  }>
}

function canManageTables(role: string) {
  return ALLOWED_TABLE_ROLES.includes(
    role as (typeof ALLOWED_TABLE_ROLES)[number]
  )
}

function normalizeTableName(value: string) {
  return value.trim().replace(/\s+/g, "-")
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const rawParams = await params
    const parsedParams = paramsSchema.safeParse(rawParams)

    if (!parsedParams.success) {
      return NextResponse.json(
        { success: false, error: "Invalid table id" },
        { status: 400 }
      )
    }

    const { tableId } = parsedParams.data
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canManageTables(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsedBody = updateTableSchema.safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: "Invalid table data" },
        { status: 400 }
      )
    }

    const updates: {
      name?: string
      is_active?: boolean
    } = {}

    if (parsedBody.data.name !== undefined) {
      updates.name = normalizeTableName(parsedBody.data.name)
    }

    if (parsedBody.data.is_active !== undefined) {
      updates.is_active = parsedBody.data.is_active
    }

    const { data, error } = await supabase
      .from("restaurant_tables")
      .update(updates)
      .eq("id", tableId)
      .eq("restaurant_id", restaurant.id)
      .select("id, name, is_active, created_at")
      .single()

    if (error) {
      console.error("SUPABASE TABLE UPDATE ERROR:", error)

      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Table name already exists" },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { success: false, error: "Failed to update table" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, table: data })
  } catch (error) {
    console.error("TABLE PATCH ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to update table" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const rawParams = await params
    const parsedParams = paramsSchema.safeParse(rawParams)

    if (!parsedParams.success) {
      return NextResponse.json(
        { success: false, error: "Invalid table id" },
        { status: 400 }
      )
    }

    const { tableId } = parsedParams.data
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canManageTables(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from("restaurant_tables")
      .delete()
      .eq("id", tableId)
      .eq("restaurant_id", restaurant.id)

    if (error) {
      console.error("SUPABASE TABLE DELETE ERROR:", error)

      return NextResponse.json(
        { success: false, error: "Failed to delete table" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("TABLE DELETE ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to delete table" },
      { status: 500 }
    )
  }
}