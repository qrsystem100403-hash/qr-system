import type { SupabaseClient } from "@supabase/supabase-js";

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

export const dashboardService = {
  async getOverview(
    supabase: SupabaseClient,
    restaurantId: string,
  ) {
    const { start, end } = getTodayIndiaRange();

    const [
      todayOrdersResult,
      pendingOrdersResult,
      preparingOrdersResult,
      readyOrdersResult,
      activeTablesResult,
    ] = await Promise.all([
      supabase
        .from("orders")
        .select(
          "id,total,order_status,payment_status",
        )
        .eq("restaurant_id", restaurantId)
        .gte("created_at", start)
        .lte("created_at", end),

      supabase
        .from("orders")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("restaurant_id", restaurantId)
        .eq("order_status", "pending"),

      supabase
        .from("orders")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("restaurant_id", restaurantId)
        .eq("order_status", "preparing"),

      supabase
        .from("orders")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("restaurant_id", restaurantId)
        .eq("order_status", "ready"),

      supabase
        .from("restaurant_tables")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true),
    ]);

    const todayOrders =
      todayOrdersResult.data ?? [];

    const totalOrders =
      todayOrders.length;

    const todayRevenue =
      todayOrders
        .filter(
          (order) =>
            order.order_status !==
            "cancelled",
        )
        .reduce(
          (sum, order) =>
            sum +
            Number(order.total ?? 0),
          0,
        );

    const cancelledToday =
      todayOrders.filter(
        (order) =>
          order.order_status ===
          "cancelled",
      ).length;

    const servedToday =
  todayOrders.filter(
    (order) =>
      order.order_status ===
      "served",
  ).length;

    const activeOrders =
  todayOrders.filter(
    (order) =>
      order.order_status !== "served" &&
      order.order_status !== "cancelled",
  ).length;

return {
  todayOrders,
  totalOrders,
  todayRevenue,
  cancelledToday,
  servedToday,
  activeOrders,
  pendingOrders:
    pendingOrdersResult.count ?? 0,
  preparingOrders:
    preparingOrdersResult.count ?? 0,
  readyOrders:
    readyOrdersResult.count ?? 0,
  activeTables:
    activeTablesResult.count ?? 0,
};
  },
};