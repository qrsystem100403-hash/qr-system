"use client";

import OrderStatusAction from "@/app/dashboard/orders/_components/OrderStatusAction";
import type { Order } from "@/app/dashboard/orders/_components/order-types";

import { getCapabilities } from "@/lib/auth/capabilities";
import { getWorkflowActions } from "@/lib/orders/workflow-actions";

type Props = {
  order: Order;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
};

export default function OrderWorkflowActions({
  order,
  requiresReadyStage,
  capabilities,
}: Props) {
  const actions = getWorkflowActions({
  order,
  capabilities,
  requiresReadyStage,
});

if (!actions.length) {
  return null;
}

return (
  <>
    {actions.map((action) => (
      <OrderStatusAction
        key={`${action.nextStatus}-${action.label}`}
        orderId={order.id}
        currentStatus={order.order_status}
        capabilities={capabilities}
        nextStatus={action.nextStatus}
        label={action.label}
        variant={action.variant}
        icon={action.icon}
      />
    ))}
  </>
);
}