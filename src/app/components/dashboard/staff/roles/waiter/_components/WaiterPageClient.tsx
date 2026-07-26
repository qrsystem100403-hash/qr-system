"use client";

import { useCallback, useMemo, useState } from "react";



import type { WaiterOrder } from "@/modules/waiter/type";

import WaiterStats from "./WaiterStats";
import ReadyOrderCard from "./ReadyOrderCard";
import EmptyReadyOrders from "./EmptyReadyOrders";

type Props = {
  restaurantId: string;
  initialOrders: WaiterOrder[];
};

export default function WaiterPageClient({
  restaurantId,
  initialOrders,
}: Props) {
  const [orders, setOrders] =
    useState(initialOrders);

  const loadOrders = useCallback(
    async () => {
      const response = await fetch(
        "/api/dashboard/waiter/orders"
      );

      const data =
        await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    },
    [],
  );


  const totalItems = useMemo(
    () =>
      orders.reduce(
        (sum, order) =>
          sum + order.itemCount,
        0,
      ),
    [orders],
  );

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-black">
          Ready Orders
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Orders waiting to be served.
        </p>

      </div>

      <WaiterStats
        readyOrders={orders.length}
        tablesWaiting={orders.length}
        totalItems={totalItems}
      />

      {orders.length === 0 ? (
        <EmptyReadyOrders />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order) => (
            <ReadyOrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}

    </div>
  );
}