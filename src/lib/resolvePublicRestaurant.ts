// src/lib/resolvePublicRestaurant.ts

import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

function cleanHost(host: string) {
  return host
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(":")[0]
    .toLowerCase()
    .trim()
}

export async function resolvePublicRestaurant() {
  const headersList = await headers()

  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    ""

  const domain = cleanHost(host)

  if (!domain) {
    throw new Error("Domain not found")
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .ilike("domain", domain)
    .single()

  if (error || !data) {
    throw new Error(`Restaurant not found for domain: ${domain}`)
  }

  return data
}