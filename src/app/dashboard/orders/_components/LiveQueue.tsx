import { ClipboardList } from "lucide-react";
import OrderCard from "./OrderCard";
import type {
  Order,
  StatusTabValue,
} from "./order-types";
import { getCapabilities } from "@/lib/auth/capabilities";

type Props = {
  orders: Order[];
  selectedOrderId?: string;
  activeStatus: StatusTabValue;
  searchQuery: string;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
};




export default function LiveQueue
(
  
  {
  orders,
  selectedOrderId,
  activeStatus,
  searchQuery,
  requiresReadyStage,
  capabilities
}: Props) 
{
  if (!orders.length) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="max-w-sm text-center">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[var(--color-primary-soft)]
            "
          >
            <ClipboardList
  className="
    size-8
    text-[var(--color-primary)]
  "
/>
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[var(--color-heading)]">
            You're all caught up
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            New customer orders will automatically
            appear here.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
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
    <div>
      <h2 className="text-lg font-semibold text-[var(--color-heading)]">
        Live Orders
      </h2>

      <p className="text-sm text-[var(--color-text-muted)]">
        {orders.length} active order{orders.length !== 1 ? "s" : ""}
      </p>
    </div>
  </div>

  <div className="flex-1 overflow-y-auto">
    <div className="space-y-4 p-5">
        {orders.map((order) => (
          <OrderCard
  key={order.id}
  order={order}
  selected={selectedOrderId === order.id}
  activeStatus={activeStatus}
  searchQuery={searchQuery}
 requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
/>
        ))}
      </div>
    </div>
    </div>

  );
}