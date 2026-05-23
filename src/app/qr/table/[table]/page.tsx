import QRMenuClient from "@/modules/qr-ordering/components/QRMenuClient"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import { createSupabaseServerClient } from "@/lib/supabase/server"
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

function normalizeTableName(value: string) {
  return decodeURIComponent(value).trim().replace(/\s+/g, "-")
}

function ErrorState({ title, message, tone }: ErrorStateProps) {
  const toneClass =
    tone === "red"
      ? "border-red-500/25 bg-red-500/10 text-red-200"
      : "border-yellow-500/25 bg-yellow-500/10 text-yellow-100"

  const iconClass = tone === "red" ? "text-red-300" : "text-yellow-300"

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)]">
      <div
        className={`w-full max-w-sm rounded-[28px] border p-6 text-center shadow-[var(--shadow-soft)] ${toneClass}`}
      >
        <div
          className={`mx-auto grid size-12 place-items-center rounded-full bg-black/20 ${iconClass}`}
        >
          <AlertTriangle className="size-6" />
        </div>

        <h1 className="mt-5 font-heading text-3xl font-normal">{title}</h1>

        <p className="mt-3 text-sm leading-6 opacity-80">{message}</p>
      </div>
    </main>
  )
}

export default async function QRTablePage({ params }: Props) {
  const { table } = await params

  const restaurant = await resolvePublicRestaurant()
  const supabase = await createSupabaseServerClient()

  const normalizedTable = normalizeTableName(table)

  const { data: restaurantTable, error: tableError } = await supabase
    .from("restaurant_tables")
    .select("id, name, is_active")
    .eq("restaurant_id", restaurant.id)
    .ilike("name", normalizedTable)
    .single()

  if (tableError || !restaurantTable) {
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

  const { data: menu, error } = await supabase
    .from("menu_items")
    .select(`
      id,
      restaurant_id,
      name,
      price,
      category_id,
      image,
      is_available,
      is_archived,
      menu_categories (
        id,
        name,
        sort_order,
        available_from,
        available_until,
        parent_id,
        parent:menu_categories (
          id,
          name,
          sort_order,
          available_from,
          available_until
        )
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_archived", false)
    .order("name", { ascending: true })

  if (error) {
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
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
              <Store className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate font-heading text-xl font-normal leading-none sm:text-2xl">
                {restaurant.name}
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                <Utensils className="size-3" />
                {restaurantTable.name}
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-full border border-[var(--color-border)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            QR Menu
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-4">
        <QRMenuClient
          table={restaurantTable.name}
          restaurantId={restaurant.id}
          menu={
            (menu ?? []) as unknown as Parameters<
              typeof QRMenuClient
            >[0]["menu"]
          }
        />
      </div>
    </main>
  )
}