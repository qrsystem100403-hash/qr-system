import { notFound } from "next/navigation"
import QRSuccessClient from "@/modules/qr-ordering/components/QRSuccessClient"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

type Props = {
  params: Promise<{
    table: string
  }>
  searchParams: Promise<{
    orderId?: string
    trackingToken?: string
  }>
}

function normalizeTableName(value: string) {
  return decodeURIComponent(value).trim().replace(/\s+/g, "-")
}

export default async function QRSuccessPage({
  params,
  searchParams,
}: Props) {
  const { table } = await params
  const { orderId, trackingToken } = await searchParams

  const restaurant = await resolvePublicRestaurant()

  if (!restaurant) {
    notFound()
  }

  const normalizedTable = normalizeTableName(table)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRSuccessClient
        orderId={orderId}
        trackingToken={trackingToken}
        table={normalizedTable}
        restaurantId={restaurant.id}
        restaurantPhone={restaurant.phone ?? null}
      />
    </main>
  )
}