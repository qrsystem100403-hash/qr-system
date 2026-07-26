"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  Table2,
  Users,
} from "lucide-react";

import TablesGrid from "./_components/layout/TablesGrid";

import { useDashboardHeader } from "@/app/components/dashboard/header/DashboardHeaderProvider";

import type {
  RestaurantTable,
  TableWorkflowMode,
} from "./_components/table-types";
import DashboardPageHeader from "@/app/components/dashboard/ui/DashboardPageHeader";
import DashboardStats from "@/app/components/dashboard/ui/DashboardStats";
import DashboardToolbar from "@/app/components/dashboard/ui/DashboardToolbar";
import DashboardSearch from "@/app/components/dashboard/ui/DashboardSearch";
import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";
import CreateTableDialog from "./_components/shared/CreateTableDialog";
import DashboardSelect from "@/app/components/dashboard/ui/DashboardSelect";
import DashboardBadge from "@/app/components/dashboard/ui/DashboardBadge";
import DashboardFilterTabs from "@/app/components/dashboard/ui/DashboardFilterTabs";



export default function TablesPage() {
 const [tables, setTables] =
  useState<RestaurantTable[]>([]);

const [statusFilter, setStatusFilter] =
  useState("all");

const [loading, setLoading] =
  useState(true);

const [saving, setSaving] =
  useState(false);

const [createDialogOpen, setCreateDialogOpen] =
  useState(false);

const [refreshing, setRefreshing] =
  useState(false);

const [message, setMessage] =
  useState("");

const [errorMessage, setErrorMessage] =
  useState("");

  const [search, setSearch] = useState("");

  const filteredTables = useMemo(() => {
  const query = search.trim().toLowerCase();

  return tables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "disabled"
        ? !table.is_active
        : table.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [tables, search, statusFilter]);

const [
  updatingTableId,
  setUpdatingTableId,
] = useState<string | null>(null);

const [
  tableWorkflowMode,
  setTableWorkflowMode,
] =
  useState<TableWorkflowMode>(
    "simple"
  );

  const showMessage = (text: string) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const showError = (text: string) => {
    setErrorMessage(text);

    setTimeout(() => {
      setErrorMessage("");
    }, 3500);
  };

  const loadTables = useCallback(async () => {
    try {
      setRefreshing(true);

      const res = await fetch("/api/dashboard/tables", {
        cache: "no-store",
      });

      const result = await res.json();

console.log(result);

if (!result.success) {
  showError(result.error || "Failed to load tables");
  return;
}

setTables(result.data?.tables ?? []);

setTableWorkflowMode(
  result.data?.tableWorkflowMode ??
    "simple"
);
    } catch (error) {
      console.error("LOAD TABLES ERROR:", error);
      showError("Failed to load tables");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTables();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadTables]);

  const getQRPath = (tableToken: string) => `/qr/table/${tableToken}`;

  const getQRUrl = (tableToken: string) => {
    if (typeof window === "undefined") {
      return getQRPath(tableToken);
    }

    return `${window.location.origin}${getQRPath(tableToken)}`;
  };

  const downloadQR = (table: RestaurantTable) => {
    const canvas = document.getElementById(
      `qr-${table.id}`,
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${table.name.toLowerCase()}-qr.png`;
    link.click();

    showMessage("QR downloaded");
  };

const addTable = async (tableNumber: number) => {
  if (saving) return;

  const generatedName = `Table-${tableNumber}`;

  setSaving(true);

  try {
    const res = await fetch("/api/dashboard/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: generatedName,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      showError(result.error || "Failed to create table");
      return;
    }

    await loadTables();

    showMessage(`${generatedName} created`);
  } catch (error) {
    console.error("CREATE TABLE ERROR:", error);
    showError("Failed to create table");
  } finally {
    setSaving(false);
  }
};
  

  

  async function updateTableStatus(
  tableId: string,
  status:
    | "available"
    | "occupied"
    | "bill_requested"
) {
  try {
    setUpdatingTableId(tableId)

    const response =
      await fetch(
        "/api/dashboard/tables/available",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            tableId,
            status,
          }),
        }
      )

    const result =
      await response.json()

    if (!result.success) {
      throw new Error(
        result.error
      )
    }

    await loadTables()
  } catch (error) {
    console.error(error)
  } finally {
    setUpdatingTableId(null)
  }
}

  const toggleTable = async (table: RestaurantTable) => {
  try {
    const res = await fetch(`/api/dashboard/tables/${table.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active: !table.is_active,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      showError(result.error || "Failed to update table");
      return;
    }

    await loadTables();

    showMessage(
      table.is_active
        ? `${table.name} disabled`
        : `${table.name} enabled`
    );
  } catch (error) {
    console.error("TOGGLE TABLE ERROR:", error);
    showError("Failed to update table");
  }
};

  const renameTable = async (table: RestaurantTable) => {
  const currentNumber = table.name.replace("Table-", "");

  const nextNumber = prompt(
    "Enter new table number",
    currentNumber
  )?.trim();

  if (!nextNumber) return;

  const generatedName = `Table-${nextNumber}`;

  try {
    const res = await fetch(`/api/dashboard/tables/${table.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: generatedName,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      showError(result.error || "Failed to rename table");
      return;
    }

    await loadTables();

    showMessage("Table renamed");
  } catch (error) {
    console.error("RENAME TABLE ERROR:", error);
    showError("Failed to rename table");
  }
};

  const deleteTable = async (table: RestaurantTable) => {
    const confirmed = confirm(`Delete ${table.name}?`);

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/dashboard/tables/${table.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        showError(data.error || "Failed to delete table");
        return;
      }

      setTables((current) => current.filter((item) => item.id !== table.id));

      showMessage(`${table.name} deleted`);
    } catch (error) {
      console.error("DELETE TABLE ERROR:", error);
      showError("Failed to delete table");
    }
  };

  const copyQRLink = async (table: RestaurantTable) => {
    try {
      await navigator.clipboard.writeText(
  getQRUrl(table.qr_token)
)
      showMessage("QR link copied");
    } catch (error) {
      console.error("COPY QR LINK ERROR:", error);
      showError("Failed to copy QR link");
    }
  };

  const activeTables = useMemo(
    () => tables.filter((table) => table.is_active).length,
    [tables],
  );

  const occupiedTables = useMemo(
    () => tables.filter((table) => table.status === "occupied").length,
    [tables],
  );

  const { setHeader } = useDashboardHeader();

  useEffect(() => {
  setHeader({
    title: "Tables",
    description: "Manage restaurant tables and QR ordering.",
    
  });

  return () => setHeader(null);
}, [setHeader, loadTables, refreshing]);

  return (
  <main
  className="
    min-h-full
    space-y-8
    bg-[var(--color-bg)]
  "
>

  

    {/* Stats */}
    <DashboardStats
  items={[
    {
      label: "Total Tables",
      value: tables.length,
      icon: Table2,
      description: "All restaurant tables",
    },
    {
      label: "Active",
      value: activeTables,
      icon: CheckCircle2,
      description: "Ready for customers",
    },
    {
      label: "Occupied",
      value: occupiedTables,
      icon: Users,
      description: "Currently serving",
    },
  ]}
/>

    {/* Create Table */}
   <DashboardToolbar
  left={
    <DashboardSearch
      value={search}
      onChange={setSearch}
      placeholder="Search tables..."
    />
  }
  center={
    <DashboardFilterTabs
      value={statusFilter}
      onChange={setStatusFilter}
      options={[
        { label: "All", value: "all" },
        { label: "Available", value: "available" },
        { label: "Occupied", value: "occupied" },
        { label: "Bill", value: "bill_requested" },
        { label: "Disabled", value: "disabled" },
      ]}
    />
  }
  right={
    <>
    <DashboardButton
      onClick={() => setCreateDialogOpen(true)}
    >
      <Plus className="size-4" />
      Create Table
    </DashboardButton>

    
    <DashboardButton
      variant="secondary"
      onClick={loadTables}
      disabled={refreshing}
    >
      {refreshing ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RefreshCw className="size-4" />
      )}

      Refresh
    </DashboardButton>

    <a
  href="/dashboard/tables/print"
  target="_blank"
  rel="noreferrer"
  className="
    inline-flex
    h-11
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-[var(--color-primary)]
    px-5
    text-sm
    font-semibold
    text-white
    transition-all
    hover:bg-[var(--color-primary-hover)]
  "
>
  <Printer className="size-4" />
  Print QR
</a>
</>
  
  }
/>

    {/* Loading */}
    {loading ? (
  <div className="flex justify-center py-24">
    <Loader2 className="size-8 animate-spin text-[var(--color-primary)]" />
  </div>
) : (
  <TablesGrid
  
  tables={filteredTables}
  updatingTableId={updatingTableId}
  tableWorkflowMode={tableWorkflowMode}
  getQRUrl={getQRUrl}
  getQRPath={getQRPath}
  onCopy={copyQRLink}
  onDownload={downloadQR}
  onRename={renameTable}
  onToggle={toggleTable}
  onDelete={deleteTable}
  onStatusChange={updateTableStatus}
/>
)}

<CreateTableDialog
  open={createDialogOpen}
  onOpenChange={setCreateDialogOpen}
  onCreate={addTable}
/>
  </main>
);
}
