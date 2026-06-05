import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

const ALLOWED_MENU_ROLES = ["owner", "manager"] as const

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
])

const MAX_IMAGE_SIZE = 3 * 1024 * 1024

function canManageMenu(role: string) {
  return ALLOWED_MENU_ROLES.includes(role as (typeof ALLOWED_MENU_ROLES)[number])
}

function assertCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables")
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })
}

export async function POST(request: Request) {
  try {
    assertCloudinaryEnv()

    const { restaurant, role } = await requireRestaurantUser()

    if (!canManageMenu(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      )
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, PNG, WEBP, or AVIF images are allowed",
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image must be less than 3MB" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<{
      secure_url: string
      public_id: string
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `restaurants/${restaurant.id}/menu`,
            resource_type: "image",
            overwrite: false,
            use_filename: false,
            unique_filename: true,
            transformation: [
              {
                width: 800,
                height: 800,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Cloudinary upload failed"))
              return
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            })
          }
        )
        .end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("MENU IMAGE UPLOAD ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    )
  }
}