"use client";

import TableCardHeader from "./TableCardHeader";
import TableCardQRCode from "./TableCardQRCode";
import TableCardActions from "./TableCardActions";

import type {
  RestaurantTable,
  TableStatus,
  TableWorkflowMode,
} from "../table-types";

type Props = {
  table: RestaurantTable;

  updating: boolean;

  qrUrl: string;

  qrPath: string;

  tableWorkflowMode: TableWorkflowMode;

  onCopy: () => void;

  onDownload: () => void;

  onRename: () => void;

  onToggle: () => void;

  onDelete: () => void;

  onStatusChange: (
    status: TableStatus
  ) => void;
};

export default function TableCard({
  table,
  updating,
  qrUrl,
  qrPath,
  tableWorkflowMode,
  onCopy,
  onDownload,
  onRename,
  onToggle,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <article
  className="
flex
flex-col
overflow-hidden
rounded-[var(--radius-xl)]
border
border-[var(--color-border)]
bg-[var(--color-surface)]
shadow-[var(--shadow-sm)]
transition-all
duration-300
hover:-translate-y-1
hover:border-[var(--color-primary-border)]
hover:shadow-[var(--shadow-lg)]
"
>
      <TableCardHeader
  table={table}
  onRename={onRename}
  onToggle={onToggle}
  onDelete={onDelete}
/>

      <TableCardQRCode
        tableId={table.id}
        qrUrl={qrUrl}
        qrPath={qrPath}
        onCopy={onCopy}
        onDownload={onDownload}
      />

      <TableCardActions
        table={table}
        updating={updating}
        tableWorkflowMode={tableWorkflowMode}
        onRename={onRename}
        onToggle={onToggle}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </article>
  );
}