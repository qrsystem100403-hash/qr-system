import Link from "next/link";
import type { Order } from "@/app/dashboard/orders/_components/order-types";
import OrderWorkflowActions from "@/app/components/orders/OrderWorkflowAction";

import { getCapabilities } from "@/lib/auth/capabilities";

type Props = {
  order: Order;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
};

export default function KitchenOrderCard({
  order,
  requiresReadyStage,
  capabilities,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-bg)]
        p-5
        shadow-sm
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {order.order_type === "dine_in"
              ? order.table_name
              : order.order_type}
          </p>

          <h3 className="mt-1 text-lg font-bold">
            #{order.tracking_token}
          </h3>
        </div>

        <span
          className="
            rounded-full
            bg-[var(--color-primary-soft)]
            px-3
            py-1
            text-xs
            font-semibold
          "
        >
          {new Date(
            order.created_at,
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Items */}

      <div className="mt-5 space-y-3">
        {order.order_items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between"
          >
            <div>
              <div className="font-medium">
                {item.qty} × {item.item_name}
              </div>

              {item.variant_name && (
                <div className="text-sm text-[var(--color-text-muted)]">
                  {item.variant_name}
                </div>
              )}

              {item.order_item_addons
                ?.length > 0 && (
                <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {item.order_item_addons
                    .map(
                      (addon) =>
                        addon.addon_name,
                    )
                    .join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Customer note */}

      {order.customer_note && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-amber-300
            bg-amber-50
            p-3
            text-sm
          "
        >
          <strong>Note:</strong>{" "}
          {order.customer_note}
        </div>
      )}

      {/* Action */}

      <div className="mt-6">
        <OrderWorkflowActions
  order={order}
  requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
/>
      </div>

      {/* Details */}

      <Link
        href={`/dashboard/orders?selected=${order.id}`}
        className="
          mt-3
          block
          text-center
          text-sm
          font-medium
          text-[var(--color-primary)]
        "
      >
        View Full Details
      </Link>
    </div>
  );
}