"use client";

import {
  UtensilsCrossed,
  BellRing,
  Table2,
  CheckCircle2,
  Package2,
} from "lucide-react";

type Props = {
  readyOrders: number;
  tablesWaiting: number;
  totalItems: number;
};

export default function WaiterStats({
  readyOrders,
  tablesWaiting,
  totalItems,
}: Props) {
  const stats = [
  {
    title: "Ready Orders",
    value: readyOrders,
    icon: UtensilsCrossed,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Tables Waiting",
    value: tablesWaiting,
    icon: Table2,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Items Waiting",
    value: totalItems,
    icon: Package2,
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-6
              shadow-[var(--shadow-sm)]
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-tight text-[var(--color-heading)]">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  ${stat.color}
                `}
              >
                <Icon className="h-7 w-7" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}