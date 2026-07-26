import type { RestaurantFeatures } from "@/lib/auth/capabilities";

export type WorkflowConfig = {
  requiresReadyStage: boolean;
  kitchenHandledByKitchen: boolean;
  servedHandledByWaiter: boolean;
  paymentHandledByCashier: boolean;
};

export function getWorkflowConfig(
  features: RestaurantFeatures,
): WorkflowConfig {
  return {
    requiresReadyStage:
      features.kitchen_display_enabled ||
      features.waiter_dashboard_enabled,

    kitchenHandledByKitchen:
      features.kitchen_display_enabled,

    servedHandledByWaiter:
      features.waiter_dashboard_enabled,

    paymentHandledByCashier:
      features.cashier_dashboard_enabled,
  };
}