"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  BellRing,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Volume2,
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
  const [notificationSupported, setNotificationSupported] = useState(false)
  const [showNewOrderNotice, setShowNewOrderNotice] = useState(false)
  const [connecting, setConnecting] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setNotificationSupported(supportsNotifications())

    const audio = new Audio("/sounds/new-order.mp3")
    audio.volume = 1
    audio.preload = "auto"
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const enableSound = async () => {
    setErrorMessage("")

    try {
      if (!audioRef.current) return

      audioRef.current.currentTime = 0
      await audioRef.current.play()

      localStorage.setItem("orders-sound-enabled", "true")
      setSoundEnabled(true)
    } catch (error) {
      console.error("SOUND ENABLE ERROR:", error)
      setErrorMessage("Browser blocked sound. Tap Enable Sound again.")
    }
  }

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

  const enableNotifications = async () => {
    setErrorMessage("")

    if (!supportsNotifications()) {
      setErrorMessage("Browser notifications are not supported here.")
      return
    }

    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      localStorage.setItem("orders-notification-enabled", "true")
      setNotificationEnabled(true)
      return
    }

    localStorage.removeItem("orders-notification-enabled")
    setNotificationEnabled(false)
    setErrorMessage("Notification permission was blocked.")
  }

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

    setRefreshing(true)

    refreshTimerRef.current = setTimeout(() => {
      router.refresh()
      setRefreshing(false)
    }, 300)
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
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
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
        () => {
          refreshOrders()
        }
      )
      .subscribe((status) => {
        setConnecting(status !== "SUBSCRIBED")

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setErrorMessage("Live order connection issue. Use Refresh if needed.")
        }
      })

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
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {!soundEnabled ? (
          <button
            type="button"
            onClick={enableSound}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
          >
            <Volume2 className="size-4" />
            Enable Sound
          </button>
        ) : (
          <span className="inline-flex h-10 items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-green-200">
            <CheckCircle2 className="size-4" />
            Sound On
          </span>
        )}

        {notificationSupported && !notificationEnabled && (
          <button
            type="button"
            onClick={enableNotifications}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)]"
          >
            <Bell className="size-4" />
            Enable Notifications
          </button>
        )}

        {notificationEnabled && (
          <span className="inline-flex h-10 items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-green-200">
            <CheckCircle2 className="size-4" />
            Notifications On
          </span>
        )}

        <button
          type="button"
          onClick={refreshOrders}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)] disabled:pointer-events-none disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refresh
        </button>

        {connecting && (
          <span className="inline-flex h-10 items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-3 text-xs font-bold text-yellow-200">
            <Loader2 className="size-4 animate-spin" />
            Connecting live orders
          </span>
        )}
      </div>

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