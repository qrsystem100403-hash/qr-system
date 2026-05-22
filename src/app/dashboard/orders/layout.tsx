import { IndianRupee, ReceiptText, Store, XCircle } from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import LogoutButton from "../LogoutButton";
import OrdersTabs from "./OrdersTabs";

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { restaurant, supabase } = await requireRestaurantUser();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: activeCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .not("order_status", "in", "(served,cancelled)");

  const { count: historyCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "served");

  const { count: cancelledCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "cancelled");

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total")
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "served")
    .gte("created_at", todayStart.toISOString());

  const todayRevenue =
    todayOrders?.reduce((sum, order) => sum + Number(order.total), 0) ?? 0;

  const stats = [
    {
      label: "Active",
      value: activeCount ?? 0,
      icon: ReceiptText,
    },
    {
      label: "Served",
      value: historyCount ?? 0,
      icon: Store,
    },
    {
      label: "Cancelled",
      value: cancelledCount ?? 0,
      icon: XCircle,
    },
    {
      label: "Revenue",
      value: `₹${todayRevenue}`,
      icon: IndianRupee,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/65 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Order Control
              </p>

              <h1 className="mt-1 font-heading text-3xl font-normal leading-none sm:text-4xl">
                Orders
              </h1>

              <p className="mt-2 truncate text-sm text-[var(--color-text-muted)]">
                {restaurant.name}
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-[20px] border border-[var(--color-border)] bg-black/25 p-3 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      {stat.label}
                    </p>

                    <Icon className="size-4 shrink-0 text-[var(--color-gold)]" />
                  </div>

                  <p className="mt-2 truncate font-heading text-2xl font-normal leading-none sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <OrdersTabs
            activeCount={activeCount ?? 0}
            historyCount={historyCount ?? 0}
            cancelledCount={cancelledCount ?? 0}
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}