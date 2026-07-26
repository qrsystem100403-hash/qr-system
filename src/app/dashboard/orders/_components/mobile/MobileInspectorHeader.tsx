"use client";

import {
  Clock3,
  Hash,
  Table2,
} from "lucide-react";

import type { Order } from "../order-types";

import StatusChip from "../shared/StatusChip";
import { formatRelativeTime } from "../order-utils";

type Props = {
  order: Order;
};

export default function MobileInspectorHeader({
  order,
}: Props) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
      "
    >
      <div className="flex items-start justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-soft)]
              "
            >
              <Table2
                className="
                  size-6
                  text-[var(--color-primary)]
                "
              />
            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-[var(--color-heading)]
                "
              >
                {order.table_name ?? "ONLINE"}
              </h2>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-2
                "
              >
                <StatusChip
                  status={order.order_status}
                />
              </div>

            </div>

          </div>

        </div>

        <div className="text-right">

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

      </div>

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-[var(--color-surface-soft)]
            px-4
            py-3
          "
        >
          <Hash className="size-4" />

          <span
            className="
              truncate
              text-sm
              font-semibold
            "
          >
            {order.tracking_token ??
              order.id.slice(0, 8)}
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-red-50
            px-4
            py-3
            text-red-600
          "
        >
          <Clock3 className="size-4" />

          <span className="font-bold">
            {formatRelativeTime(
              order.created_at
            )}
          </span>

        </div>

      </div>
    </section>
  );
}