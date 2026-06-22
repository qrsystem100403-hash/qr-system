"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  Loader2,
  Phone,
  ReceiptText,
  RotateCcw,
  Trash2,
  XCircle,
  Droplets,
  Utensils,
  BadgeHelp,
  UserRound,
  MessageSquareMore,
} from "lucide-react";

import {
  extendQROrderFor24Hours,
  getStoredQROrders,
  removeQROrder,
  type StoredQROrder,
} from "@/modules/qr-ordering/lib/qrOrderStorage";

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled";
type PaymentStatus = "pending" | "paid";

type LiveOrder = {
  id: string;
  table_name: string;
  total: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  cancel_reason: string | null;
  created_at: string;
};

type OrderWithLive = StoredQROrder & {
  liveOrder?: LiveOrder | null;
  loading?: boolean;
  error?: string;
};

type Props = {
  table: string;
  tableToken: string;
  restaurantPhone?: string | null;
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "Received",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  cancelled: "Cancelled",
};

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

export default function QRMyOrdersClient({
  table,
  tableToken,
  restaurantPhone,
}: Props) {
  const [orders, setOrders] = useState<OrderWithLive[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [requestingBillId, setRequestingBillId] = useState<string | null>(null);
  const [billRequestedIds, setBillRequestedIds] = useState<string[]>([]);
  const [requestingRequestKey, setRequestingRequestKey] = useState<
    string | null
  >(null);

  const [requestedTypes, setRequestedTypes] = useState<
    Record<string, string[]>
  >({});

  const [otherRequestOrderId, setOtherRequestOrderId] = useState<string | null>(
    null,
  );

  const [otherMessage, setOtherMessage] = useState("");

  const fetchLiveOrder = useCallback(async (storedOrder: StoredQROrder) => {
    try {
      const params = new URLSearchParams({
  orderId: storedOrder.orderId,
  trackingToken:
    storedOrder.trackingToken,
  tableToken:
    storedOrder.tableToken,
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
        return {
          ...storedOrder,
          liveOrder: null,
          loading: false,
          error: data.error || "Failed to fetch order",
        };
      }

      const liveOrder = data.order as LiveOrder;

      if (
        liveOrder.order_status === "served" ||
        liveOrder.order_status === "cancelled"
      ) {
        extendQROrderFor24Hours(liveOrder.id);
      }

      return {
        ...storedOrder,
        liveOrder,
        loading: false,
        error: "",
      };
    } catch {
      return {
        ...storedOrder,
        liveOrder: null,
        loading: false,
        error: "Failed to fetch order",
      };
    }
  }, []);

  const loadOrders = useCallback(async () => {
    const storedOrders =
  getStoredQROrders().filter(
    (order) =>
      order.tableToken ===
      tableToken
  );

    setOrders(storedOrders.map((order) => ({ ...order, loading: true })));

    const liveOrders = await Promise.all(storedOrders.map(fetchLiveOrder));

    setOrders(liveOrders);
  }, [fetchLiveOrder, tableToken]);

  useEffect(() => {
    loadOrders();

    const interval = window.setInterval(loadOrders, 15000);

    return () => window.clearInterval(interval);
  }, [loadOrders]);

  const copyTrackingId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  const deleteOrder = (orderId: string) => {
    removeQROrder(orderId);
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  };

  const requestBill = async (orderId: string, trackingToken: string) => {
    try {
      setRequestingBillId(orderId);

      const response = await fetch("/api/qr/request-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          trackingToken,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log(data);

        alert(data.error || "Failed to request bill");
        return;
      }

      setBillRequestedIds((prev) =>
        prev.includes(orderId) ? prev : [...prev, orderId],
      );
    } catch {
      alert("Failed to request bill");
    } finally {
      setRequestingBillId(null);
    }
  };

  const requestWaiter = async (
    orderId: string,
    trackingToken: string,
    requestType: string,
  ) => {
    const requestKey = `${orderId}-${requestType}`;
    try {
      setRequestingRequestKey(requestKey);

      const response = await fetch("/api/qr/request-waiter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          trackingToken,
          requestType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to request assistance");
      }

      setRequestedTypes((prev) => ({
        ...prev,
        [orderId]: [...(prev[orderId] || []), requestType],
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to request assistance");
    } finally {
      setRequestingRequestKey(null);
    }
  };

  const sendOtherRequest = async () => {
    if (!otherRequestOrderId) return;

    const order = orders.find((o) => o.orderId === otherRequestOrderId);

    if (!order) return;

    if (!otherMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const response = await fetch("/api/qr/request-waiter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.orderId,
          trackingToken: order.trackingToken,
          requestType: "other",
          customMessage: otherMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send request");
      }

      setRequestedTypes((prev) => ({
        ...prev,
        [order.orderId]: [...(prev[order.orderId] || []), "other"],
      }));

      setOtherRequestOrderId(null);
      setOtherMessage("");
    } catch (error) {
      console.error(error);
      alert("Failed to send request");
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

      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.014))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,var(--color-gold)/0.12,transparent_62%)]" />
        <div className="relative flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[var(--color-border-gold)]/25 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
            <ReceiptText className="size-5" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
              My Orders
            </p>

            <h1 className="mt-2 font-heading text-4xl font-normal leading-none tracking-[-0.04em] sm:text-5xl">
              Your live orders
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              Orders placed from this device will appear here with live updates.
            </p>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="mt-5 rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-7 text-center shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          <ReceiptText className="mx-auto size-8 text-[var(--color-gold)]" />

          <h2 className="mt-3 text-xl font-black">No orders found</h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
            Place an order from this table and it will show here automatically.
          </p>

          <Link
            href={`/qr/table/${tableToken}`}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)] shadow-[0_16px_36px_rgba(214,182,76,0.16)] transition hover:brightness-110"
          >
            <RotateCcw className="size-4" />
            Back to Menu
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {orders.map((order) => {
            const live = order.liveOrder;
            const isServed = live?.order_status === "served";
            const isCancelled = live?.order_status === "cancelled";
            const isFinished = isServed || isCancelled;

            return (
              <article
                key={order.orderId}
                className="rounded-[24px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.012))] p-3.5 shadow-[0_14px_45px_rgba(0,0,0,0.18)] transition hover:border-[var(--color-border-gold)]/30 sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      Tracking ID
                    </p>

                    <p className="mt-1 break-all text-xs font-semibold text-[var(--color-text)]">
                      {order.orderId}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyTrackingId(order.orderId)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-[var(--color-border-gold)]/55 bg-[var(--color-gold)]/10 px-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/15"
                  >
                    {copiedId === order.orderId ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copiedId === order.orderId ? "Copied" : "Copy"}
                  </button>
                </div>

                {order.loading ? (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-black/18 p-3 text-sm text-[var(--color-text-muted)]">
                    <Loader2 className="size-4 animate-spin" />
                    Fetching latest status...
                  </div>
                ) : order.error ? (
                  <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                    {order.error}
                  </div>
                ) : live ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/18 px-3 py-2.5">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
                        {isCancelled ? (
                          <XCircle className="size-4 text-red-300" />
                        ) : isServed ? (
                          <CheckCircle2 className="size-4 text-green-300" />
                        ) : (
                          <Clock3 className="size-4" />
                        )}
                        Status
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          isCancelled
                            ? "bg-red-500/10 text-red-200"
                            : isServed
                              ? "bg-green-500/10 text-green-300"
                              : "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                        }`}
                      >
                        {statusLabel[live.order_status]}
                      </span>
                    </div>

                    {isCancelled && (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm leading-5 text-red-200/80">
                        {live.cancel_reason?.trim() ||
                          "No cancellation reason provided."}
                      </div>
                    )}

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/[0.07] bg-black/18 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                          Total
                        </p>
                        <p className="mt-1 text-xl font-black text-[var(--color-gold)]">
                          ₹{live.total}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.07] bg-black/18 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                          Payment
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-black capitalize">
                          <CreditCard className="size-4 text-[var(--color-gold)]" />
                          {live.payment_status}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.07] bg-black/18 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                          Placed
                        </p>
                        <p className="mt-1 text-sm font-black">
                          {formatTime(live.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <Link
                        href={`/qr/table/${tableToken}/success?orderId=${encodeURIComponent(
                          order.orderId,
                        )}&trackingToken=${encodeURIComponent(
                          order.trackingToken,
                        )}`}
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--color-border-gold)]/60 bg-[var(--color-gold)]/10 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/15"
                      >
                        View Details
                      </Link>

                      {restaurantPhone ? (
                        <a
                          href={`tel:${restaurantPhone}`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-bg)] shadow-[0_14px_30px_rgba(214,182,76,0.14)] transition hover:brightness-110"
                        >
                          <Phone className="size-4" />
                          Call
                        </a>
                      ) : (
                        <div className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/[0.07] bg-black/18 px-4 text-center text-[11px] font-bold leading-4 text-[var(--color-text-muted)]">
                          Ask staff for help
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={
                          requestingBillId === order.orderId ||
                          billRequestedIds.includes(order.orderId) ||
                          isCancelled
                        }
                        onClick={() =>
                          requestBill(order.orderId, order.trackingToken)
                        }
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-yellow-500/25 bg-yellow-500/10 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-yellow-300 transition disabled:opacity-50"
                      >
                        {requestingBillId === order.orderId
                          ? "Requesting..."
                          : billRequestedIds.includes(order.orderId)
                            ? "Bill Requested"
                            : "Request Bill"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteOrder(order.orderId)}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-2xl border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                          isFinished
                            ? "border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                            : "border-white/[0.07] bg-black/15 text-[var(--color-text-muted)] hover:border-red-500/20 hover:text-red-200"
                        }`}
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 rounded-[24px] border border-white/[0.07] bg-black/18 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-gold)]">
                        Need Assistance?
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {[
                          {
                            label: "Water",
                            value: "water",
                            icon: Droplets,
                          },
                          {
                            label: "Spoon",
                            value: "spoon",
                            icon: Utensils,
                          },
                          {
                            label: "Fork",
                            value: "fork",
                            icon: Utensils,
                          },
                          {
                            label: "Tissue",
                            value: "tissue",
                            icon: BadgeHelp,
                          },
                          {
                            label: "Waiter",
                            value: "waiter",
                            icon: UserRound,
                          },
                          {
                            label: "Other",
                            value: "other",
                            icon: MessageSquareMore,
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.value}
                              type="button"
                              disabled={
                                requestingRequestKey ===
                                  `${order.orderId}-${item.value}` ||
                                requestedTypes[order.orderId]?.includes(
                                  item.value,
                                )
                              }
                              onClick={() => {
                                if (item.value === "other") {
                                  setOtherRequestOrderId(order.orderId);

                                  return;
                                }

                                requestWaiter(
                                  order.orderId,
                                  order.trackingToken,
                                  item.value,
                                );
                              }}
                              className="flex h-16 flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] transition hover:border-[var(--color-border-gold)] disabled:opacity-50"
                            >
                              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-gold)]/10">
                                <Icon className="h-4 w-4 text-[var(--color-gold)]" />
                              </div>

                              <span className="text-xs font-black">
                                {requestingRequestKey ===
                                `${order.orderId}-${item.value}`
                                  ? "Sending..."
                                  : requestedTypes[order.orderId]?.includes(
                                        item.value,
                                      )
                                    ? "Requested"
                                    : item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
      {otherRequestOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#121212] p-5 shadow-2xl">
            <h3 className="text-lg font-black">Other Request</h3>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Tell us what you need.
            </p>

            <textarea
              value={otherMessage}
              onChange={(e) => setOtherMessage(e.target.value)}
              maxLength={150}
              rows={4}
              placeholder="Example: Need baby chair"
              className="mt-4 w-full rounded-2xl border border-white/[0.08] bg-black/20 p-3 outline-none"
            />

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setOtherRequestOrderId(null);
                  setOtherMessage("");
                }}
                className="flex-1 rounded-2xl border border-white/[0.08] py-3"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={sendOtherRequest}
                className="flex-1 rounded-2xl bg-[var(--color-gold)] py-3 font-bold text-black"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
