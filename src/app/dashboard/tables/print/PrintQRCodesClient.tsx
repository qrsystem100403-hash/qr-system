"use client"

import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useState } from "react"
import { Printer } from "lucide-react"

type RestaurantTable = {
  id: string
  name: string
  is_active: boolean
}

type Props = {
  restaurantName: string
  tables: RestaurantTable[]
}

export default function PrintQRCodesClient({ restaurantName, tables }: Props) {
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const getQRUrl = (tableName: string) =>
    `${origin}/qr/table/${encodeURIComponent(tableName)}`

  return (
    <main className="min-h-screen bg-zinc-100 p-4 text-black print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm print:hidden sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
              QR Print Sheet
            </p>

            <h1 className="mt-2 text-3xl font-bold">Print QR Codes</h1>

            <p className="mt-1 text-sm text-zinc-600">
              Print active table QR codes for {restaurantName}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white"
          >
            <Printer className="size-4" />
            Print All
          </button>
        </div>

        {!tables.length ? (
          <div className="rounded-2xl bg-white p-6 text-center print:p-0">
            <p className="font-semibold">No active tables found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-3">
            {tables.map((table) => {
              const qrUrl = origin ? getQRUrl(table.name) : ""

              return (
                <section
                  key={table.id}
                  className="break-inside-avoid rounded-2xl border border-zinc-300 bg-white p-5 text-center print:rounded-none print:border-black print:p-4"
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-black text-lg font-black">
                    F
                  </div>

                  <h2 className="mt-3 text-xl font-black leading-tight">
                    {restaurantName}
                  </h2>

                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Pure Vegetarian
                  </p>

                  <div className="my-4 border-t border-dashed border-zinc-300" />

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Table
                  </p>

                  <p className="mt-1 text-3xl font-black">{table.name}</p>

                  <div className="mt-5 flex justify-center">
                    {origin && (
                      <div className="rounded-xl border border-zinc-200 bg-white p-3">
                        <QRCodeCanvas
                          value={qrUrl}
                          size={190}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-base font-black">
                    Scan to view menu & place order
                  </p>

                  <p className="mt-2 break-all text-[10px] leading-4 text-zinc-500">
                    {qrUrl}
                  </p>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}