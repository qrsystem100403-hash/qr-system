"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  Copy,
  CreditCard,
  Loader2,
  Phone,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Utensils,
  XCircle,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import {
  saveQROrder,
  extendQROrderFor24Hours,
} from "@/modules/qr-ordering/lib/qrOrderStorage";
import {
  WORKFLOWS,
} from "@/lib/orders/workflow"

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled";
type PaymentStatus = "pending" | "paid";

type Order = {
  id: string;
  table_name: string;

  subtotal: number;

  service_charge: number;
  service_charge_enabled: boolean;
  service_charge_type: "percentage" | "fixed";
  service_charge_value: number;

  gst_enabled: boolean;
  gst_mode: "exclusive" | "inclusive";
  gst_percent: number;
  gst_amount: number;

  round_off: number;

  total: number;

  order_status: OrderStatus;
  payment_status: PaymentStatus;
  cancel_reason: string | null;
  created_at: string;
};

type Props = {
  orderId?: string;
  trackingToken?: string;
  table: string;
  tableToken: string;
  restaurantId: string;
  restaurantPhone?: string | null;
  requiresReadyStage: boolean;
};

const statusContent: Record<
  OrderStatus,
  {
    title: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    title: "Order Received",
    description:
      "Your order has reached the restaurant. Staff will confirm it soon.",
    icon: CheckCircle2,
  },
  preparing: {
    title: "Food Is Being Prepared",
    description: "The kitchen has started preparing your order fresh.",
    icon: ChefHat,
  },
  ready: {
    title: "Order Is Ready",
    description: "Your food is ready and will be served shortly.",
    icon: Clock3,
  },
  served: {
    title: "Enjoy Your Meal",
    description:
      "Your order has been served. You can place another order anytime.",
    icon: Utensils,
  },
  cancelled: {
    title: "Order Cancelled",
    description: "This order was cancelled by the restaurant.",
    icon: XCircle,
  },
};



function formatOrderTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

