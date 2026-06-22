import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant";

const schema = z.object({
  tableToken: z.string().min(20).max(100),
});

export async function POST(request: Request) {
  try {
    const restaurant = await resolvePublicRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant not found",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid table",
        },
        {
          status: 400,
        },
      );
    }

    const { tableToken } = parsed.data;

    const { data: table, error } = await supabaseAdmin
      .from("restaurant_tables")
      .select(
        `
  id,
  is_active,
  status,
  current_session_token,
  session_expires_at
`,
      )
      .eq("restaurant_id", restaurant.id)
      .eq("qr_token", tableToken)
      .single();

    if (error || !table) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid table",
        },
        {
          status: 400,
        },
      );
    }

    if (!table.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "Table inactive",
        },
        {
          status: 400,
        },
      );
    }

    const now = Date.now();

    const existingValid =
      table.current_session_token &&
      table.session_expires_at &&
      new Date(table.session_expires_at).getTime() > now;

      const tableStatus =
  table.status ?? "available"

     if (
  !existingValid &&
  tableStatus !== "available"
) {
  return NextResponse.json(
    {
      success: false,
      error: "Session expired",
    },
    {
      status: 403,
    }
  )
}

    let sessionToken =
  table.current_session_token ?? null;

   if (
  !existingValid &&
  tableStatus === "available"
) {
  sessionToken =
    randomBytes(32).toString("hex");

  const { error: sessionError } =
    await supabaseAdmin
      .from("restaurant_tables")
      .update({
        current_session_token:
          sessionToken,

        session_started_at:
          new Date().toISOString(),

        session_expires_at:
          new Date(
            now +
              90 * 60 * 1000
          ).toISOString(),
      })
      .eq("id", table.id);

  if (sessionError) {
    throw sessionError;
  }
}
   



    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("qr_session", sessionToken!, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 90 * 60,
    });

    return response;
  } catch (error) {
    console.error("QR SESSION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
