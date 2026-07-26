import { SupabaseClient } from "@supabase/supabase-js";

export async function getReceiptData(
  supabase: SupabaseClient,
  restaurantId: string,
  sessionId: string,
) {
  const { data: session, error } = await supabase
    .from("table_sessions")
    .select(`
      *,
      restaurant_tables(
        id,
        name
      )
    `)
    .eq("id", sessionId)
    .eq("restaurant_id", restaurantId)
    .single();

  if (error) {
    throw error;
  }

  if (!session) {
    throw new Error("Session not found");
  }


  const { data: orders, error: ordersError } = await supabase
  .from("orders")
  .select(`
    *,
    order_items(
      *,
      order_item_addons(*)
    )
  `)
  .eq("session_id", session.id)
  .order("created_at", {
    ascending: true,
  });

if (ordersError) {
  throw ordersError;
}

const {
  data: restaurant,
  error: restaurantError,
} = await supabase
  .from("restaurants")
  .select(`
    id,
    name,
    logo,
    phone,
    address,
    tagline,
    gst_number,
    fssai_number
  `)
  .eq("id", restaurantId)
  .single();

if (restaurantError) {
  throw restaurantError;
}

if (!restaurant) {
  throw new Error("Restaurant not found");
}

const items = (orders ?? []).flatMap((order: any) =>
  (order.order_items ?? []).map((item: any) => ({
    id: item.id,

    name: item.item_name ?? "Unknown Item",

    qty: item.qty,

    unitPrice: Number(item.item_price ?? 0),

    totalPrice:
      Number(item.item_price ?? 0) *
      Number(item.qty ?? 0),

    variant: item.variant_name ?? undefined,

    addons: (item.order_item_addons ?? []).map(
      (addon: any) => ({
        id: addon.id,
        name: addon.addon_name,
        price: Number(addon.addon_price ?? 0),
      }),
    ),

    note: order.customer_note ?? undefined,
  })),
);

const receiptRestaurant = {
  name: restaurant.name,

  logo: restaurant.logo,

  phone: restaurant.phone ?? "",

  address: restaurant.address ?? "",

  tagline: restaurant.tagline ?? "",

  gstNumber: restaurant.gst_number ?? "",

  fssaiNumber: restaurant.fssai_number ?? "",

  branding: "logo_name" as const,
};

const receiptTotals = {
  subtotal: Number(session.subtotal ?? 0),

  gstAmount: Number(session.gst_amount ?? 0),

  serviceChargeAmount: Number(
    session.service_charge_amount ?? 0,
  ),

  roundOff: Number(session.round_off ?? 0),

  grandTotal: Number(session.grand_total ?? 0),
};

const snapshot =
  (session.billing_snapshot as any) ?? {};

const receiptSettings = {
  gstEnabled:
    snapshot.gst?.enabled ?? false,

  gstMode:
    snapshot.gst?.mode ?? "exclusive",

  gstPercent:
    Number(snapshot.gst?.percent ?? 0),

  serviceChargeEnabled:
    snapshot.serviceCharge?.enabled ?? false,

  serviceChargeType:
    snapshot.serviceCharge?.type ??
    "percentage",

  serviceChargeValue:
    Number(
      snapshot.serviceCharge?.value ?? 0,
    ),

  roundOffEnabled:
    snapshot.roundOff?.enabled ?? false,
};

const billDate =
  session.bill_requested_at ??
  session.completed_at ??
  session.started_at;

const receiptBill = {
  number: session.id.slice(0, 8).toUpperCase(),

  table: session.restaurant_tables?.name ?? "-",

  cashier: "Cashier",

  date: new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(billDate)),

  time: new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(billDate)),
};

return {
  session,
  restaurant,
  receiptRestaurant,
  receiptSettings,
  receiptTotals,
  receiptBill,
  orders: orders ?? [],
  items,
};
  
}