export default function QRSuccessClient({
  orderId,
  trackingToken,
  table,
  tableToken,
  restaurantId,
  restaurantPhone,
  requiresReadyStage,
}: Props) {
 
  const workflow =
  requiresReadyStage
    ? WORKFLOWS.advanced
    : WORKFLOWS.simple;

const progressStatuses =
  workflow.statuses.filter(
    (status) =>
      status !== "cancelled"
  )

const progressLabels =
  workflow.labels as Record<
    string,
    string
    >

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const normalizedTrackingToken = trackingToken?.trim().toUpperCase();

  const fetchOrder = useCallback(async () => {
    if (!orderId || !normalizedTrackingToken) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
  orderId,
  trackingToken:
    normalizedTrackingToken,
  tableToken,
});

      const response = await fetch(
        `/api/qr/orders/status?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("ORDER STATUS FETCH ERROR:", data.error);
        setOrder(null);
        return;
      }

      const fetchedOrder = data.order as Order;

      setOrder(fetchedOrder);

      if (
        fetchedOrder.order_status === "served" ||
        fetchedOrder.order_status === "cancelled"
      ) {
        extendQROrderFor24Hours(fetchedOrder.id);
      }
    } catch (error) {
      console.error("ORDER STATUS FETCH ERROR:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [
  orderId,
  normalizedTrackingToken,
  tableToken,
]);

  useEffect(() => {
    if (
  !orderId ||
  !normalizedTrackingToken ||
  !tableToken ||
  !restaurantId
) return;

    saveQROrder({
  orderId,
  trackingToken: normalizedTrackingToken,

  table,
  tableToken,

  restaurantId,
});
  }, [
  orderId,
  normalizedTrackingToken,
  table,
  tableToken,
  restaurantId,
]);

  useEffect(() => {
    const timer = setTimeout(fetchOrder, 0);

    if (!orderId || !normalizedTrackingToken) {
      return () => clearTimeout(timer);
    }

    const channel = supabaseBrowser
      .channel(`customer-order-${restaurantId}-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        fetchOrder,
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabaseBrowser.removeChannel(channel);
    };
  }, [orderId, normalizedTrackingToken, restaurantId, fetchOrder]);

  const currentStatus = order?.order_status;

  const content = currentStatus
    ? statusContent[currentStatus]
    : {
        title: loading ? "Checking Order" : "Order Not Found",
        description: loading
          ? "Please wait while we fetch your live order status."
          : "We could not find this order. Please contact the restaurant staff.",
        icon: loading ? Loader2 : ReceiptText,
      };

  const Icon = content.icon;

  const activeIndex = useMemo(() => {
  if (!order || order.order_status === "cancelled") return -1;
  return progressStatuses.indexOf(order.order_status);
}, [order, progressStatuses]);

  const progressPercent = useMemo(() => {
  if (activeIndex < 0) return 0;
  return Math.min(100, (activeIndex / (progressStatuses.length - 1)) * 100);
}, [activeIndex, progressStatuses]);

  const isCancelled = currentStatus === "cancelled";

  const copyTrackingId = async () => {
    if (!normalizedTrackingToken) return;

    try {
      await navigator.clipboard.writeText(normalizedTrackingToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 pb-10 pt-4 sm:px-4">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/qr/table/${tableToken}`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)]"
        >
          <ArrowLeft className="size-4" />
          Menu
        </Link>

        <div className="rounded-full border border-[var(--color-border-gold)]/65 bg-[var(--color-gold)]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-gold)] sm:text-xs">
          Table {table}
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.014))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,var(--color-gold)/0.13,transparent_62%)]" />
          <div className="relative">
            <div
              className={`mx-auto grid size-16 place-items-center rounded-[26px] border ${
                isCancelled
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              } shadow-[0_18px_45px_rgba(0,0,0,0.22)]`}
            >
              <Icon className={`size-8 ${loading ? "animate-spin" : ""}`} />
            </div>

            <div className="mt-5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Live Order Tracking
              </p>

              <h1 className="mx-auto mt-3 max-w-2xl font-heading text-4xl font-normal leading-none tracking-[-0.04em] sm:text-5xl">
                {content.title}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
                {content.description}
              </p>
            </div>

            {order && !isCancelled && (
              <div className="mt-6 overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                      Current Status
                    </p>
                    <p className="mt-1 text-xl font-black text-[var(--color-gold)]">
                      {progressLabels[order.order_status]}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--color-border-gold)]/25 bg-[var(--color-gold)]/10 px-3 py-2 text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      Total
                    </p>
                    <p className="text-lg font-black text-[var(--color-gold)]">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                <div className="grid items-center gap-5 sm:grid-cols-[210px_1fr]">
                  <div className="relative mx-auto size-[190px] sm:size-[210px]">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--color-gold)/0.13,transparent_62%)] blur-xl" />

                    <svg
                      viewBox="0 0 120 120"
                      className="relative size-full -rotate-90 drop-shadow-[0_0_18px_rgba(214,182,76,0.16)]"
                      aria-hidden="true"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="7"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="url(#orderProgressGradient)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 48}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 48 -
                          (2 * Math.PI * 48 * progressPercent) / 100
                        }`}
                        className="transition-all duration-700"
                      />
                      <defs>
                        <linearGradient
                          id="orderProgressGradient"
                          x1="0"
                          y1="0"
                          x2="120"
                          y2="120"
                        >
                          <stop stopColor="var(--color-gold-muted)" />
                          <stop offset="0.45" stopColor="var(--color-gold-soft)" />
                          <stop offset="1" stopColor="var(--color-gold)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-[22px] grid place-items-center rounded-full border border-[var(--color-border-gold)]/18 bg-black/50 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_45px_rgba(0,0,0,0.22)]">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                          Status
                        </p>
                        <p className="mt-1 text-lg font-black leading-tight text-[var(--color-gold)]">
                          {progressLabels[order.order_status]}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--color-text-soft)]">
                          {activeIndex + 1} of {progressStatuses.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {progressStatuses.map((status, index) => {
                      const active = status === order.order_status;
                      const completed = index < activeIndex;

                      return (
                        <div
                          key={status}
                          className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-500 ${
                            active
                              ? "border-[var(--color-border-gold)]/45 bg-[var(--color-gold)]/10"
                              : completed
                                ? "border-white/[0.07] bg-white/[0.018]"
                                : "border-white/[0.06] bg-black/18"
                          }`}
                        >
                          <div
                            className={`grid size-8 shrink-0 place-items-center rounded-full ${
                              active
                                ? "bg-[var(--color-gold)] text-[var(--color-bg)] shadow-[0_10px_24px_rgba(214,182,76,0.18)]"
                                : completed
                                  ? "bg-green-400/10 text-green-300"
                                  : "bg-white/[0.04] text-[var(--color-text-soft)]"
                            }`}
                          >
                            {completed ? (
                              <CheckCircle2 className="size-4" />
                            ) : active ? (
                              <Icon className="size-4" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-current" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs font-black uppercase tracking-[0.14em] ${
                                active
                                  ? "text-[var(--color-gold)]"
                                  : completed
                                    ? "text-[var(--color-text-muted)]"
                                    : "text-[var(--color-text-muted)]"
                              }`}
                            >
                              {progressLabels[status]}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[var(--color-text-soft)]">
                              {active
                                ? "Current kitchen status"
                                : completed
                                  ? "Completed"
                                  : "Waiting"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {normalizedTrackingToken && (
              <div className="mt-4 rounded-[24px] border border-white/[0.07] bg-black/18 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--color-gold)]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      Tracking ID
                    </p>

                    <p className="mt-1 break-all text-xs font-semibold text-[var(--color-text)]">
                      {normalizedTrackingToken}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyTrackingId}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[var(--color-border-gold)]/60 bg-[var(--color-gold)]/10 px-3 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/15"
                  >
                    {copied ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <p className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">
                  Save this ID. If your order is delayed or status is not
                  updating, share this ID with restaurant staff so they can
                  check the issue.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[30px] border border-[var(--color-border-gold)]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.26)] sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                <ReceiptText className="size-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold)]">
                  Order Details
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Bill, payment and help
                </p>
              </div>
            </div>

            {!order ? (
              <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/18 p-4 text-sm leading-6 text-[var(--color-text-muted)]">
                {loading
                  ? "Fetching latest order status..."
                  : !orderId || !normalizedTrackingToken
                    ? "Missing order tracking details."
                    : "No order details available."}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {order.order_status === "cancelled" && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
                    <div className="flex items-center gap-2 text-red-200">
                      <XCircle className="size-5" />
                      <p className="font-black">Cancelled</p>
                    </div>

                    <p className="mt-2 text-sm leading-5 text-red-200/75">
                      {order.cancel_reason?.trim() || "No reason provided."}
                    </p>
                  </div>
                )}

                <div className="rounded-[22px] border border-white/[0.07] bg-black/18 p-4">
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold)]">
    Bill Summary
  </p>

  <div className="mt-4 space-y-3">

    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-text-muted)]">
        Subtotal
      </span>

      <span className="font-bold">
        ₹{order.subtotal}
      </span>
    </div>

    {order.service_charge_enabled && (
      <div className="flex justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">
          Service Charge
          {order.service_charge_type === "percentage"
            ? ` (${order.service_charge_value}%)`
            : ""}
        </span>

        <span className="font-bold">
          ₹{order.service_charge}
        </span>
      </div>
    )}

    {order.gst_enabled && (
      <div className="flex justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">
          GST ({order.gst_percent}%)
          {order.gst_mode === "inclusive"
            ? " (Included)"
            : ""}
        </span>

        <span className="font-bold">
          ₹{order.gst_amount}
        </span>
      </div>
    )}

    {Math.abs(order.round_off) >= 0.01 && (
      <div className="flex justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">
          Round Off
        </span>

        <span className="font-bold">
          {order.round_off > 0 ? "+" : ""}
          ₹{order.round_off}
        </span>
      </div>
    )}

    <div className="border-t border-[var(--color-border)] pt-3">
      <div className="flex justify-between">
        <span className="text-lg font-black">
          Total
        </span>

        <span className="text-2xl font-black text-[var(--color-gold)]">
          ₹{order.total}
        </span>
      </div>
    </div>

    <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between text-sm">
      <span className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
        <CreditCard className="size-4" />
        Payment
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
          order.payment_status === "paid"
            ? "bg-green-500/10 text-green-300"
            : "bg-yellow-500/10 text-yellow-200"
        }`}
      >
        {order.payment_status}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-text-muted)]">
        Placed
      </span>

      <span className="font-bold">
        {formatOrderTime(order.created_at)}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-text-muted)]">
        Table
      </span>

      <span className="font-bold">
        {order.table_name || table}
      </span>
    </div>

  </div>
</div>

                <div className="rounded-[22px] border border-white/[0.07] bg-black/18 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    Need Help?
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
                    If your order is delayed or status is not updating, call the
                    restaurant and share your Tracking ID.
                  </p>

                  {restaurantPhone ? (
                    <a
                      href={`tel:${restaurantPhone}`}
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)]"
                    >
                      <Phone className="size-4" />
                      Call Restaurant
                    </a>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-white/[0.07] bg-black/18 p-3 text-xs leading-5 text-[var(--color-text-muted)]">
                      Restaurant phone is not connected yet. Ask staff for help
                      and share your Tracking ID.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-2">
              <Link
                href={`/qr/table/${tableToken}/orders`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-gold)]/60 bg-[var(--color-gold)]/10 px-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/15"
              >
                <ReceiptText className="size-4" />
                View My Orders
              </Link>
              <Link
                href={`/qr/table/${tableToken}`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-black/15 px-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)]"
              >
                <RotateCcw className="size-4" />
                Back to Menu
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}