"use client";

import {
  ReceiptText,
  BellRing,
  IndianRupee,
} from "lucide-react";
import type { SessionListItem } from "@/modules/sessions/types";

type Props = {
  sessions: SessionListItem[];
};

export default function SessionStats({
  sessions,
}: Props) {
  const activeCount = sessions.length;

  const billRequestedCount =
    sessions.filter(
      (session) =>
        session.status ===
        "bill_requested",
    ).length;

  const runningRevenue =
    sessions.reduce(
      (sum, session) =>
        sum +
        Number(session.grand_total ?? 0),
      0,
    );

  const cards = [
    {
      title: "Active Sessions",
      value: activeCount,
      icon: ReceiptText,
      color:
        "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Bill Requests",
      value: billRequestedCount,
      icon: BellRing,
      color:
        "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Running Revenue",
      value: `₹${runningRevenue.toFixed(
        2,
      )}`,
      icon: IndianRupee,
      color:
        "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              rounded-xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-4
            "
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`h-5 w-5 ${card.color}`}
              />

              <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {card.title}
                </p>

                <p className="mt-1 text-xl font-semibold text-[var(--color-heading)]">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}