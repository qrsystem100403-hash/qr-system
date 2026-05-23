import { notFound } from "next/navigation"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import QRCartClient from "@/modules/qr-ordering/components/QRCartClient"

type Props = {
  params: Promise<{
    table: string
  }>
}

function normalizeTableName(value: string) {
  return decodeURIComponent(value).trim().replace(/\s+/g, "-")
}

export default async function QRCartPage({ params }: Props) {
  const { table } = await params

  const restaurant = await resolvePublicRestaurant()

  if (!restaurant) {
    notFound()
  }

  const normalizedTable = normalizeTableName(table)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRCartClient table={normalizedTable} restaurantId={restaurant.id} />
    </main>
  )
}