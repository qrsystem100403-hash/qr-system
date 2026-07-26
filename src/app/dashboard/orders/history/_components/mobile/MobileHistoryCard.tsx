"use client";

import {
  ArrowRight,
  Calendar,
  User,
} from "lucide-react";

import type { Order } from "../../../_components/order-types"

import {
  formatOrderTime,
  shortOrderId,
} from "../../../_components/order-utils";

import StatusChip from "../../../_components/shared/StatusChip";
import PaymentChip from "../../../_components/shared/PaymentChip";

type Props = {
  order: Order;
  onClick: () => void;
};

export default function MobileHistoryCard({
  order,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
        text-left
        shadow-[var(--shadow-sm)]
        transition-all
        active:scale-[0.98]
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h2
              className="
                truncate
                text-xl
                font-black
                text-[var(--color-heading)]
              "
            >
              {order.table_name || "ONLINE"}
            </h2>

            <StatusChip
              status={order.order_status}
            />

          </div>

          <p
            className="
              mt-1
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            #{shortOrderId(order)}
          </p>

        </div>

        <ArrowRight
          className="
            size-5
            text-[var(--color-text-soft)]
          "
        />

      </div>

      {/* Customer */}

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          text-sm
          text-[var(--color-text-muted)]
        "
      >
        <User className="size-4" />

        <span className="truncate">
          {order.customer_name ||
            "Walk-in Customer"}
        </span>

      </div>

      {/* Time & Amount */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          <Calendar className="size-4" />

          <span>
            {formatOrderTime(
              order.created_at
            )}
          </span>

        </div>

        <p
          className="
            text-2xl
            font-black
            text-[var(--color-primary)]
          "
        >
          ₹{Number(order.total).toFixed(0)}
        </p>

      </div>

      {/* Footer */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-[var(--color-border)]
          pt-4
        "
      >

        <span
          className="
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          {order.order_items.length} item
          {order.order_items.length > 1
            ? "s"
            : ""}
        </span>

        <PaymentChip
          status={order.payment_status}
        />

      </div>

      {/* Cancel Reason Preview */}

      {order.order_status ===
        "cancelled" &&
        order.cancel_reason && (
        <div
          className="
            mt-4
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-3
            dark:border-red-900/40
            dark:bg-red-950/20
          "
        >
          <p
            className="
              line-clamp-2
              text-sm
              text-red-600
              dark:text-red-300
            "
          >
            {order.cancel_reason}
          </p>
        </div>
      )}

    </button>
  );
}