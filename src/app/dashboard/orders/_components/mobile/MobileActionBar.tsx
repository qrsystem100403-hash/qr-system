"use client";

import type { Order } from "../order-types";
import OrderStatusAction from "../OrderStatusAction";

import { getCapabilities } from "@/lib/auth/capabilities";

type Props = {
  order: Order;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
  onSuccess?: () => void;
};

export default function MobileActionBar({
  order,
  requiresReadyStage,
  capabilities,
  onSuccess,
}: Props) {
  return (
    <div
      className="
        sticky
        -bottom-5
        left-0
        right-0
        border-t
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-4
        w-full
        
      "
    >
      <div className="space-y-3">

        {/* Pending */}

        {order.order_status === "pending" && (
          <>
            <OrderStatusAction
              orderId={order.id}
              currentStatus={order.order_status}
              nextStatus="preparing"
              label="Start Preparing"
              variant="orange"
              icon="chef"
              capabilities={capabilities}
              onSuccess={onSuccess}
              
            />

            <OrderStatusAction
              orderId={order.id}
              currentStatus={order.order_status}
              nextStatus="cancelled"
              label="Cancel Order"
              variant="danger"
              icon="cancel"
              capabilities={capabilities}
              onSuccess={onSuccess}
              
            />
          </>
        )}

        {/* Preparing */}

        {order.order_status === "preparing" &&
          (requiresReadyStage ? (
            <>
              <OrderStatusAction
                orderId={order.id}
                currentStatus={order.order_status}
                nextStatus="ready"
                label="Mark Ready"
                variant="green"
                icon="ready"
                capabilities={capabilities}
                onSuccess={onSuccess}
              />

              <OrderStatusAction
                orderId={order.id}
                currentStatus={order.order_status}
                nextStatus="cancelled"
                label="Cancel Order"
                variant="danger"
                icon="cancel"
                capabilities={capabilities}
                onSuccess={onSuccess}
              />
            </>
          ) : (
            <>
              <OrderStatusAction
                orderId={order.id}
                currentStatus={order.order_status}
                nextStatus="served"
                label="Complete Order"
                variant="green"
                icon="complete"
                capabilities={capabilities}
                onSuccess={onSuccess}
              />

              <OrderStatusAction
                orderId={order.id}
                currentStatus={order.order_status}
                nextStatus="cancelled"
                label="Cancel Order"
                variant="danger"
                icon="cancel"
                capabilities={capabilities}
                onSuccess={onSuccess}
              />
            </>
          ))}

        {/* Ready */}

        {order.order_status === "ready" && (
          <OrderStatusAction
            orderId={order.id}
            currentStatus={order.order_status}
            nextStatus="served"
            label="Mark as Served"
            variant="green"
            icon="complete"
            capabilities={capabilities}
          />
        )}

      </div>
    </div>
  );
}