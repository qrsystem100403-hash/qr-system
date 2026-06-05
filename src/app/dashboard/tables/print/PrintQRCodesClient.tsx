"use client"

import { QRCodeCanvas } from "qrcode.react"
import { ArrowLeft, Printer, QrCode } from "lucide-react"
import Link from "next/link"

type RestaurantTable = {
  id: string
  name: string
  is_active: boolean
}

type Props = {
  restaurantName: string
  tables: RestaurantTable[]
}

function getQRUrl(tableName: string) {
  if (typeof window === "undefined") {
    return `/qr/table/${encodeURIComponent(tableName)}`
  }

  return `${window.location.origin}/qr/table/${encodeURIComponent(tableName)}`
}

export default function PrintQRCodesClient({ restaurantName, tables }: Props) {
  return (
    <main className="min-h-screen bg-zinc-100 p-4 text-black print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm print:hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">
                <QrCode className="size-3.5" />
                QR Print Sheet
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight">
                Print Table QR Codes
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                Print clean table cards for{" "}
                <span className="font-bold text-zinc-950">{restaurantName}</span>
                . Only active tables are included.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/dashboard/tables"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-zinc-700"
              >
                <ArrowLeft className="size-4" />
                Back
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                <Printer className="size-4" />
                Print All
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Restaurant
              </p>
              <p className="mt-1 truncate text-lg font-black">
                {restaurantName}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Active QR Cards
              </p>
              <p className="mt-1 text-lg font-black">{tables.length}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Print Tip
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-700">
                Use A4, scale 100%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-0">
          {tables.map((table) => {
            const qrUrl = getQRUrl(table.name)

            return (
              <section
                key={table.id}
                className="break-inside-avoid overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-5 text-center shadow-sm print:min-h-[48vh] print:rounded-none print:border print:border-black print:p-5 print:shadow-none"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border-2 border-black text-xl font-black">
                  {restaurantName.charAt(0).toUpperCase()}
                </div>

                <h2 className="mt-4 line-clamp-2 text-2xl font-black leading-tight">
                  {restaurantName}
                </h2>

                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500">
                  Scan • Order • Enjoy
                </p>

                <div className="my-5 border-t border-dashed border-zinc-300" />

                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
                  Table Number
                </p>

                <p className="mt-1 text-4xl font-black tracking-tight">
                  {table.name.replace(/^Table-/i, "")}
                </p>

                <div className="mt-5 flex justify-center">
                  <div className="rounded-[22px] border border-zinc-200 bg-white p-4 shadow-sm print:border-black print:shadow-none">
                    <QRCodeCanvas
                      value={qrUrl}
                      size={210}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>
                </div>

                <p className="mt-5 text-lg font-black">
                  Scan QR to view menu & place order
                </p>

                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-zinc-500">
                  No app needed. Open camera, scan this code, and order directly
                  from your table.
                </p>

                <p className="mt-4 break-all rounded-xl bg-zinc-50 px-3 py-2 text-[10px] leading-4 text-zinc-500 print:bg-transparent">
                  {qrUrl}
                </p>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}