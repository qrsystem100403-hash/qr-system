"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { buildHistoryHref } from "../../history-utils";

type HistoryTab =
  | "all"
  | "served"
  | "cancelled";

type Props = {
  activeStatus: HistoryTab;
  searchQuery: string;
  counts: Record<HistoryTab, number>;
};

const tabs: {
  value: HistoryTab;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "served",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export default function MobileHistoryHeader({
  activeStatus,
  searchQuery,
  counts,
}: Props) {
  return (
    <div
      className="
        sticky
        top-3
        z-20
        -mx-5
        border-b
        border-[var(--color-border)]
        bg-[var(--color-bg)]
        px-5
        pb-4
      "
    >
      <h1
        className="
          mb-4
          text-2xl
          font-black
          text-[var(--color-heading)]
        "
      >
        Order History
      </h1>

      {/* Search */}

      <form>
        <div
          className="
            flex
            h-12
            items-center
            gap-3
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-4
          "
        >
          <Search className="size-4 text-[var(--color-text-soft)]" />

          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search orders..."
            className="
              h-full
              flex-1
              bg-transparent
              outline-none
              text-sm
            "
          />
        </div>
      </form>

      {/* Tabs */}

      <div
        className="
          mt-4
          flex
          gap-2
          overflow-x-auto
          pb-1
        "
      >
        {tabs.map((tab) => {
          const active =
            activeStatus === tab.value;

          return (
            <Link
              key={tab.value}
              href={buildHistoryHref({
                status: tab.value,
                q: searchQuery,
              })}
              className={`
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                transition-all

                ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)]"
                }
              `}
            >
              <span>{tab.label}</span>

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-xs
                  ${
                    active
                      ? "bg-white/20"
                      : "bg-[var(--color-surface-soft)]"
                  }
                `}
              >
                {counts[tab.value]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}