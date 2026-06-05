// src/lib/publicRestaurantResolver.ts
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

function normalizeHost(host: string) {
  return host
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(":")[0]
    .trim()
    .toLowerCase()
}

export async function resolvePublicRestaurant() {
  const headersList = await headers()

  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    ""

  const domain = normalizeHost(host)

  const { data: restaurant, error } = await supabaseAdmin
    .from("restaurants")
    .select("id, name, domain, phone")
    .eq("domain", domain)
    .single()

  if (error || !restaurant) {
    return null
  }

  return restaurant
}