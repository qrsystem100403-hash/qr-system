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

type InsightResult = {
  averageOrderValue: number;
  completionRate: number;
  cancelledToday: number;
  peakHour: string;
  bestSellingItem: {
  name: string;
  image: string | null;
  sold: number;
} | null;
};

export async function getBusinessInsights(
  supabase: SupabaseClient,
  restaurantId: string,
): Promise<InsightResult> {
  const { start, end } = getTodayIndiaRange();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      created_at,
      order_status,
      order_items (
  qty,
  item_name,
  menu_item_id
)
    `)
    .eq("restaurant_id", restaurantId)
    .gte("created_at", start)
    .lte("created_at", end);

  if (error || !orders) {
    return {
      averageOrderValue: 0,
      completionRate: 0,
      cancelledToday: 0,
      peakHour: "-",
      bestSellingItem: null,
    };
  }

  const completedOrders = orders.filter(
    (order) => order.order_status === "served",
  );

  const cancelledOrders = orders.filter(
    (order) => order.order_status === "cancelled",
  );

  const activeOrders = orders.filter(
    (order) => order.order_status !== "cancelled",
  );

    const averageOrderValue =
    activeOrders.length > 0
      ? Math.round(
          activeOrders.reduce(
            (sum, order) =>
              sum + Number(order.total ?? 0),
            0,
          ) / activeOrders.length,
        )
      : 0;

  const completionRate =
    orders.length > 0
      ? Math.round(
          (completedOrders.length /
            orders.length) *
            100,
        )
      : 0;

  const cancelledToday =
    cancelledOrders.length;

  // Peak Hour
  const hourlyOrders = new Map<
    number,
    number
  >();

  orders.forEach((order) => {
    const hour = new Date(
      order.created_at,
    ).getHours();

    hourlyOrders.set(
      hour,
      (hourlyOrders.get(hour) ?? 0) + 1,
    );
  });

  let peakHour = "-";
  let maxOrders = 0;

  hourlyOrders.forEach(
    (count, hour) => {
      if (count > maxOrders) {
        maxOrders = count;

        peakHour =
          new Date(
            0,
            0,
            0,
            hour,
          ).toLocaleTimeString("en-IN", {
            hour: "numeric",
            hour12: true,
          });
      }
    },
  );

  // Best Selling Item
  const itemTotals = new Map<
  string,
  {
    name: string;
    qty: number;
  }
>();

orders.forEach((order) => {
  order.order_items?.forEach((item: any) => {
    const existing = itemTotals.get(item.menu_item_id);

    if (existing) {
      existing.qty += item.qty;
    } else {
      itemTotals.set(item.menu_item_id, {
        name: item.item_name,
        qty: item.qty,
      });
    }
  });
});

let bestSellerId: string | null = null;
let highestQty = 0;

itemTotals.forEach((value, id) => {
  if (value.qty > highestQty) {
    highestQty = value.qty;
    bestSellerId = id;
  }
});

let bestSeller: {
  name: string;
  image: string | null;
  sold: number;
} | null = null;

if (bestSellerId) {
  const info = itemTotals.get(bestSellerId)!;

  const { data: menuItem } = await supabase
    .from("menu_items")
    .select("image")
    .eq("id", bestSellerId)
    .maybeSingle();

  bestSeller = {
    name: info.name,
    sold: info.qty,
    image: menuItem?.image ?? null,
  };
}

return {
  averageOrderValue,
  completionRate,
  cancelledToday,
  peakHour,
  bestSellingItem: bestSeller,
};
}

