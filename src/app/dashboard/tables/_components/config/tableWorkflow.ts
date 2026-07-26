import type {
  TableStatus,
  TableWorkflowMode,
} from "../table-types";

export type TableAction = {
  label: string;
  status: TableStatus;
};

export function getTableActions(
  workflow: TableWorkflowMode,
  currentStatus: TableStatus
): TableAction[] {
  switch (workflow) {
    case "simple":
      // Everything is automatic
      return [];

    case "advanced":
      switch (currentStatus) {
        case "available":
          return [
            {
              label: "Mark Occupied",
              status: "occupied",
            },
          ];

        case "occupied":
          return [
            {
              label: "Mark Available",
              status: "available",
            },
          ];

        case "bill_requested":
          return [
            {
              label: "Mark Available",
              status: "available",
            },
          ];

        default:
          return [];
      }

    case "expert": {
  const actions: TableAction[] = [
    {
      label: "Available",
      status: "available",
    },
    {
      label: "Occupied",
      status: "occupied",
    },
    {
      label: "Bill Requested",
      status: "bill_requested",
    },
  ];

  return actions.filter(
    (action) => action.status !== currentStatus
  );
}

    default:
      return [];
  }
}