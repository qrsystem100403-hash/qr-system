"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import {
  buildOrdersHref,
} from "../order-utils";

import type {
  StatusTabValue,
} from "../order-types";

type Props = {
  activeStatus: StatusTabValue;
  searchQuery: string;
  counts: Record<StatusTabValue, number>;
  requiresReadyStage: boolean;
};

export default function MobileOrdersHeader({
  activeStatus,
  searchQuery,
  counts,
  requiresReadyStage,
}: Props) {

  const tabs = requiresReadyStage
    ? [
        "pending",
        "preparing",
        "ready",
        "all",
      ]
    : [
        "pending",
        "preparing",
        "all",
      ];

  return (
    <div
      className="
        sticky
        top-5
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
        "
      >
        Orders
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
          <Search className="size-4" />

          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search order..."
            className="
              h-full
              flex-1
              bg-transparent
              outline-none
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
            activeStatus === tab;

          return (
            <Link
              key={tab}
              href={buildOrdersHref({
                status: tab as StatusTabValue,
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

                ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)]"
                }
              `}
            >
              <span className="capitalize">
                {tab}
              </span>

              <span
                className="
                  rounded-full
                  bg-black/10
                  px-2
                  py-0.5
                  text-xs
                "
              >
                {counts[
                  tab as StatusTabValue
                ]}
              </span>

            </Link>
          );

        })}

      </div>

    </div>
  );
}