import {
  CheckCircle2,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import {
  getTableActions,
} from "../config/tableWorkflow";

import type {
  RestaurantTable,
  TableStatus,
  TableWorkflowMode,
} from "../table-types";

type Props = {
  table: RestaurantTable;

  updating: boolean;

  tableWorkflowMode: TableWorkflowMode;

  onRename: () => void;

  onToggle: () => void;

  onDelete: () => void;

  onStatusChange: (
    status: TableStatus
  ) => void;
};

export default function TableCardActions({
  table,
  updating,
  tableWorkflowMode,
  onRename,
  onToggle,
  onDelete,
  onStatusChange,
}: Props) {
  const workflowActions =
    getTableActions(
      tableWorkflowMode,
      table.status
    );

    if (workflowActions.length === 0) {
  return null;
}


  return (
    <div
      className="
        border-t
        border-[var(--color-border)]
        px-5
pt-4
pb-4
      "
    >
      {/* Workflow Actions */}

      {workflowActions.length > 0 && (
        <div className="grid gap-2">
          {workflowActions.map(
            (action) => (
              <button
                key={action.status}
                onClick={() =>
                  onStatusChange(
                    action.status
                  )
                }
                disabled={updating}
                className="
inline-flex
h-11
items-center
justify-center
rounded-xl
border
border-[var(--color-border)]
bg-[var(--color-surface-soft)]
text-sm
font-semibold
transition-all
duration-200
hover:-translate-y-0.5
hover:border-[var(--color-primary-border)]
hover:bg-[var(--color-primary-soft)]
hover:text-[var(--color-primary)]
active:translate-y-0
disabled:pointer-events-none
disabled:opacity-50
"
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}



    </div>
  );
}