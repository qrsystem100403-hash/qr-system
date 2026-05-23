"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock3,
  CreditCard,
  Loader2,
  ReceiptText,
  RotateCcw,
  Utensils,
  XCircle,
} from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled"
type PaymentStatus = "pending" | "paid"

type Order = {
  id: string
  restaurant_id: string
  table_name: string
  total: number
  order_status: OrderStatus
  payment_status: PaymentStatus
  cancel_reason: string | null
}

type Props = {
  orderId?: string
  table: string
  restaurantId: string
}

const statusContent: Record<
  OrderStatus,
  {
    title: string
    description: string
    icon: React.ElementType
  }
> = {
  pending: {
    title: "Order Received",
    description: "Your order has reached the restaurant.",
    icon: CheckCircle2,
  },
  preparing: {
    title: "Preparing Food",
    description: "The kitchen has started preparing your order.",
    icon: ChefHat,
  },
  ready: {
    title: "Order Ready",
    description: "Your food is ready and will be served soon.",
    icon: Clock3,
  },
  served: {
    title: "Enjoy Your Meal",
    description: "Your order has been served.",
    icon: Utensils,
  },
  cancelled: {
    title: "Order Cancelled",
    description: "Your order was cancelled by the restaurant.",
    icon: XCircle,
  },
}

const progressStatuses: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "served",
]

export default function QRSuccessClient({
  orderId,
  table,
  restaurantId,
}: Props) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      setLoading(true)

      try {
        const params = new URLSearchParams({
          orderId,
          table,
        })

        const response = await fetch(`/api/qr/orders/status?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          console.error("ORDER STATUS FETCH ERROR:", data.error)
          setOrder(null)
          return
        }

        setOrder(data.order as Order)
      } catch (error) {
        console.error("ORDER STATUS FETCH ERROR:", error)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    const channel = supabaseBrowser
      .channel(`customer-order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        async () => {
          await fetchOrder()
        }
      )
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [orderId, table, restaurantId])

  const currentStatus = order?.order_status

  const content = currentStatus
    ? statusContent[currentStatus]
    : {
        title: loading ? "Checking Order" : "Order Not Found",
        description: loading
          ? "Please wait while we fetch your live order status."
          : "We could not find this order. Please contact the restaurant staff.",
        icon: loading ? Loader2 : ReceiptText,
      }

  const Icon = content.icon

  const activeIndex = useMemo(() => {
    if (!order || order.order_status === "cancelled") return -1
    return progressStatuses.indexOf(order.order_status)
  }, [order])

  return (
    <div className="mx-auto max-w-5xl pb-10 pt-4">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/qr/table/${encodeURIComponent(table)}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]"
        >
          <ArrowLeft className="size-4" />
          Menu
        </Link>

        <div className="rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-3 py-2 text-xs font-bold text-[var(--color-gold)]">
          Table {table}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/75 p-5 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:p-7">
          <div
            className={`mx-auto grid size-16 place-items-center rounded-2xl ${
              currentStatus === "cancelled"
                ? "bg-red-500/10 text-red-300"
                : "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
            }`}
          >
            <Icon className={`size-8 ${loading ? "animate-spin" : ""}`} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            Live Order
          </p>

          <h1 className="mt-2 font-heading text-4xl font-normal leading-none sm:text-5xl">
            {content.title}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
            {content.description}
          </p>

          {orderId && (
            <p className="mx-auto mt-4 max-w-sm break-all rounded-2xl border border-[var(--color-border)] bg-black/20 px-3 py-2 text-[11px] font-semibold text-[var(--color-text-muted)]">
              Order ID: {orderId}
            </p>
          )}
        </section>

        <aside className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/75 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
              <ReceiptText className="size-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                Order Details
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Real-time updates
              </p>
            </div>
          </div>

          {!order ? (
            <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-black/20 p-4 text-sm text-[var(--color-text-muted)]">
              {loading
                ? "Fetching latest order status..."
                : "No order details available."}
            </div>
          ) : order.order_status === "cancelled" ? (
            <div className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
              <div className="flex items-center gap-2 text-red-200">
                <XCircle className="size-5" />
                <p className="font-bold">Cancelled</p>
              </div>

              <p className="mt-2 text-sm leading-5 text-red-200/75">
                {order.cancel_reason?.trim() || "No reason provided."}
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              {progressStatuses.map((status, index) => {
                const active = status === order.order_status
                const completed = index < activeIndex

                return (
                  <div
                    key={status}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      active
                        ? "border-[var(--color-border-gold)] bg-[var(--color-gold)] text-[var(--color-bg)]"
                        : completed
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-[var(--color-border)] bg-black/15 text-[var(--color-text-muted)]"
                    }`}
                  >
                    <span className="text-sm font-bold capitalize">
                      {status}
                    </span>

                    <span className="text-xs font-extrabold uppercase tracking-[0.12em]">
                      {active ? "Now" : completed ? "Done" : "Waiting"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {order && (
            <div className="mt-5 space-y-3 border-t border-[var(--color-border)] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                  <CreditCard className="size-4" />
                  Payment
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    order.payment_status === "paid"
                      ? "bg-green-500/10 text-green-300"
                      : "bg-yellow-500/10 text-yellow-200"
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Total</span>
                <span className="text-xl font-extrabold text-[var(--color-gold)]">
                  ₹{order.total}
                </span>
              </div>
            </div>
          )}

          <Link
            href={`/qr/table/${encodeURIComponent(table)}`}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-gold)]"
          >
            <RotateCcw className="size-4" />
            Back to Menu
          </Link>
        </aside>
      </div>
    </div>
  )
}