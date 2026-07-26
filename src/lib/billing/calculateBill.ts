import { supabaseAdmin } from "@/lib/supabase/admin";

type BillResult = {
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  serviceChargeType: "percentage" | "fixed";
  serviceChargeValue: number;
  serviceChargeAmount: number;
  roundOff: number;
  grandTotal: number;
  snapshot: {
  subtotal: number;

  gst: {
    enabled: boolean;
    mode: "exclusive" | "inclusive";
    percent: number;
    amount: number;
  };

  serviceCharge: {
    enabled: boolean;
    type: "percentage" | "fixed";
    value: number;
    amount: number;
  };

  roundOff: {
    enabled: boolean;
    amount: number;
  };

  grandTotal: number;
};
};

export async function calculateBill(
  restaurantId: string,
  sessionId: string,
): Promise<BillResult> {
  // Load restaurant billing settings
  const { data: settings, error: settingsError } =
    await supabaseAdmin
      .from("restaurant_billing_settings")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .single();

  if (settingsError || !settings) {
    throw new Error("Billing settings not found.");
  }

  // Load all non-cancelled orders
  const { data: orders, error: ordersError } =
    await supabaseAdmin
      .from("orders")
      .select(`
  subtotal,
  gst_amount,
  service_charge,
  round_off,
  total,
  order_status
`)
      .eq("session_id", sessionId);

  if (ordersError) {
    throw new Error("Unable to load session orders.");
  }

  const activeOrders = (orders ?? []).filter(
  (order) => order.order_status !== "cancelled"
);

const subtotal = Number(
  activeOrders
    .reduce(
      (sum, order) => sum + Number(order.subtotal ?? 0),
      0
    )
    .toFixed(2)
);

const gstAmount = Number(
  activeOrders
    .reduce(
      (sum, order) => sum + Number(order.gst_amount ?? 0),
      0
    )
    .toFixed(2)
);

const serviceChargeAmount = Number(
  activeOrders
    .reduce(
      (sum, order) => sum + Number(order.service_charge ?? 0),
      0
    )
    .toFixed(2)
);

const roundOff = Number(
  activeOrders
    .reduce(
      (sum, order) => sum + Number(order.round_off ?? 0),
      0
    )
    .toFixed(2)
);

const grandTotal = Number(
  activeOrders
    .reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0
    )
    .toFixed(2)
);

const gstPercent = settings.gst_enabled
  ? Number(settings.gst_percent)
  : 0;

const serviceChargeType =
  settings.service_charge_type === "fixed"
    ? "fixed"
    : "percentage";

const serviceChargeValue = Number(
  settings.service_charge_value ?? 0
);

  

  return {
    subtotal,

    gstPercent,

    gstAmount,

    serviceChargeType,

    serviceChargeValue,

    serviceChargeAmount,

    roundOff,

    grandTotal,

    snapshot: {
  subtotal,

  gst: {
    enabled: settings.gst_enabled,
    mode: settings.gst_mode,
    percent: gstPercent,
    amount: gstAmount,
  },

  serviceCharge: {
    enabled:
      settings.service_charge_enabled,
    type: serviceChargeType,
    value: serviceChargeValue,
    amount: serviceChargeAmount,
  },

  roundOff: {
    enabled:
      settings.round_off_enabled,
    amount: roundOff,
  },

  grandTotal,
},
  };
}