import type { Order } from "@/app/dashboard/orders/_components/order-types";
import KitchenOrderCard from "./KitchenOrderCard";
import KitchenEmptyState from "./KitchenEmptyState";

import { getCapabilities } from "@/lib/auth/capabilities";

type Props = {
  pending: Order[];
  preparing: Order[];
  ready: Order[];
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
};

function Column({
  title,
  orders,
  requiresReadyStage,
  capabilities,
}: {
  title: string;
  orders: Order[];
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
}){
  return (
    <div
      className="
        flex
        min-h-[70vh]
        flex-col
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
      "
    >
      <div
        className="
          sticky
          top-0
          z-10
          flex
          items-center
          justify-between
          border-b
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-5
          py-4
        "
      >
        <h2 className="font-bold">
          {title}
        </h2>

        <span
          className="
            rounded-full
            bg-[var(--color-primary-soft)]
            px-3
            py-1
            text-sm
            font-semibold
          "
        >
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {orders.length === 0 ? (
          <KitchenEmptyState />
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
  key={order.id}
  order={order}
  requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
/>
          ))
        )}
      </div>
    </div>
  );
}

export default function KitchenQueue({
  pending,
  preparing,
  ready,
  requiresReadyStage,
  capabilities,
}: Props) {
  return (
    <div
      className="
        grid
        gap-6
        xl:grid-cols-3
      "
    >
      <Column
  title="Pending"
  orders={pending}
  requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
/>

      <Column
        title="Preparing"
        orders={preparing}
        requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
      />

      {requiresReadyStage && (
        <Column
  title="Ready"
  orders={ready}
  requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
/>
      )}
    </div>
  );
}