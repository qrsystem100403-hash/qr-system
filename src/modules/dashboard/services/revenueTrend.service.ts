import type { SupabaseClient } from "@supabase/supabase-js";

function getTodayIndiaRange() {
  const now = new Date();

  const indiaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const start = new Date(
    `${indiaDate}T00:00:00+05:30`,
  );

  const end = new Date(
    `${indiaDate}T23:59:59.999+05:30`,
  );

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function getYesterdayIndiaRange() {
  const now = new Date();

  now.setDate(now.getDate() - 1);

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

export async function getRevenueTrend(
  supabase: SupabaseClient,
  restaurantId: string,
) {
  const { start, end } =
    getTodayIndiaRange();

  const { data } = await supabase
    .from("orders")
    .select(
      "created_at,total,order_status",
    )
    .eq("restaurant_id", restaurantId)
    .neq("order_status", "cancelled")
    .gte("created_at", start)
    .lte("created_at", end);


    const {
  start: yesterdayStart,
  end: yesterdayEnd,
} = getYesterdayIndiaRange();

const {
  data: yesterdayOrders,
} = await supabase
  .from("orders")
  .select("total,order_status")
  .eq("restaurant_id", restaurantId)
  .neq("order_status", "cancelled")
  .gte("created_at", yesterdayStart)
  .lte("created_at", yesterdayEnd);

  const hourlyRevenue = new Array(24)
    .fill(0)
    .map((_, hour) => ({
      hour,
      revenue: 0,
    }));

  (data ?? []).forEach((order) => {
    const hour = new Date(
      order.created_at,
    ).getHours();

    hourlyRevenue[hour].revenue += Number(
      order.total ?? 0,
    );
  });


  
 const activeHours = hourlyRevenue.filter(
  (item) => item.revenue > 0,
);

const todayRevenue = (data ?? []).reduce(
  (sum, order) => sum + Number(order.total ?? 0),
  0,
);

const yesterdayRevenue = (yesterdayOrders ?? []).reduce(
  (sum, order) => sum + Number(order.total ?? 0),
  0,
);

const revenueChange =
  yesterdayRevenue > 0
    ? ((todayRevenue - yesterdayRevenue) /
        yesterdayRevenue) *
      100
    : 0;

    const averageOrderValue =
  (data ?? []).length > 0
    ? Math.round(
        todayRevenue / (data ?? []).length,
      )
    : 0;

if (activeHours.length === 0) {
  return {
  data: [],
  todayRevenue: 0,
  yesterdayRevenue: 0,
  revenueChange: 0,
  averageOrderValue: 0,
};
}

const firstHour = activeHours[0].hour;
const lastHour =
  activeHours[activeHours.length - 1].hour;

return {
  data: hourlyRevenue
    .filter(
      (item) =>
        item.hour >= 9 &&
        item.hour <= 23,
    )
    .map((item) => ({
      hour: new Date(
        0,
        0,
        0,
        item.hour,
      ).toLocaleTimeString("en-IN", {
        hour: "numeric",
        hour12: true,
      }),
      revenue: item.revenue,
    })),

  todayRevenue,
  yesterdayRevenue,
  revenueChange,
  averageOrderValue,
};
}

