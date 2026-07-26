"use client";

import { useState } from "react";

import type { Order } from "../../../_components/order-types"

import MobileHistoryHeader from "./MobileHistoryHeader";
import MobileHistoryCard from "./MobileHistoryCard";
import MobileHistoryInspectorSheet from "./MobileHistoryInspectorSheet";
import EmptyHistory from "./EmptyHistory";

type HistoryTab =
  | "all"
  | "served"
  | "cancelled";

type Props = {
  orders: Order[];
  activeStatus: HistoryTab;
  searchQuery: string;
  counts: Record<HistoryTab, number>;
};

export default function MobileHistoryView({
  orders,
  activeStatus,
  searchQuery,
  counts,
}: Props) {
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  if (!orders.length) {
    return <EmptyHistory />;
  }

  return (
    <>
      <MobileHistoryHeader
        activeStatus={activeStatus}
        searchQuery={searchQuery}
        counts={counts}
      />

      <div
        className="
          flex
          flex-col
          gap-4
          pt-5
          pb-24
        "
      >
        {orders.map((order) => (
          <MobileHistoryCard
            key={order.id}
            order={order}
            onClick={() =>
              setSelectedOrder(order)
            }
          />
        ))}
      </div>

      <MobileHistoryInspectorSheet
        open={!!selectedOrder}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      />
    </>
  );
}