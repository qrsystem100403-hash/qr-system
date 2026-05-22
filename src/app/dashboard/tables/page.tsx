"use client"

import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Pencil,
  Plus,
  Printer,
  Trash2,
  XCircle,
} from "lucide-react"

type RestaurantTable = {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

export default function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const loadTables = async () => {
    const res = await fetch("/api/dashboard/tables")
    const data = await res.json()

    if (data.success) setTables(data.tables)
    setLoading(false)
  }

  useEffect(() => {
    loadTables()
  }, [])

  const getQRPath = (tableName: string) =>
    `/qr/table/${encodeURIComponent(tableName)}`

  const getQRUrl = (tableName: string) =>
    origin ? `${origin}${getQRPath(tableName)}` : getQRPath(tableName)

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
    link.download = `${table.name.replace(/\s+/g, "-").toLowerCase()}-qr.png`
    link.click()
  }

  const addTable = async () => {
    const tableName = name.trim()
    if (!tableName || saving) return

    setSaving(true)

    const res = await fetch("/api/dashboard/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tableName }),
    })

    const data = await res.json()

    if (!data.success) {
      alert(data.error || "Failed to add table")
      setSaving(false)
      return
    }

    setTables((current) => [...current, data.table])
    setName("")
    setSaving(false)
  }

  const toggleTable = async (table: RestaurantTable) => {
    const res = await fetch(`/api/dashboard/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !table.is_active }),
    })

    const data = await res.json()

    if (!data.success) {
      alert(data.error || "Failed to update table")
      return
    }

    setTables((current) =>
      current.map((item) => (item.id === table.id ? data.table : item))
    )
  }

  const renameTable = async (table: RestaurantTable) => {
    const newName = prompt("Enter new table name", table.name)?.trim()
    if (!newName || newName === table.name) return

    const res = await fetch(`/api/dashboard/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })

    const data = await res.json()

    if (!data.success) {
      alert(data.error || "Failed to rename table")
      return
    }

    setTables((current) =>
      current.map((item) => (item.id === table.id ? data.table : item))
    )
  }

  const deleteTable = async (table: RestaurantTable) => {
    if (!confirm(`Delete ${table.name}?`)) return

    const res = await fetch(`/api/dashboard/tables/${table.id}`, {
      method: "DELETE",
    })

    const data = await res.json()

    if (!data.success) {
      alert(data.error || "Failed to delete table")
      return
    }

    setTables((current) => current.filter((item) => item.id !== table.id))
  }

  const copyQRLink = async (table: RestaurantTable) => {
    await navigator.clipboard.writeText(getQRUrl(table.name))
    alert("QR link copied")
  }

  const activeTables = useMemo(
    () => tables.filter((table) => table.is_active).length,
    [tables]
  )

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              QR Tables
            </p>

            <h1 className="mt-2 font-heading text-4xl font-normal leading-none sm:text-5xl">
              Table Manager
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
              Create, print, and manage dine-in QR codes.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href="/dashboard/tables/print"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--color-bg)]"
            >
              <Printer className="size-4" />
              Print QR
            </a>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm">
              <span className="text-[var(--color-text-muted)]">Active:</span>{" "}
              <span className="font-bold text-green-400">{activeTables}</span>
              <span className="mx-2 text-[var(--color-text-muted)]">/</span>
              <span className="font-bold">{tables.length}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTable()
            }}
            placeholder="Table name e.g. Table 1"
            className="min-h-12 flex-1 rounded-2xl border border-[var(--color-border)] bg-black/30 px-4 text-sm outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-gold)]"
          />

          <button
            type="button"
            onClick={addTable}
            disabled={saving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-black disabled:opacity-50"
          >
            <Plus className="size-4" />
            {saving ? "Adding..." : "Add Table"}
          </button>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-[var(--color-text-muted)]">
            Loading tables...
          </p>
        ) : !tables.length ? (
          <div className="mt-8 rounded-[22px] border border-dashed border-[var(--color-border)] p-6 text-center">
            <p className="font-heading text-3xl">No tables yet</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Add your first table to generate its QR code.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {tables.map((table) => {
              const qrUrl = getQRUrl(table.name)
              const qrPath = getQRPath(table.name)

              return (
                <article
                  key={table.id}
                  className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] bg-black/25 p-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                        Table
                      </p>

                      <h2 className="mt-1 truncate font-heading text-3xl font-normal leading-none">
                        {table.name}
                      </h2>

                      <div
                        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
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
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTable(table)}
                      className={`shrink-0 rounded-xl border px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                        table.is_active
                          ? "border-red-500/25 bg-red-500/10 text-red-200"
                          : "border-green-500/25 bg-green-500/10 text-green-200"
                      }`}
                    >
                      {table.is_active ? "Disable" : "Enable"}
                    </button>
                  </div>

                  <div className="p-3">
                    <div className="mx-auto flex max-w-[220px] justify-center rounded-[18px] border border-[var(--color-border)] bg-white p-3">
                      <QRCodeCanvas
                        id={`qr-${table.id}`}
                        value={qrUrl}
                        size={150}
                        bgColor="#ffffff"
                        fgColor="#111111"
                        level="H"
                      />
                    </div>

                    <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-black/20 p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        QR URL
                      </p>
                      <p className="mt-1 line-clamp-2 break-all text-xs leading-5 text-[var(--color-text)]">
                        {qrUrl}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => copyQRLink(table)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] text-xs font-bold"
                      >
                        <Copy className="size-3.5" />
                        Copy
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadQR(table)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] text-xs font-bold"
                      >
                        <Download className="size-3.5" />
                        QR
                      </button>

                      <a
                        href={qrPath}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-black"
                      >
                        <ExternalLink className="size-3.5" />
                        Open
                      </a>

                      <button
                        type="button"
                        onClick={() => renameTable(table)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] text-xs font-bold"
                      >
                        <Pencil className="size-3.5" />
                        Rename
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTable(table)}
                        className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 text-xs font-bold text-red-200"
                      >
                        <Trash2 className="size-3.5" />
                        Delete Table
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}