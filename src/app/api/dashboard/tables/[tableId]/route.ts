import { NextResponse } from "next/server"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

type Params = {
  params: Promise<{
    tableId: string
  }>
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { tableId } = await params
    const { restaurant } = await requireRestaurantUser()

    const body = await request.json()

    const updates: {
      name?: string
      is_active?: boolean
    } = {}

    if (typeof body.name === "string") {
      const name = body.name.trim()
      if (!name) {
        return NextResponse.json(
          { success: false, error: "Table name is required" },
          { status: 400 }
        )
      }
      updates.name = name
    }

    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active
    }

    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .update(updates)
      .eq("id", tableId)
      .eq("restaurant_id", restaurant.id)
      .select("id, name, is_active, created_at")
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, table: data })
  } catch (error) {
    console.error("TABLE PATCH ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update table",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { tableId } = await params
    const { restaurant } = await requireRestaurantUser()

    const { error } = await supabaseAdmin
      .from("restaurant_tables")
      .delete()
      .eq("id", tableId)
      .eq("restaurant_id", restaurant.id)

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("TABLE DELETE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete table",
      },
      { status: 500 }
    )
  }
}