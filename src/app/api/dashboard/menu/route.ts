import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const ALLOWED_BADGES = [
  "Best Seller",
  "Chef's Choice",
  "Recommended",
  "Limited Time",
  "New",
  "Popular",
  "Spicy",
  "Special",
  "Today Special",
  "Must Try",
] as const

const ALLOWED_MENU_ROLES = ["owner", "manager"] as const

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  price: z.number().positive().max(99999),
  categoryId: z.string().uuid(),
  image: z.string().url().nullable().optional(),
  imagePublicId: z.string().trim().max(255).nullable().optional(),
  isAvailable: z.boolean(),
  tag: z.array(z.enum(ALLOWED_BADGES)).max(3).optional(),
})

export async function POST(request: Request) {
  try {
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!ALLOWED_MENU_ROLES.includes(role as (typeof ALLOWED_MENU_ROLES)[number])) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid menu item data" },
        { status: 400 }
      )
    }

    const {
      name,
      price,
      categoryId,
      image,
      imagePublicId,
      isAvailable,
      tag,
    } = parsed.data

    const cleanedTag = Array.from(new Set(tag ?? []))

    const { data: category, error: categoryError } = await supabase
      .from("menu_categories")
      .select("id, parent_id")
      .eq("id", categoryId)
      .eq("restaurant_id", restaurant.id)
      .eq("is_active", true)
      .not("parent_id", "is", null)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { success: false, error: "Invalid subcategory" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: restaurant.id,
        name,
        price,
        category_id: categoryId,
        image: image ?? null,
        image_public_id: imagePublicId ?? null,
        is_available: isAvailable,
        is_archived: false,
        tag: cleanedTag,
      })
      .select("id")
      .single()

    if (error || !data) {
      console.error("SUPABASE MENU INSERT ERROR:", error)

      return NextResponse.json(
        { success: false, error: "Failed to create menu item" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      itemId: data.id,
    })
  } catch (error) {
    console.error("CREATE MENU ITEM ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to create menu item" },
      { status: 500 }
    )
  }
}