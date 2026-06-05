"use client"

import { QRCodeCanvas } from "qrcode.react"
import { useCallback, useEffect, useMemo, useState } from "react"
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
} from "lucide-react"

type RestaurantTable = {
  id: string
  name: string
  is_active: boolean
  status: string
  last_activity_at: string | null
  created_at: string
}

export default function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [tableNumber, setTableNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const showMessage = (text: string) => {
    setMessage(text)

    setTimeout(() => {
      setMessage("")
    }, 2500)
  }

  const showError = (text: string) => {
    setErrorMessage(text)

    setTimeout(() => {
      setErrorMessage("")
    }, 3500)
  }

  const loadTables = useCallback(async () => {
    try {
      setRefreshing(true)

      const res = await fetch("/api/dashboard/tables", {
        cache: "no-store",
      })

      const data = await res.json()

      if (!data.success) {
        showError(data.error || "Failed to load tables")
        return
      }

      setTables(data.tables ?? [])
    } catch (error) {
      console.error("LOAD TABLES ERROR:", error)
      showError("Failed to load tables")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTables()
    }, 0)

    return () => clearTimeout(timer)
  }, [loadTables])

  const getQRPath = (tableName: string) =>
    `/qr/table/${encodeURIComponent(tableName)}`

  const getQRUrl = (tableName: string) => {
    if (typeof window === "undefined") {
      return getQRPath(tableName)
    }

    return `${window.location.origin}${getQRPath(tableName)}`
  }

  const downloadQR = (table: RestaurantTable) => {
    const canvas = document.getElementById(
      `qr-${table.id}`
    ) as HTMLCanvasElement | null

    if (!canvas) return

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")

    const link = document.createElement("a")
    link.href = pngUrl
    link.download = `${table.name.toLowerCase()}-qr.png`
    link.click()

    showMessage("QR downloaded")
  }

  const addTable = async () => {
    const cleaned = tableNumber.trim()

    if (!cleaned || saving) return

    const numericValue = Number(cleaned)

    if (Number.isNaN(numericValue) || numericValue <= 0) {
      showError("Enter a valid table number")
      return
    }

    const generatedName = `Table-${numericValue}`

    setSaving(true)

    try {
      const res = await fetch("/api/dashboard/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: generatedName,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        showError(data.error || "Failed to create table")
        return
      }

      setTables((current) => [...current, data.table])
      setTableNumber("")
      showMessage(`${generatedName} created`)
    } catch (error) {
      console.error("ADD TABLE ERROR:", error)
      showError("Failed to create table")
    } finally {
      setSaving(false)
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
      })

      const data = await res.json()

      if (!data.success) {
        showError(data.error || "Failed to update table")
        return
      }

      setTables((current) =>
        current.map((item) => (item.id === table.id ? data.table : item))
      )

      showMessage(
        table.is_active
          ? `${table.name} disabled`
          : `${table.name} enabled`
      )
    } catch (error) {
      console.error("TOGGLE TABLE ERROR:", error)
      showError("Failed to update table")
    }
  }

  const renameTable = async (table: RestaurantTable) => {
    const currentNumber = table.name.replace("Table-", "")

    const nextNumber = prompt(
      "Enter new table number",
      currentNumber
    )?.trim()

    if (!nextNumber) return

    const generatedName = `Table-${nextNumber}`

    try {
      const res = await fetch(`/api/dashboard/tables/${table.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: generatedName,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        showError(data.error || "Failed to rename table")
        return
      }

      setTables((current) =>
        current.map((item) => (item.id === table.id ? data.table : item))
      )

      showMessage("Table renamed")
    } catch (error) {
      console.error("RENAME TABLE ERROR:", error)
      showError("Failed to rename table")
    }
  }

  const deleteTable = async (table: RestaurantTable) => {
    const confirmed = confirm(`Delete ${table.name}?`)

    if (!confirmed) return

    try {
      const res = await fetch(`/api/dashboard/tables/${table.id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!data.success) {
        showError(data.error || "Failed to delete table")
        return
      }

      setTables((current) =>
        current.filter((item) => item.id !== table.id)
      )

      showMessage(`${table.name} deleted`)
    } catch (error) {
      console.error("DELETE TABLE ERROR:", error)
      showError("Failed to delete table")
    }
  }

  const copyQRLink = async (table: RestaurantTable) => {
    try {
      await navigator.clipboard.writeText(getQRUrl(table.name))
      showMessage("QR link copied")
    } catch (error) {
      console.error("COPY QR LINK ERROR:", error)
      showError("Failed to copy QR link")
    }
  }

  const activeTables = useMemo(
    () => tables.filter((table) => table.is_active).length,
    [tables]
  )

  const occupiedTables = useMemo(
  () => tables.filter((table) => table.status === "occupied").length,
  [tables]
)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)]/75 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
              <QrCode className="size-3.5" />
              QR Table Manager
            </div>

            <h1 className="mt-5 font-heading text-5xl font-normal leading-none sm:text-6xl">
              Smart Tables
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Generate QR-enabled restaurant tables instantly. Print, manage and
              control dine-in ordering access.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={loadTables}
              disabled={refreshing}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 px-5 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-bg)]"
            >
              <Printer className="size-4" />
              Print QR
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            Total Tables
          </p>

          <p className="mt-3 font-heading text-5xl font-normal leading-none">
            {tables.length}
          </p>
        </div>

        <div className="rounded-[26px] border border-green-500/20 bg-green-500/10 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-200">
            Active Tables
          </p>

          <p className="mt-3 font-heading text-5xl font-normal leading-none text-green-100">
            {activeTables}
          </p>
        </div>

        <div className="rounded-[26px] border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-gold)]">
            Occupied Tables
          </p>

          <p className="mt-3 font-heading text-5xl font-normal leading-none text-[var(--color-gold)]">
            {occupiedTables}
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/65 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-gold)]">
              Create Table
            </p>

            <div className="relative mt-3">
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={tableNumber}
                onChange={(e) =>
                  setTableNumber(e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTable()
                  }
                }}
                placeholder="Enter table number"
                className="h-14 w-full rounded-2xl border border-[var(--color-border)] bg-black/30 px-5 text-lg font-semibold outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-gold)]"
              />
            </div>

            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Typing{" "}
              <span className="font-bold text-[var(--color-text)]">1</span>{" "}
              automatically creates{" "}
              <span className="font-bold text-[var(--color-gold)]">
                Table-1
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={addTable}
            disabled={saving}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-6 text-sm font-black uppercase tracking-[0.16em] text-[var(--color-bg)] disabled:opacity-50 lg:min-w-[220px]"
          >
            {saving ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Plus className="size-5" />
            )}

            {saving ? "Creating..." : "Create Table"}
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {errorMessage}
          </div>
        )}
      </section>

      {loading ? (
        <div className="rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/60 p-10 text-center">
          <Loader2 className="mx-auto size-10 animate-spin text-[var(--color-gold)]" />

          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Loading tables...
          </p>
        </div>
      ) : !tables.length ? (
        <div className="rounded-[30px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)]/40 p-10 text-center">
          <QrCode className="mx-auto size-14 text-[var(--color-gold)]" />

          <h2 className="mt-5 font-heading text-4xl font-normal">
            No Tables Yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
            Create your first restaurant table and instantly generate its QR
            ordering code.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {tables.map((table) => {
            const qrUrl = getQRUrl(table.name)
            const qrPath = getQRPath(table.name)

            return (
              <article
                key={table.id}
                className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 shadow-[0_14px_45px_rgba(0,0,0,0.16)]"
              >
                <div className="border-b border-[var(--color-border)] bg-black/25 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
                        Restaurant Table
                      </p>

                      <h2 className="mt-2 truncate font-heading text-4xl font-normal leading-none">
                        {table.name}
                      </h2>

                      <div
                        className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                          table.is_active
                            ? "border-green-500/25 bg-green-500/10 text-green-300"
                            : "border-red-500/25 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {table.is_active ? (
                          <CheckCircle2 className="size-3.5" />
                        ) : (
                          <XCircle className="size-3.5" />
                        )}

                        {table.is_active ? "Active" : "Inactive"}
                      </div>
                      <div
  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
    table.status === "available"
      ? "border-green-500/25 bg-green-500/10 text-green-300"
      : table.status === "occupied"
      ? "border-orange-500/25 bg-orange-500/10 text-orange-300"
      : table.status === "bill_requested"
      ? "border-yellow-500/25 bg-yellow-500/10 text-yellow-300"
      : "border-blue-500/25 bg-blue-500/10 text-blue-300"
  }`}
>
  {table.status.replace("_", " ")}
</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTable(table)}
                      className={`rounded-2xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${
                        table.is_active
                          ? "border-red-500/25 bg-red-500/10 text-red-200"
                          : "border-green-500/25 bg-green-500/10 text-green-200"
                      }`}
                    >
                      {table.is_active ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mx-auto flex max-w-[240px] justify-center rounded-[24px] border border-[var(--color-border)] bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
                    <QRCodeCanvas
                      id={`qr-${table.id}`}
                      value={qrUrl}
                      size={170}
                      bgColor="#ffffff"
                      fgColor="#111111"
                      level="H"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-black/20 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      QR URL
                    </p>

                    <p className="mt-2 line-clamp-2 break-all text-xs leading-5 text-[var(--color-text)]">
                      {qrUrl}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => copyQRLink(table)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 text-xs font-black uppercase tracking-[0.12em]"
                    >
                      <Copy className="size-3.5" />
                      Copy
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadQR(table)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 text-xs font-black uppercase tracking-[0.12em]"
                    >
                      <Download className="size-3.5" />
                      Download
                    </button>

                    <a
                      href={qrPath}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] text-xs font-black uppercase tracking-[0.12em] text-[var(--color-bg)]"
                    >
                      <ExternalLink className="size-3.5" />
                      Open
                    </a>

                    <button
                      type="button"
                      onClick={() => renameTable(table)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 text-xs font-black uppercase tracking-[0.12em]"
                    >
                      <Pencil className="size-3.5" />
                      Rename
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTable(table)}
                      className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 text-xs font-black uppercase tracking-[0.12em] text-red-200"
                    >
                      <Trash2 className="size-3.5" />
                      Delete Table
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}