"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BellRing,
  XCircle,
} from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type Props = {
  restaurantId: string
}

function getSavedSoundEnabled() {
  if (typeof window === "undefined") return false
  return localStorage.getItem("orders-sound-enabled") === "true"
}

function getSavedNotificationEnabled() {
  if (typeof window === "undefined") return false
  if (!("Notification" in window)) return false

  return (
    localStorage.getItem("orders-notification-enabled") === "true" &&
    Notification.permission === "granted"
  )
}

function supportsNotifications() {
  if (typeof window === "undefined") return false
  return "Notification" in window
}

export default function OrdersRealtime({ restaurantId }: Props) {
  const router = useRouter()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [soundEnabled, setSoundEnabled] = useState(getSavedSoundEnabled)
  const [notificationEnabled, setNotificationEnabled] = useState(
    getSavedNotificationEnabled
  )

  const [showNewOrderNotice, setShowNewOrderNotice] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    

    const audio = new Audio("/sounds/new-order.mp3")
    audio.volume = 1
    audio.preload = "auto"
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  

  const playSound = useCallback(async () => {
    if (!soundEnabled || !audioRef.current) return

    try {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      await audioRef.current.play()
    } catch (error) {
      console.error("PLAY SOUND ERROR:", error)
      setSoundEnabled(false)
      localStorage.removeItem("orders-sound-enabled")
      setErrorMessage("Sound was blocked. Enable it again.")
    }
  }, [soundEnabled])

  

  const showBrowserNotification = useCallback(() => {
    if (!supportsNotifications()) return
    if (!notificationEnabled) return
    if (Notification.permission !== "granted") return

    new Notification("New order received", {
      body: "A new table order has been placed.",
      icon: "/favicon.ico",
      tag: `new-order-${Date.now()}`,
    })
  }, [notificationEnabled])

  const refreshOrders = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
    }

    refreshTimerRef.current = setTimeout(() => {
  router.refresh()
})
  }, [router])

  const showNotice = useCallback(() => {
    setShowNewOrderNotice(true)

    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current)
    }

    noticeTimerRef.current = setTimeout(() => {
      setShowNewOrderNotice(false)
    }, 4500)
  }, [])

  const handleNewOrder = useCallback(async () => {
    showNotice()
    showBrowserNotification()
    await playSound()
    refreshOrders()
  }, [playSound, refreshOrders, showBrowserNotification, showNotice])

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`orders-realtime-${restaurantId}`)
      .on(
  "postgres_changes",
  {
    event: "INSERT",
    schema: "public",
    table: "orders",
  },
  (payload) => {
    const order =
      payload.new as {
        restaurant_id: string
      }

    if (
      order.restaurant_id !==
      restaurantId
    ) {
      return
    }

    handleNewOrder()
  }
)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
    const order =
      payload.new as {
        restaurant_id: string
      }

    if (
      order.restaurant_id !==
      restaurantId
    ) {
      return
    }

    refreshOrders()
  }
      )
      .subscribe()

    const handleFocus = () => refreshOrders()

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshOrders()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)

      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibility)

      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId, handleNewOrder, refreshOrders])

  return (
    <>
      

      {errorMessage && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          <XCircle className="size-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {showNewOrderNotice && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">
          <BellRing className="size-5" />
          New order received
        </div>
      )}
    </>
  )
}