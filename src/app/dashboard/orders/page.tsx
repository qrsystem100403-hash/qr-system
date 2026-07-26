import { Inbox } from "lucide-react";

import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

import OrderRealtime from "./OrderRealtime";
import StatusRail from "./_components/StatusRail";
import LiveQueue from "./_components/LiveQueue";
import OrderInspector from "./_components/inspector/OrderInspector";
import OrdersHeader from "./_components/OrdersHeader";

import { getWorkflowConfig } from "@/lib/orders/workflow-config";

import { can } from "@/lib/auth/can";
import { forbidden } from "next/navigation";

import { orderService } from "@/modules/orders/services/order.service";

import { getCapabilities } from "@/lib/auth/capabilities";

import type {
  StatusTabValue,
} from "./_components/order-types";

import MobileOrdersView from "./_components/mobile/MobileOrdersView";

type Props = {
  searchParams?: Promise<{
    status?: StatusTabValue;
    selected?: string;
    q?: string;
  }>;
};

function isValidStatus(
  value: unknown
): value is StatusTabValue {
  return (
    value === "pending" ||
    value === "preparing" ||
    value === "ready" ||
    value === "served" ||
    value === "cancelled" ||
    value === "all"
  );
}

export default async function OrdersPage({
  searchParams,
}: Props) {
 const {
  restaurant,
  role,
  features,
} = await requireRestaurantUser();

const capabilities =
  getCapabilities(
    role,
    features,
  );

  const workflowConfig =
  getWorkflowConfig(features);

    if (!can(role, "orders")) {
  forbidden();
}


  const params = await searchParams;

  const activeStatus: StatusTabValue =
    isValidStatus(params?.status)
      ? params.status
      : "pending";

  const selectedId = params?.selected;

  const searchQuery =
    params?.q?.trim() ?? "";

 

  

 
const {
  orders,
  selectedOrder,
  counts,
  revenue,
} =
  await orderService.getDashboardData(
    restaurant.id,
    activeStatus,
    searchQuery,
    selectedId,
  );
 
const activeOrders =
  counts.pending +
  counts.preparing +
  counts.ready;

 
  return (
    <>
  <OrdersHeader />

  <OrderRealtime
    restaurantId={restaurant.id}
  />

  {/* Mobile & Tablet */}

  <div className="lg:hidden">
    <MobileOrdersView
      orders={orders}
      activeStatus={activeStatus}
      searchQuery={searchQuery}
      counts={counts}
      requiresReadyStage={workflowConfig.requiresReadyStage}
      capabilities={capabilities}
    />
  </div>

  {/* Desktop */}

  <section
    className="
      hidden
      lg:grid
      lg:h-[calc(100vh-135px)]
      lg:grid-cols-[320px_minmax(0,1fr)_440px]
      lg:gap-5
    "
  >
    {/* Sidebar */}

    <aside
      className="
        sticky
        top-2
        h-fit
      "
    >
      <StatusRail
        activeStatus={activeStatus}
        searchQuery={searchQuery}
        counts={counts}
        activeOrders={activeOrders}
        newOrders={counts.pending}
        revenue={revenue}
        requiresReadyStage={
          workflowConfig.requiresReadyStage
        }
      />
    </aside>

    {/* Queue */}

    <main
      className="
        min-w-0
        overflow-hidden
        rounded-[var(--radius-xl)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        shadow-[var(--shadow-sm)]
      "
    >
      <LiveQueue
        orders={orders}
        selectedOrderId={selectedOrder?.id}
        activeStatus={activeStatus}
        searchQuery={searchQuery}
        requiresReadyStage={
          workflowConfig.requiresReadyStage
        }
        capabilities={capabilities}
      />
    </main>

    {/* Inspector */}

    <aside
      className="
        sticky
        top-24
        h-[calc(100vh-135px)]
      "
    >
      {selectedOrder ? (
        <div
          className="
            h-full
            overflow-hidden
            rounded-[var(--radius-xl)]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            shadow-[var(--shadow-sm)]
          "
        >
          <OrderInspector
            order={selectedOrder}
            requiresReadyStage={
              workflowConfig.requiresReadyStage
            }
            capabilities={capabilities}
          />
        </div>
      ) : (
        <div
          className="
            flex
            h-full
            flex-col
            items-center
            justify-center
            rounded-[var(--radius-xl)]
            border
            border-dashed
            border-[var(--color-border)]
            bg-[var(--color-surface)]
          "
        >
          <Inbox className="size-12 text-[var(--color-text-soft)]" />

          <h3
            className="
              mt-5
              text-xl
              font-semibold
              text-[var(--color-heading)]
            "
          >
            No Order Selected
          </h3>

          <p
            className="
              mt-2
              max-w-xs
              text-center
              text-sm
              leading-6
              text-[var(--color-text-muted)]
            "
          >
            Select an order from the queue to inspect
            customer details, ordered items and workflow
            actions.
          </p>
        </div>
      )}
    </aside>
  </section>
</>
  );
}