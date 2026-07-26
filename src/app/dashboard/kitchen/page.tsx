import { forbidden } from "next/navigation";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { can } from "@/lib/auth/can";
import { orderService } from "@/modules/orders/services/order.service";

import { getCapabilities } from "@/lib/auth/capabilities";
import { getWorkflowConfig } from "@/lib/orders/workflow-config";


import KitchenHeader from "./_components/KitchenHeader";
import KitchenQueue from "./_components/KitchenQueue";
import OrdersRealtime from "../orders/OrderRealtime";

export default async function KitchenPage() {
  const {
    restaurant,
    role,
    features,
  } = await requireRestaurantUser();

  const capabilities = getCapabilities(
  role,
  features,
);

const workflowConfig =
  getWorkflowConfig(features);

  if (!can(role, "orders")) {
    forbidden();
  }

  if (
    !features.kitchen_display_enabled &&
    role === "kitchen"
  ) {
    forbidden();
  }

  const data =
    await orderService.getKitchenDashboardData(
      restaurant.id,
    );

  return (
    <>
      

      <div className="space-y-6">
        <KitchenHeader />

        <KitchenQueue
  pending={data.pending}
  preparing={data.preparing}
  ready={data.ready}
  capabilities={capabilities}
  requiresReadyStage={
    workflowConfig.requiresReadyStage
  }
/>
      </div>
    </>
  );
}