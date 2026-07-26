"use client";

import {
  ArrowRight,
  Clock3,
  Package2,
  User,
} from "lucide-react";

import type { Order } from "../order-types";
import {
  formatRelativeTime,
  getItemCount,
} from "../order-utils";

import StatusChip from "../shared/StatusChip";
import PaymentChip from "../shared/PaymentChip";

type Props = {
  order: Order;
  onClick: () => void;
};

export default function MobileOrderCard({
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
        duration-200
        active:scale-[0.98]
      "
    >
      {/* Top */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h2
              className="
                truncate
                text-xl
                font-bold
                text-[var(--color-heading)]
              "
            >
              {order.table_name ?? "ONLINE"}
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
            #{order.tracking_token ?? order.id.slice(0, 8)}
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
        "
      >
        <User className="size-4 text-[var(--color-text-soft)]" />

        <span
          className="
            truncate
            font-medium
          "
        >
          {order.customer_name ||
            "Walk-in Customer"}
        </span>

      </div>

      {/* Metrics */}

      <div
        className="
          mt-5
          grid
          grid-cols-3
          gap-3
        "
      >

        <div
          className="
            rounded-2xl
            bg-[var(--color-surface-soft)]
            p-3
          "
        >
          <div className="flex items-center gap-2">

            <Package2 className="size-4 text-[var(--color-primary)]" />

            <span className="text-xs">
              Items
            </span>

          </div>

          <p className="mt-2 text-lg font-bold">
            {getItemCount(order)}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            bg-[var(--color-surface-soft)]
            p-3
          "
        >
          <div className="flex items-center gap-2">

            <Clock3 className="size-4 text-[var(--color-primary)]" />

            <span className="text-xs">
              Age
            </span>

          </div>

          <p className="mt-2 text-lg font-bold text-red-500">
            {formatRelativeTime(order.created_at)}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            bg-[var(--color-primary-soft)]
            p-3
          "
        >
          <div className="text-xs">
            Total
          </div>

          <p
            className="
              mt-2
              text-lg
              font-black
              text-[var(--color-primary)]
            "
          >
            ₹{Number(order.total).toFixed(0)}
          </p>

        </div>

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

        <PaymentChip
          status={order.payment_status}
        />

        <span
          className="
            text-sm
            font-semibold
            text-[var(--color-primary)]
          "
        >
          View Order
        </span>

      </div>

    </button>
  );
}