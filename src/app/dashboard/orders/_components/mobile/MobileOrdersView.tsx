"use client";

import { useState } from "react";

import type {
  Order,
  StatusTabValue,
} from "../order-types";

import { getCapabilities } from "@/lib/auth/capabilities";

import MobileOrderCard from "./MobileOrderCard";
import MobileInspectorSheet from "./MobileInspectorSheet";
import EmptyMobileOrders from "./EmptyMobileOrders";
import MobileOrdersHeader from "./MobileOrdersHeader";

type Props = {
  orders: Order[];
  activeStatus: StatusTabValue;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
  searchQuery: string;
counts: Record<StatusTabValue, number>;
};

export default function MobileOrdersView({
  orders,
  activeStatus,
  requiresReadyStage,
  capabilities,
  searchQuery,
counts,
}: Props) {
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  if (!orders.length) {
    return <EmptyMobileOrders/>
  }

  return (
    <>

<MobileOrdersHeader
  activeStatus={activeStatus}
  searchQuery={searchQuery}
  counts={counts}
  requiresReadyStage={requiresReadyStage}
/>
      <div
        className="
          flex
          flex-col
          gap-4
          pb-24
        "
      >

        {orders.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
            onClick={() =>
              setSelectedOrder(order)
            }
          />
        ))}
      </div>

      <MobileInspectorSheet
        open={!!selectedOrder}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
        requiresReadyStage={requiresReadyStage}
        capabilities={capabilities}
      />
    </>
  );
}