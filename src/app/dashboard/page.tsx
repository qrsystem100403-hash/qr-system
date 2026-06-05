import Link from "next/link"
import {
  ArrowRight,
  IndianRupee,
  LayoutDashboard,
  QrCode,
  ReceiptText,
  Table2,
  Utensils,
  Clock3,
  CheckCircle2,
  XCircle,
  Store,
} from "lucide-react"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

function getTodayIndiaRange() {
  const now = new Date()

  const indiaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)

  const start = new Date(`${indiaDate}T00:00:00+05:30`)
  const end = new Date(`${indiaDate}T23:59:59.999+05:30`)

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

export default async function DashboardPage() {
  const { restaurant, supabase } = await requireRestaurantUser()

  const { start, end } = getTodayIndiaRange()

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("id, total, order_status, payment_status")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", start)
    .lte("created_at", end)

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "pending")

  const { count: preparingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "preparing")

  const { count: readyOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "ready")

  const { count: activeTables } = await supabase
    .from("restaurant_tables")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)

  const totalOrders = todayOrders?.length ?? 0

  const todayRevenue =
    todayOrders
      ?.filter((order) => order.order_status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total ?? 0), 0) ?? 0

  const cancelledToday =
    todayOrders?.filter((order) => order.order_status === "cancelled").length ??
    0

  const activeOrders =
    (pendingOrders ?? 0) + (preparingOrders ?? 0) + (readyOrders ?? 0)

  const stats = [
    {
      label: "Today Orders",
      value: totalOrders,
      href: "/dashboard/orders",
      icon: ReceiptText,
      helper: "Orders received today",
      tone: "gold",
    },
    {
      label: "Today Revenue",
      value: `₹${todayRevenue}`,
      href: "/dashboard/orders/history",
      icon: IndianRupee,
      helper: "Cancelled orders excluded",
      tone: "green",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      href: "/dashboard/orders",
      icon: LayoutDashboard,
      helper: "Pending, preparing and ready",
      tone: "blue",
    },
    {
      label: "Active Tables",
      value: activeTables ?? 0,
      href: "/dashboard/tables",
      icon: Table2,
      helper: "QR tables currently enabled",
      tone: "gold",
    },
  ]

  const orderFlow = [
    {
      label: "Pending",
      value: pendingOrders ?? 0,
      icon: Clock3,
      className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
    },
    {
      label: "Preparing",
      value: preparingOrders ?? 0,
      icon: Utensils,
      className: "border-blue-500/20 bg-blue-500/10 text-blue-200",
    },
    {
      label: "Ready",
      value: readyOrders ?? 0,
      icon: CheckCircle2,
      className: "border-green-500/20 bg-green-500/10 text-green-200",
    },
    {
      label: "Cancelled Today",
      value: cancelledToday,
      icon: XCircle,
      className: "border-red-500/20 bg-red-500/10 text-red-200",
    },
  ]

  const quickActions = [
    {
      title: "Live Orders",
      description: "Manage pending, preparing and ready orders in real time.",
      href: "/dashboard/orders",
      icon: ReceiptText,
    },
    {
      title: "Menu",
      description: "Update items, prices, categories and availability.",
      href: "/dashboard/menu",
      icon: Utensils,
    },
    {
      title: "QR Tables",
      description: "Create table QR codes and control active tables.",
      href: "/dashboard/tables",
      icon: QrCode,
    },
  ]

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[34px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.014))] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--color-gold)]/12 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-gold)]/55 bg-[var(--color-gold)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
              <Store className="size-3.5" />
              Owner Dashboard
            </div>

            <h1 className="mt-5 font-heading text-5xl font-normal leading-none tracking-[-0.05em] sm:text-6xl">
              Control Center
            </h1>

            <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Live overview for{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {restaurant.name}
              </span>
              . Track orders, revenue, tables and menu actions from one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/orders"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-bg)] shadow-[0_18px_38px_rgba(214,182,76,0.16)] transition hover:brightness-110"
            >
              View Orders
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/dashboard/tables"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-5 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)]/55 hover:text-[var(--color-gold)]"
            >
              QR Tables
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-[26px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.012))] p-4 shadow-[0_14px_45px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-gold)]/40 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-10 place-items-center rounded-2xl border border-[var(--color-border-gold)]/30 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <Icon className="size-5" strokeWidth={1.8} />
                </div>

                <ArrowRight className="size-4 text-[var(--color-text-soft)] transition group-hover:translate-x-1 group-hover:text-[var(--color-gold)]" />
              </div>

              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                {stat.label}
              </p>

              <p className="mt-2 font-heading text-4xl font-normal leading-none tracking-[-0.04em]">
                {stat.value}
              </p>

              <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
                {stat.helper}
              </p>
            </Link>
          )
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[30px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Kitchen Flow
              </p>
              <h2 className="mt-2 font-heading text-3xl font-normal tracking-[-0.04em]">
                Order Pipeline
              </h2>
            </div>

            <Link
              href="/dashboard/orders"
              className="rounded-full border border-[var(--color-border-gold)]/35 bg-[var(--color-gold)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/15"
            >
              Open
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {orderFlow.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] ${item.className}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em]">
                      {item.label}
                    </p>
                    <Icon className="size-4" />
                  </div>

                  <p className="mt-3 font-heading text-4xl font-normal leading-none tracking-[-0.04em]">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.012))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gold)]">
            Quick Actions
          </p>

          <h2 className="mt-2 font-heading text-3xl font-normal tracking-[-0.04em]">
            Manage Restaurant
          </h2>

          <div className="mt-5 space-y-2.5">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/18 p-3.5 transition hover:border-[var(--color-border-gold)]/40 hover:bg-white/[0.025]"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[var(--color-border-gold)]/25 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-xl font-normal leading-none tracking-[-0.03em] sm:text-2xl">
                      {action.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)]">
                      {action.description}
                    </p>
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-[var(--color-text-soft)] transition group-hover:translate-x-1 group-hover:text-[var(--color-gold)]" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}