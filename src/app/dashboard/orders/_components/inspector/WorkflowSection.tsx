import OrderStatusAction from "../OrderStatusAction";
import type { Order } from "../order-types";
import { getCapabilities } from "@/lib/auth/capabilities";
import { getWorkflowActions } from "@/lib/orders/workflow-actions";

type Props = {
  order: Order;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
};

export default function WorkflowSection({
  order,
  requiresReadyStage,
  capabilities,
}: Props) {
  if (
    order.order_status === "served" ||
    order.order_status === "cancelled"
  ) {
    return null;
  }

  const actions = getWorkflowActions({
  order,
  capabilities,
  requiresReadyStage,
});


  return (
    <div
      className="
        border-t
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
      "
    >
      <div
  className={`grid gap-3 ${
    actions.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : "grid-cols-2"
  }`}
>
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
      </div>
    </div>
  );
}