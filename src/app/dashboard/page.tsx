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
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-[#111827] dark:text-[#E7E9EC]">
        Dashboard
      </h1>

      <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
        Welcome back, {restaurant.name}
      </p>
    </div>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="
              rounded-3xl
              border
              border-[#E4DED3]
              bg-white
              p-5
              transition
              hover:bg-[#F7F8FA]

              dark:border-[#2A2F35]
              dark:bg-[#171A1F]
              dark:hover:bg-[#20242A]
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F7F8FA] dark:bg-[#20242A]">
                <Icon className="size-5" />
              </div>

              <ArrowRight className="size-4 text-[#98A2B3]" />
            </div>

            <p className="mt-4 text-xs font-medium text-[#667085] dark:text-[#AAB2BD]">
              {stat.label}
            </p>

            <p className="mt-2 text-4xl font-black text-[#111827] dark:text-[#E7E9EC]">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              {stat.helper}
            </p>
          </Link>
        )
      })}
    </section>

    <section className="rounded-3xl border border-[#E4DED3] bg-white p-6 dark:border-[#2A2F35] dark:bg-[#171A1F]">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#111827] dark:text-[#E7E9EC]">
          Order Status
        </h2>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
          Current order pipeline
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-[#F3C6C2] bg-[#FDECEC] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#B42318]">
              Pending
            </span>

            <Clock3 className="size-4 text-[#B42318]" />
          </div>

          <p className="mt-3 text-3xl font-black text-[#B42318]">
            {pendingOrders ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-[#FED7AA] bg-[#FFF4E5] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#C2410C]">
              Preparing
            </span>

            <Utensils className="size-4 text-[#C2410C]" />
          </div>

          <p className="mt-3 text-3xl font-black text-[#C2410C]">
            {preparingOrders ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-[#BFE4CE] bg-[#E7F3EC] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#2F7D57]">
              Ready
            </span>

            <CheckCircle2 className="size-4 text-[#2F7D57]" />
          </div>

          <p className="mt-3 text-3xl font-black text-[#2F7D57]">
            {readyOrders ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4DED3] bg-[#F7F8FA] p-5 dark:border-[#2A2F35] dark:bg-[#20242A]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#475467] dark:text-[#AAB2BD]">
              Cancelled
            </span>

            <XCircle className="size-4 text-[#475467]" />
          </div>

          <p className="mt-3 text-3xl font-black text-[#475467] dark:text-[#E7E9EC]">
            {cancelledToday}
          </p>
        </div>
      </div>
    </section>

    <section className="rounded-3xl border border-[#E4DED3] bg-white p-6 dark:border-[#2A2F35] dark:bg-[#171A1F]">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#111827] dark:text-[#E7E9EC]">
          Quick Access
        </h2>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
          Navigate to important sections
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/dashboard/orders"
          className="rounded-2xl border border-[#E4DED3] p-5 transition hover:bg-[#F7F8FA] dark:border-[#2A2F35] dark:hover:bg-[#20242A]"
        >
          <ReceiptText className="size-6" />

          <h3 className="mt-3 font-semibold">
            Orders
          </h3>

          <p className="mt-1 text-sm text-[#667085]">
            Manage live orders
          </p>
        </Link>

        <Link
          href="/dashboard/menu"
          className="rounded-2xl border border-[#E4DED3] p-5 transition hover:bg-[#F7F8FA] dark:border-[#2A2F35] dark:hover:bg-[#20242A]"
        >
          <Utensils className="size-6" />

          <h3 className="mt-3 font-semibold">
            Menu
          </h3>

          <p className="mt-1 text-sm text-[#667085]">
            Manage food items
          </p>
        </Link>

        <Link
          href="/dashboard/tables"
          className="rounded-2xl border border-[#E4DED3] p-5 transition hover:bg-[#F7F8FA] dark:border-[#2A2F35] dark:hover:bg-[#20242A]"
        >
          <Table2 className="size-6" />

          <h3 className="mt-3 font-semibold">
            Tables
          </h3>

          <p className="mt-1 text-sm text-[#667085]">
            Manage QR tables
          </p>
        </Link>

        <Link
          href="/dashboard/operations"
          className="rounded-2xl border border-[#E4DED3] p-5 transition hover:bg-[#F7F8FA] dark:border-[#2A2F35] dark:hover:bg-[#20242A]"
        >
          <LayoutDashboard className="size-6" />

          <h3 className="mt-3 font-semibold">
            Operations
          </h3>

          <p className="mt-1 text-sm text-[#667085]">
            Handle service requests
          </p>
        </Link>
      </div>
    </section>
  </div>
)
}