import { NextResponse } from "next/server"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const { restaurant } = await requireRestaurantUser()

    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .select("id, name, is_active, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("SUPABASE TABLES GET ERROR:", error)
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true, tables: data ?? [] })
  } catch (error) {
    console.error("TABLES GET ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load tables",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { restaurant } = await requireRestaurantUser()

    const body = await request.json()
    const name = String(body.name ?? "").trim()

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Table name is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .insert({
        restaurant_id: restaurant.id,
        name,
        is_active: true,
      })
      .select("id, name, is_active, created_at")
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
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, table: data })
  } catch (error) {
    console.error("TABLES POST ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create table",
      },
      { status: 500 }
    )
  }
}