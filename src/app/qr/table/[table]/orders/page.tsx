import { notFound } from "next/navigation"
import QRMyOrdersClientV2 from "@/modules/qr-ordering/components/session/QRMyOrdersClientV2"
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant"
import { supabaseAdmin } from "@/lib/supabase/admin"

type PageProps = {
  params: Promise<{
    table: string
  }>
}

export default async function QRMyOrdersPage({
  params,
}: PageProps) {
  const { table: tableToken } =
    await params

  const resolved =
  await resolvePublicRestaurant()

if (!resolved) {
  notFound()
}

const { restaurant } = resolved
// or:
// const { restaurant, features } = resolved

  const {
    data: restaurantTable,
  } = await supabaseAdmin
    .from("restaurant_tables")
    .select(
      "id,name,qr_token,is_active"
    )
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .eq(
      "qr_token",
      tableToken
    )
    .single()

  if (!restaurantTable) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-4xl px-4 py-5">
        <QRMyOrdersClientV2
          table={restaurantTable.name}
          tableToken={
            restaurantTable.qr_token
          }
          restaurantPhone={
            restaurant.phone ?? null
          }
        />
      </div>
    </main>
  )
}