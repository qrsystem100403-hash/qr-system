"use client"

import { useEffect, useState } from "react"
import { Bell, CreditCard, ShoppingBag, X } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type NotificationItem = {
  id: string
  type: "new_order" | "bill_request" | "waiter_request"
  title: string
  tableName: string
}

type Props = {
  restaurantId: string
}

export default function NotificationCenter({ restaurantId }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3")
    audio.volume = 0.8
    audio.play().catch(() => {})
  }

  const pushNotification = (
    type: NotificationItem["type"],
    title: string,
    tableName: string
  ) => {
    playNotificationSound()
    const id = crypto.randomUUID()

    // Prepend and limit max display stream to 5 items safely
    setNotifications((prev) => [{ id, type, title, tableName }, ...prev].slice(0, 5))
  }

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`notifications-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "requests",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const request = payload.new as {
            table_name: string
            request_type: string
            custom_message: string | null
          }

          const titleMap: Record<string, string> = {
            water: "Water Request",
            spoon: "Spoon Request",
            fork: "Fork Request",
            tissue: "Tissue Request",
            waiter: "Waiter Request",
            bill: "Bill Requested",
            other: "Custom Request",
          }

          pushNotification(
            request.request_type === "bill" ? "bill_request" : "waiter_request",
            request.request_type === "other"
              ? "Custom Request"
              : titleMap[request.request_type] ?? "Service Request",
            request.request_type === "other"
              ? `${request.table_name} • ${request.custom_message ?? ""}`
              : request.table_name
          )
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const order = payload.new as {
            table_name: string
            total: number
          }

          pushNotification(
            "new_order",
            "New Order",
            `${order.table_name} • ₹${order.total}`
          )
        }
      )
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div
      className="
        pointer-events-none
        fixed
        right-4
        top-24
        z-[9999]
        flex
        w-[360px]
        max-w-[calc(100vw-32px)]
        flex-col
        gap-3
      "
    >
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

/* ==========================================================================
   ToastItem Component (Handles individual lifecycle timers and state safely)
   ========================================================================== */
function ToastItem({
  notification,
  onClose,
}: {
  notification: NotificationItem
  onClose: (id: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, onClose])

  const getIcon = (type: NotificationItem["type"]) => {
    if (type === "new_order") return <ShoppingBag className="size-4" />
    if (type === "bill_request") return <CreditCard className="size-4" />
    return <Bell className="size-4" />
  }

  const getStyle = (type: NotificationItem["type"]) => {
    if (type === "new_order") {
      return {
        icon: "bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]",
        border: "border-[#BFE4CE]",
      }
    }
    if (type === "bill_request") {
      return {
        icon: "bg-[#FFF4E5] text-[#C2410C] dark:bg-[#332313] dark:text-[#FDBA74]",
        border: "border-[#F6D6B8]",
      }
    }
    return {
      icon: "bg-[#EEF4FF] text-[#2563EB] dark:bg-[#1B2740] dark:text-[#93C5FD]",
      border: "border-[#C7D8FF]",
    }
  }

  const style = getStyle(notification.type)

  return (
    <div
      className={`
        pointer-events-auto
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-white
        p-4
        shadow-xl
        backdrop-blur-xl
        animate-in fade-in slide-in-from-right-5 duration-300
        dark:bg-[#171A1F]
        dark:border-[#2A2F35]
        ${style.border}
      `}
    >
      <button
        onClick={() => onClose(notification.id)}
        className="
          absolute
          right-3
          top-3
          rounded-lg
          p-1
          text-[#98A2B3]
          transition
          hover:bg-black/5
          hover:text-red-500
          dark:hover:bg-white/5
        "
      >
        <X className="size-4" />
      </button>

      <div className="flex gap-3">
        <div
          className={`
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${style.icon}
          `}
        >
          {getIcon(notification.type)}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-[#111827] dark:text-[#E7E9EC]">
            {notification.title}
          </h4>
          <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
            {notification.tableName}
          </p>
        </div>
      </div>

      {/* Progress Bar Track Indicator */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-full
          origin-left
          animate-[shrink_5s_linear_forwards]
          bg-[#2F7D57]
        "
      />
    </div>
  )
}