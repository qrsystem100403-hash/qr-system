"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  ReceiptText,
  XCircle,
} from "lucide-react";

import type {
  SessionOrder,
  SessionOrderStatus,
} from "@/modules/qr-ordering/types/session";

type Props = {
  order: SessionOrder;
  tableToken: string;
  orderNumber: number;
};

const statusLabel: Record<SessionOrderStatus, string> = {
  pending: "Received",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  cancelled: "Cancelled",
};

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export default function SessionOrderCard({
  order,
  tableToken,
  orderNumber,
}: Props) {
  const cancelled = order.order_status === "cancelled";

  const served = order.order_status === "served";

  return (
    <article className="rounded-[26px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Order
          </p>

          <div className="space-y-1">
            <h3 className="text-2xl font-black">Order #{orderNumber}</h3>

            <p className="text-sm text-[var(--color-text-muted)]">
              Tracking ID:
              <span className="ml-2 font-semibold text-[var(--color-gold)]">
                {order.tracking_token}
              </span>
            </p>
          </div>

          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {formatTime(order.created_at)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            cancelled
              ? "bg-red-500/10 text-red-300"
              : served
                ? "bg-green-500/10 text-green-300"
                : "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
          }`}
        >
          {statusLabel[order.order_status]}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {order.order_items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/[0.06] bg-black/15 p-4"
          >
            <div className="flex justify-between gap-3">
              <div>
                <h4 className="font-bold">{item.item_name}</h4>

                {item.variant_name && (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {item.variant_name}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="font-bold">× {item.qty}</p>

                <p className="text-sm text-[var(--color-gold)]">
                  ₹{item.item_price}
                </p>
              </div>
            </div>

            {item.order_item_addons.length > 0 && (
              <div className="mt-3 border-t border-white/5 pt-3">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  Add-ons
                </p>

                <div className="space-y-1">
                  {item.order_item_addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex justify-between text-sm"
                    >
                      <span>{addon.addon_name}</span>

                      <span>₹{addon.addon_price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {cancelled && order.cancel_reason && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
          {order.cancel_reason}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Total
          </p>

          <p className="mt-2 text-xl font-black text-[var(--color-gold)]">
            ₹{order.total}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Payment
          </p>

          <div className="mt-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[var(--color-gold)]" />

            <span className="font-semibold capitalize">
              {order.payment_status}
            </span>
          </div>
        </div>

        <Link
          href={`/qr/table/${tableToken}/success?orderId=${order.id}&trackingToken=${order.tracking_token}`}
          className="flex items-center justify-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 font-bold text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/20"
        >
          <ReceiptText className="mr-2 h-4 w-4" />
          View Details
        </Link>
      </div>
    </article>
  );
}
