import Link from "next/link";
import {
  ArrowRight,
  IndianRupee,
  LayoutDashboard,
  QrCode,
  ReceiptText,
  Table2,
  Utensils,
} from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

function getTodayIndiaRange() {
  const now = new Date();

  const indiaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const start = new Date(`${indiaDate}T00:00:00+05:30`);
  const end = new Date(`${indiaDate}T23:59:59.999+05:30`);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export default async function DashboardPage() {
  const { restaurant, supabase } = await requireRestaurantUser();

  const { start, end } = getTodayIndiaRange();

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("id, total, order_status, payment_status")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", start)
    .lte("created_at", end);

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "pending");

  const { count: activeTables } = await supabase
    .from("restaurant_tables")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true);

  const totalOrders = todayOrders?.length ?? 0;

  const todayRevenue =
    todayOrders
      ?.filter((order) => order.order_status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total ?? 0), 0) ?? 0;

  const stats = [
    {
      label: "Today Orders",
      value: totalOrders,
      href: "/dashboard/orders",
      icon: ReceiptText,
      helper: "Orders received today",
    },
    {
      label: "Today Revenue",
      value: `₹${todayRevenue}`,
      href: "/dashboard/history",
      icon: IndianRupee,
      helper: "Excluding cancelled orders",
    },
    {
      label: "Pending Orders",
      value: pendingOrders ?? 0,
      href: "/dashboard/orders",
      icon: LayoutDashboard,
      helper: "Needs attention",
    },
    {
      label: "Active Tables",
      value: activeTables ?? 0,
      href: "/dashboard/tables",
      icon: Table2,
      helper: "Currently enabled",
    },
  ];

  const quickActions = [
    {
      title: "Live Orders",
      description: "View and manage pending, preparing, and ready orders.",
      href: "/dashboard/orders",
      icon: ReceiptText,
    },
    {
      title: "Menu",
      description: "Manage food items, pricing, availability, and categories.",
      href: "/dashboard/menu",
      icon: Utensils,
    },
    {
      title: "QR Tables",
      description: "Create table QR codes and manage active tables.",
      href: "/dashboard/tables",
      icon: QrCode,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--color-gold)]">
                Owner Dashboard
              </p>

              <h1 className="mt-2 font-heading text-4xl font-normal leading-none sm:text-5xl">
                Dashboard
              </h1>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                Overview for{" "}
                <span className="text-[var(--color-text)]">
                  {restaurant.name}
                </span>
              </p>
            </div>

            <Link
              href="/dashboard/orders"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-bg)] transition hover:brightness-110"
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-border-gold)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid size-10 place-items-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                    <Icon className="size-4" strokeWidth={1.8} />
                  </div>

                  <ArrowRight className="size-4 text-[var(--color-text-soft)] transition group-hover:translate-x-1 group-hover:text-[var(--color-gold)]" />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
                  {stat.label}
                </p>

                <p className="mt-2 font-heading text-4xl font-normal leading-none text-[var(--color-text)]">
                  {stat.value}
                </p>

                <p className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">
                  {stat.helper}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Quick Actions
              </p>
              <h2 className="mt-2 font-heading text-3xl font-normal">
                Manage Restaurant
              </h2>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-[24px] border border-[var(--color-border)] bg-black/25 p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-border-gold)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-11 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </div>

                    <ArrowRight className="size-4 text-[var(--color-text-soft)] transition group-hover:translate-x-1 group-hover:text-[var(--color-gold)]" />
                  </div>

                  <h3 className="mt-5 font-heading text-3xl font-normal">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}