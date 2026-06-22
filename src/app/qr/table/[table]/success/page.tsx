import { notFound } from "next/navigation"
import QRSuccessClient from "@/modules/qr-ordering/components/QRSuccessClient"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import { supabaseAdmin } from "@/lib/supabase/admin"

type Props = {
  params: Promise<{
    table: string
  }>
  searchParams: Promise<{
    orderId?: string
    trackingToken?: string
  }>
}



export default async function QRSuccessPage({
  params,
  searchParams,
}: Props) {
  const { orderId, trackingToken } = await searchParams

  const restaurant = await resolvePublicRestaurant()

  if (!restaurant) {
    notFound()
  }

const { table: tableToken } =
  await params

const {
  data: restaurantTable,
  error: tableError,
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

if (
  tableError ||
  !restaurantTable
) {
  notFound()
}

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRSuccessClient
  orderId={orderId}
  trackingToken={trackingToken}
  table={restaurantTable.name}
  tableToken={
    restaurantTable.qr_token
  }
  restaurantId={restaurant.id}
  restaurantPhone={
    restaurant.phone ?? null
  }
  workflowMode={
    restaurant.workflow_mode as
      "simple" | "advanced"
  }
/>
    </main>
  )
}