import type { Order } from "@/app/dashboard/orders/_components/order-types";
import { getCapabilities } from "@/lib/auth/capabilities";

export type WorkflowAction = {
  nextStatus:
    | "preparing"
    | "ready"
    | "served"
    | "cancelled";
  label: string;
  variant:
    | "green"
    | "orange"
    | "danger"
    | "outline";
  icon:
    | "chef"
    | "ready"
    | "complete"
    | "cancel";
};

type Params = {
  order: Order;
  capabilities: ReturnType<typeof getCapabilities>;
  requiresReadyStage: boolean;
};

export function getWorkflowActions({
  order,
  capabilities,
  requiresReadyStage,
}: Params): WorkflowAction[] {
  const actions: WorkflowAction[] = [];

  if (
    order.order_status === "served" ||
    order.order_status === "cancelled"
  ) {
    return actions;
  }

  switch (order.order_status) {
    case "pending":
      if (capabilities.canAcceptOrders) {
  actions.push({
    nextStatus: "preparing",
    label: "Accept",
    variant: "green",
    icon: "chef",
  });
}

      if (capabilities.canCancelPendingOrder) {
  actions.push({
    nextStatus: "cancelled",
    label: "Cancel",
    variant: "danger",
    icon: "cancel",
  });
}
      break;

    case "preparing":
      if (capabilities.canMarkReady) {
  if (requiresReadyStage) {
  actions.push({
    nextStatus: "ready",
    label: "Mark Ready",
    variant: "orange",
    icon: "ready",
  });
} else {
  actions.push({
    nextStatus: "served",
    label: "Complete",
    variant: "green",
    icon: "complete",
  });
}
}

      if (capabilities.canCancelPreparedOrder) {
  actions.push({
    nextStatus: "cancelled",
    label: "Cancel",
    variant: "danger",
    icon: "cancel",
  });
}
      break;

    case "ready":
      if (
  requiresReadyStage &&
  capabilities.canServeOrders
) {
        actions.push({
          nextStatus: "served",
          label: "Serve Order",
          variant: "green",
          icon: "complete",
        });
      }

      break;
  }

  return actions;
}