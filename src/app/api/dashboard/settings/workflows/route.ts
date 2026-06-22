import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

const schema = z.object({
  workflow_mode: z.enum([
    "simple",
    "advanced",
  ]),

  table_workflow_mode: z.enum([
    "simple",
    "advanced",
    "expert",
  ]),
})

const ALLOWED_ROLES = [
  "owner",
  "manager",
] as const

function canManageSettings(role: string) {
  return ALLOWED_ROLES.includes(
    role as (typeof ALLOWED_ROLES)[number]
  )
}

export async function GET() {
  try {
    const {
      restaurant,
    } = await requireRestaurantUser()

    return NextResponse.json({
      success: true,
      settings: {
        workflow_mode:
          restaurant.workflow_mode,

        table_workflow_mode:
          restaurant.table_workflow_mode,
      },
    })
  } catch (error) {
    console.error(
      "WORKFLOW SETTINGS GET ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load settings",
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const {
      restaurant,
      supabase,
      role,
    } = await requireRestaurantUser()

    if (!canManageSettings(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        {
          status: 403,
        }
      )
    }

    const body = await request.json()

console.log(
  "BODY RECEIVED:",
  body
)

const parsed =
  schema.safeParse(body)

if (!parsed.success) {
  console.log(
    "ZOD ERROR:",
    parsed.error.format()
  )

  return NextResponse.json(
    {
      success: false,
      error: "Invalid settings",
    },
    {
      status: 400,
    }
  )
}

    const workflow_mode =
  parsed.data.workflow_mode ??
  "simple"

const table_workflow_mode =
  parsed.data.table_workflow_mode ??
  "simple"

    const { error } =
  await supabaseAdmin
    .from("restaurants")
    .update({
      workflow_mode,
      table_workflow_mode,
    })
    .eq("id", restaurant.id)

    if (error) {
      console.error(
        "WORKFLOW SETTINGS UPDATE ERROR:",
        error
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to save settings",
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
      "WORKFLOW SETTINGS PATCH ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to save settings",
      },
      {
        status: 500,
      }
    )
  }
}   