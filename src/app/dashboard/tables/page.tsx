"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";

type RestaurantTable = {
  id: string;
  name: string;
  qr_token: string;
  is_active: boolean;
  status: string;
  last_activity_at: string | null;
  created_at: string;
};

export default function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingTableId, setUpdatingTableId] = useState<string | null>(null);
  const [
  tableWorkflowMode,
  setTableWorkflowMode,
] = useState<
  "simple" |
  "advanced" |
  "expert"
>("simple")

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

      const data = await res.json();

      if (!data.success) {
        showError(data.error || "Failed to load tables");
        return;
      }

      setTables(data.tables ?? []);
      setTableWorkflowMode(
  data.tableWorkflowMode ??
    "simple"
)
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

  const addTable = async () => {
    const cleaned = tableNumber.trim();

    if (!cleaned || saving) return;

    const numericValue = Number(cleaned);

    if (Number.isNaN(numericValue) || numericValue <= 0) {
      showError("Enter a valid table number");
      return;
    }

    const generatedName = `Table-${numericValue}`;

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

      const data = await res.json();

      if (!data.success) {
        showError(data.error || "Failed to create table");
        return;
      }

      setTables((current) => [...current, data.table]);
      setTableNumber("");
      showMessage(`${generatedName} created`);
    } catch (error) {
      console.error("ADD TABLE ERROR:", error);
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

      const data = await res.json();

      if (!data.success) {
        showError(data.error || "Failed to update table");
        return;
      }

      setTables((current) =>
        current.map((item) => (item.id === table.id ? data.table : item)),
      );

      showMessage(
        table.is_active ? `${table.name} disabled` : `${table.name} enabled`,
      );
    } catch (error) {
      console.error("TOGGLE TABLE ERROR:", error);
      showError("Failed to update table");
    }
  };

  const renameTable = async (table: RestaurantTable) => {
    const currentNumber = table.name.replace("Table-", "");

    const nextNumber = prompt("Enter new table number", currentNumber)?.trim();

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

      const data = await res.json();

      if (!data.success) {
        showError(data.error || "Failed to rename table");
        return;
      }

      setTables((current) =>
        current.map((item) => (item.id === table.id ? data.table : item)),
      );

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

  return (
  <main className="space-y-6 px-4 py-5">
    {/* Header */}
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-[#E7E9EC]">
          Tables
        </h1>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
          Manage restaurant tables and QR ordering
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={loadTables}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#E4DED3] bg-white px-4 text-sm font-semibold dark:border-[#2A2F35] dark:bg-[#171A1F]"
        >
          {refreshing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refresh
        </button>

        <a
          href="/dashboard/tables/print"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#2F7D57] px-4 text-sm font-semibold text-white"
        >
          <Printer className="size-4" />
          Print QR
        </a>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl border border-[#E4DED3] bg-white p-4 dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
          Total Tables
        </p>
        <p className="mt-1 text-2xl font-bold text-[#111827] dark:text-[#E7E9EC]">
          {tables.length}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E4DED3] bg-white p-4 dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
          Active
        </p>
        <p className="mt-1 text-2xl font-bold text-[#2F7D57]">
          {activeTables}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E4DED3] bg-white p-4 dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
          Occupied
        </p>
        <p className="mt-1 text-2xl font-bold text-orange-600">
          {occupiedTables}
        </p>
      </div>
    </div>

    {/* Create Table */}
    <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 dark:border-[#2A2F35] dark:bg-[#171A1F]">
      <h2 className="text-lg font-semibold text-[#111827] dark:text-[#E7E9EC]">
        Create Table
      </h2>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row">
        <input
          type="number"
          min="1"
          value={tableNumber}
          onChange={(e) =>
            setTableNumber(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Enter table number"
          className="h-12 flex-1 rounded-2xl border border-[#E4DED3] bg-white px-4 outline-none dark:border-[#2A2F35] dark:bg-[#20242A]"
        />

        <button
          onClick={addTable}
          disabled={saving}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2F7D57] px-5 font-semibold text-white"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}

          {saving ? "Creating..." : "Create Table"}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-2xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
    </div>

    {/* Loading */}
    {loading ? (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#2F7D57]" />
      </div>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => {
          const qrUrl = getQRUrl(table.qr_token);
          const qrPath = getQRPath(table.qr_token);

          return (
            <div
              key={table.id}
              className="rounded-3xl border border-[#E4DED3] bg-white p-5 dark:border-[#2A2F35] dark:bg-[#171A1F]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] dark:text-[#E7E9EC]">
                    {table.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={
                        table.is_active
                          ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                          : "rounded-full bg-red-100 px-2 py-1 text-xs text-red-700"
                      }
                    >
                      {table.is_active ? "Active" : "Inactive"}
                    </span>

                    <span className="rounded-full bg-[#F7F8FA] px-2 py-1 text-xs text-[#667085] dark:bg-[#20242A] dark:text-[#AAB2BD]">
                      {table.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleTable(table)}
                  className="rounded-xl border border-[#E4DED3] px-3 py-1 text-xs font-semibold dark:border-[#2A2F35]"
                >
                  {table.is_active ? "Disable" : "Enable"}
                </button>
              </div>

              <div className="mt-5 flex justify-center">
                <div className="rounded-2xl bg-white p-3">
                  <QRCodeCanvas
                    id={`qr-${table.id}`}
                    value={qrUrl}
                    size={150}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => copyQRLink(table)}
                  className="rounded-xl border border-[#E4DED3] p-2 text-sm dark:border-[#2A2F35]"
                >
                  Copy
                </button>

                <button
                  onClick={() => downloadQR(table)}
                  className="rounded-xl border border-[#E4DED3] p-2 text-sm dark:border-[#2A2F35]"
                >
                  Download
                </button>

                <a
                  href={qrPath}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-[#2F7D57] p-2 text-center text-sm text-white"
                >
                  Open
                </a>

                <button
                  onClick={() => renameTable(table)}
                  className="rounded-xl border border-[#E4DED3] p-2 text-sm dark:border-[#2A2F35]"
                >
                  Rename
                </button>
              </div>

              <button
                onClick={() => deleteTable(table)}
                className="mt-3 w-full rounded-xl bg-red-50 p-2 text-sm font-medium text-red-700"
              >
                Delete Table
              </button>
            </div>
          );
        })}
      </div>
    )}
  </main>
);
}
