import { NextResponse } from "next/server"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

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

type Props = {
  params: Promise<{
    itemId: string
  }>
}

function canManageMenu(role: string) {
  return ALLOWED_MENU_ROLES.includes(role as (typeof ALLOWED_MENU_ROLES)[number])
}

async function safeDeleteCloudinaryImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("CLOUDINARY DELETE ERROR:", error)
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { itemId } = await params
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canManageMenu(role)) {
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

    const { data: existingItem, error: existingError } = await supabase
      .from("menu_items")
      .select("id, image_public_id")
      .eq("id", itemId)
      .eq("restaurant_id", restaurant.id)
      .eq("is_archived", false)
      .single()

    if (existingError || !existingItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      )
    }

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

    const updatePayload: {
      name: string
      price: number
      category_id: string
      image: string | null
      is_available: boolean
      tag: string[]
      image_public_id?: string | null
    } = {
      name,
      price,
      category_id: categoryId,
      image: image ?? null,
      is_available: isAvailable,
      tag: cleanedTag,
    }

    if (imagePublicId !== undefined) {
      updatePayload.image_public_id = imagePublicId
    }

    const { data, error } = await supabase
      .from("menu_items")
      .update(updatePayload)
      .eq("id", itemId)
      .eq("restaurant_id", restaurant.id)
      .eq("is_archived", false)
      .select("id")
      .single()

    if (error || !data) {
      console.error("SUPABASE MENU UPDATE ERROR:", error)

      return NextResponse.json(
        { success: false, error: "Failed to update menu item" },
        { status: 500 }
      )
    }

    const oldPublicId = existingItem.image_public_id

    if (oldPublicId && imagePublicId && oldPublicId !== imagePublicId) {
      await safeDeleteCloudinaryImage(oldPublicId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("MENU ITEM UPDATE ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { itemId } = await params
    const { restaurant, supabase, role } = await requireRestaurantUser()

    if (!canManageMenu(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const { data: existingItem, error: existingError } = await supabase
      .from("menu_items")
      .select("id, image_public_id")
      .eq("id", itemId)
      .eq("restaurant_id", restaurant.id)
      .eq("is_archived", false)
      .single()

    if (existingError || !existingItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from("menu_items")
      .update({
        is_archived: true,
        is_available: false,
        image: null,
        image_public_id: null,
      })
      .eq("id", itemId)
      .eq("restaurant_id", restaurant.id)
      .eq("is_archived", false)
      .select("id")
      .single()

    if (error || !data) {
      console.error("SUPABASE MENU ARCHIVE ERROR:", error)

      return NextResponse.json(
        { success: false, error: "Failed to delete menu item" },
        { status: 500 }
      )
    }

    if (existingItem.image_public_id) {
      await safeDeleteCloudinaryImage(existingItem.image_public_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("MENU ITEM DELETE ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    )
  }
}