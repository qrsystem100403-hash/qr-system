import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import crypto from "crypto";

const ALLOWED_TABLE_ROLES = ["owner", "manager"] as const

const createTableSchema = z.object({
  name: z.string().trim().min(1).max(30),
})

function canManageTables(role: string) {
  return ALLOWED_TABLE_ROLES.includes(
    role as (typeof ALLOWED_TABLE_ROLES)[number]
  )
}

function normalizeTableName(value: string) {
  return value.trim().replace(/\s+/g, "-")
}

export async function GET() {
  try {
    const { restaurant, supabase } = await requireRestaurantUser()

    const { data, error } = await supabase
      .from("restaurant_tables")
      .select(
  "id, name, qr_token, is_active, status, last_activity_at, created_at"
)

      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("SUPABASE TABLES GET ERROR:", error)

      return NextResponse.json(
        { success: false, error: "Failed to load tables" },
        { status: 500 }
      )
    }

    console.log("RESTAURANT:", {
  workflow_mode:
    restaurant.workflow_mode,

  table_workflow_mode:
    restaurant.table_workflow_mode,
})

    return NextResponse.json({
  success: true,
  tables: data ?? [],

  tableWorkflowMode:
    restaurant.table_workflow_mode ??
    "simple",
})
  } catch (error) {
    console.error("TABLES GET ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to load tables" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canManageTables(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = createTableSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid table data" },
        { status: 400 }
      )
    }

    const name = normalizeTableName(parsed.data.name)

    const { data, error } = await supabase
      .from("restaurant_tables")
      .insert({
  restaurant_id: restaurant.id,
  name,
  is_active: true,
  qr_token: crypto.randomBytes(16).toString("hex"),
})
      .select(
  "id, name, qr_token, is_active, status, last_activity_at, created_at"
)
.single()
      

    if (error) {
      console.error("SUPABASE TABLE INSERT ERROR:", error)

      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Table name already exists" },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { success: false, error: "Failed to create table" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, table: data })
  } catch (error) {
    console.error("TABLES POST ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to create table" },
      { status: 500 }
    )
  }
}