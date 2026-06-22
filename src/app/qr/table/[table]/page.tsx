import QRMenuClient from "@/modules/qr-ordering/components/QRMenuClient"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getMenuService } from "@/modules/qr-ordering/services/menuService"
import { AlertTriangle, Store, Utensils } from "lucide-react"

type Props = {
  params: Promise<{
    table: string
  }>
}

type ErrorStateProps = {
  title: string
  message: string
  tone: "red" | "yellow"
}



function ErrorState({ title, message, tone }: ErrorStateProps) {
  const toneClass =
    tone === "red"
      ? "border-red-500/25 bg-red-500/10 text-red-100"
      : "border-yellow-500/25 bg-yellow-500/10 text-yellow-50"

  const iconClass = tone === "red" ? "text-red-300" : "text-yellow-300"

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,182,76,0.12),transparent_34%),linear-gradient(180deg,var(--color-bg),var(--color-bg-deep))]" />

      <div
        className={`relative w-full max-w-sm rounded-[30px] border p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl ${toneClass}`}
      >
        <div
          className={`mx-auto grid size-13 place-items-center rounded-2xl bg-black/25 ${iconClass}`}
        >
          <AlertTriangle className="size-6" />
        </div>

        <h1 className="mt-5 font-heading text-3xl font-normal leading-tight">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 opacity-80">
          {message}
        </p>
      </div>
    </main>
  )
}

export default async function QRTablePage({ params }: Props) {
  

  const restaurant = await resolvePublicRestaurant()

  if (!restaurant) {
    return (
      <ErrorState
        tone="red"
        title="Restaurant Not Found"
        message="This restaurant domain is not connected correctly."
      />
    )
  }

  const { table: qrToken } =
  await params

const {
  data: restaurantTable,
  error: tableError,
} = await supabaseAdmin
  .from("restaurant_tables")
  .select(
    "id, name, is_active, qr_token"
  )
  .eq(
    "restaurant_id",
    restaurant.id
  )
  .eq(
    "qr_token",
    qrToken
  )
  .single()

  if (tableError || !restaurantTable) {
    console.error("TABLE LOAD ERROR:", tableError)

    return (
      <ErrorState
        tone="red"
        title="Invalid Table"
        message="This QR table does not exist or is no longer available."
      />
    )
  }

  if (!restaurantTable.is_active) {
    return (
      <ErrorState
        tone="yellow"
        title="Table Not Active"
        message="This table is not accepting orders right now. Please contact the restaurant staff."
      />
    )
  }

  let menu: Awaited<ReturnType<typeof getMenuService>>

  try {
    menu = await getMenuService(restaurant.id)
  } catch (error) {
    console.error("MENU LOAD ERROR:", error)

    return (
      <ErrorState
        tone="red"
        title="Menu Error"
        message="Failed to load menu. Please ask the restaurant staff to refresh this QR."
      />
    )
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,182,76,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(214,182,76,0.045),transparent_30%),linear-gradient(180deg,var(--color-bg),var(--color-bg-deep))]" />

      <section className="sticky top-0 z-30 border-b border-white/[0.06] bg-[var(--color-bg)]/92 px-3 py-3 backdrop-blur-2xl sm:px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
              <Store className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
                Welcome to
              </p>

              <h1 className="truncate font-heading text-[22px] font-normal leading-none tracking-[-0.03em] sm:text-3xl">
                {restaurant.name}
              </h1>

              <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-gold)] sm:text-xs">
                <Utensils className="size-3 shrink-0" />
                <span className="truncate">{restaurantTable.name}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-5xl px-3 pb-8 sm:px-4">
        <QRMenuClient
  table={restaurantTable.name}
  tableToken={restaurantTable.qr_token}
  restaurantId={restaurant.id}
  menu={menu}
/>
      </div>
    </main>
  )
}