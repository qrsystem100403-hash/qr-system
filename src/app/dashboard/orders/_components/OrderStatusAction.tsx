"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CheckCircle2, ChefHat, Loader2, ShieldCheck, XCircle } from "lucide-react"
import type { OrderStatus } from "./order-types"

type NextStatus = "preparing" | "ready" | "served" | "cancelled"

type Props = {
  orderId: string
  currentStatus: OrderStatus
  nextStatus: NextStatus
  label: string
  variant: "orange" | "green" | "outline" | "danger"
  icon?: "chef" | "ready" | "complete" | "cancel"
  compact?: boolean
}

export default function OrderStatusAction({
  orderId,
  currentStatus,
  nextStatus,
  label,
  variant,
  icon,
  compact = false,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateStatus = async () => {
    if (loading) return

    let cancelReason = ""

    if (nextStatus === "cancelled") {
      cancelReason = window.prompt("Enter cancellation reason:")?.trim() ?? ""

      if (!cancelReason) return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/dashboard/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: nextStatus,
          cancelReason,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(data.error || "Failed to update order.")
        return
      }

      router.refresh()
    } catch {
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const disabled =
    loading ||
    currentStatus === "served" ||
    currentStatus === "cancelled" ||
    currentStatus === nextStatus

  const Icon =
    loading ? Loader2 :
    icon === "chef" ? ChefHat :
    icon === "ready" ? ShieldCheck :
    icon === "complete" ? CheckCircle2 :
    icon === "cancel" ? XCircle :
    CheckCircle2

  const variantClass =
    variant === "orange"
      ? "bg-[#F59E0B] text-white hover:bg-[#D97706]"
      : variant === "green"
        ? "bg-[#047A35] text-white hover:bg-[#05652D]"
        : variant === "danger"
          ? "border border-[#F3C6C2] bg-[#FDECEC] text-[#B42318] hover:bg-[#FBDADA] dark:border-[#5B2A2A] dark:bg-[#2A1A1A] dark:text-[#FCA5A5]"
          : "border border-[#2F7D57] bg-white text-[#2F7D57] hover:bg-[#E7F3EC] dark:bg-[#171A1F] dark:text-[#7BC99A] dark:hover:bg-[#183026]"

  if (compact) {
    return (
      <button
        type="button"
        onClick={updateStatus}
        disabled={disabled}
        className={`h-9 rounded-xl px-4 text-xs font-black transition disabled:pointer-events-none disabled:opacity-45 ${variantClass}`}
      >
        {loading ? "..." : label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={updateStatus}
      disabled={disabled}
      className={`flex h-16 flex-col items-center justify-center gap-1.5 rounded-lg text-[11px] font-black shadow-sm transition disabled:pointer-events-none disabled:opacity-45 ${variantClass}`}
    >
      <Icon className={`size-4 ${loading ? "animate-spin" : ""}`} />
      <span>{label}</span>
    </button>
  )
}