"use client";

import TableCard from "../card/TableCard";

import type {
  RestaurantTable,
  TableStatus,
  TableWorkflowMode,
} from "../table-types";

type Props = {
  tables: RestaurantTable[];

  updatingTableId: string | null;

  tableWorkflowMode: TableWorkflowMode;

  getQRUrl: (
    token: string
  ) => string;

  getQRPath: (
    token: string
  ) => string;

  onCopy: (
    table: RestaurantTable
  ) => void;

  onDownload: (
    table: RestaurantTable
  ) => void;

  onRename: (
    table: RestaurantTable
  ) => void;

  onToggle: (
    table: RestaurantTable
  ) => void;

  onDelete: (
    table: RestaurantTable
  ) => void;

  onStatusChange: (
    tableId: string,
    status: TableStatus
  ) => void;
};

export default function TablesGrid({
  tables,
  updatingTableId,
  tableWorkflowMode,
  getQRUrl,
  getQRPath,
  onCopy,
  onDownload,
  onRename,
  onToggle,
  onDelete,
  onStatusChange,
}: Props) {
  if (!tables.length) {
    return (
      <div
        className="
          flex
          items-center
          justify-center
          rounded-[var(--radius-xl)]
          border
          border-dashed
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          py-24
        "
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-heading)]">
            No Tables
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Create your first table to start
            generating QR menus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
  className="
    grid
    items-start
    gap-5
    md:grid-cols-2
    2xl:grid-cols-3
  "
>
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          updating={
            updatingTableId === table.id
          }
          tableWorkflowMode={
            tableWorkflowMode
          }
          qrUrl={getQRUrl(table.qr_token)}
          qrPath={getQRPath(table.qr_token)}
          onCopy={() => onCopy(table)}
          onDownload={() =>
            onDownload(table)
          }
          onRename={() =>
            onRename(table)
          }
          onToggle={() =>
            onToggle(table)
          }
          onDelete={() =>
            onDelete(table)
          }
          onStatusChange={(
            status
          ) =>
            onStatusChange(
              table.id,
              status
            )
          }
        />
      ))}
    </div>
  );
}