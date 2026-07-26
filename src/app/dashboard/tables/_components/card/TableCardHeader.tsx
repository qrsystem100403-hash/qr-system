"use client";

import { Table2, XCircle } from "lucide-react";

import DashboardBadge from "@/app/components/dashboard/ui/DashboardBadge";

import TableStatusChip from "../shared/TableStatusChip";
import TableCardMenu from "./TableCardMenu";

import type { RestaurantTable } from "../table-types";

type Props = {
  table: RestaurantTable;
  onRename: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TableCardHeader({
  table,
  onRename,
  onToggle,
  onDelete,
}: Props) {
  return (
    <div
      className="
        border-b
        border-[var(--color-border)]
        px-6
        py-5
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        {/* Left */}
        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <Table2 className="size-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className="
                truncate
                text-[26px]
                font-bold
                leading-none
                tracking-tight
                text-[var(--color-heading)]
              "
            >
              {table.name}
            </h2>

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <TableStatusChip status={table.status} />

              {!table.is_active && (
                <DashboardBadge variant="danger">
                  <XCircle className="size-3.5" />
                  Disabled
                </DashboardBadge>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <TableCardMenu
          table={table}
          onRename={onRename}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}