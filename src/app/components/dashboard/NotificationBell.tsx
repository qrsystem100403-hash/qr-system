"use client"

import { useEffect, useState, useRef } from "react"
import { Bell } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"
import NotificationBottomSheet from "./notification/NotificationBottomSheet";
import NotificationDropdown from "./notification/NotificationDropdown"
import DashboardIconButton from "./ui/DashboardIconButton"

type Notification = {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const media = window.matchMedia("(max-width: 1023px)");

  const update = () => setIsMobile(media.matches);

  update();

  media.addEventListener("change", update);

  return () => media.removeEventListener("change", update);
}, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/dashboard/notifications");
const result = await response.json();

if (result.success) {
  setNotifications(
    Array.isArray(result.data?.notifications)
      ? result.data.notifications
      : []
  );
}
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Realtime Subscriptions & Outside Clicks
  useEffect(() => {
    loadNotifications()

    // 1. Outside Click Handler to close dropdown safely
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (!isMobile) {
  document.addEventListener("mousedown", handleOutsideClick);
}

    // 2. Realtime Supabase Channel
    const channel = supabaseBrowser
      .channel("dashboard-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          // Prepend new database notification directly to state for zero-latency UI
          const newNotif = payload.new as Notification
          setNotifications((prev) => [newNotif, ...prev])
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          // Sync database updates locally without refetching everything
          const updatedNotif = payload.new as Notification
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
          )
        }
      )
      .subscribe()

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      supabaseBrowser.removeChannel(channel)
    }
  }, [isMobile]);

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAsRead = async (id: string) => {
    // Optimistic state update so the item clears instantly
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )

    try {
      const response = await fetch(`/api/dashboard/notifications/${id}/read`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to sync read status to backend")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Rollback UI changes if the network request fails completely
      loadNotifications()
    }
  }

  return (
  <div
    className="relative"
    ref={dropdownRef}
  >
    <DashboardIconButton
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      aria-label="Notifications"
      className="relative"
    >
      <Bell className="size-4 md:size-5" />

      {unreadCount > 0 && (
        <span
          className="
            absolute
            -right-1
            -top-1
            flex
            min-h-4
            min-w-4

            md:min-h-5
            md:min-w-5
            items-center
            justify-center
            rounded-full
            bg-[var(--color-danger)]
            px-1
            text-[10px]
            font-bold
            text-white
          "
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </DashboardIconButton>

    <>
  {!isMobile && (
  <NotificationDropdown
    open={open}
    loading={loading}
    unreadCount={unreadCount}
    notifications={notifications}
    onRead={markAsRead}
    onClose={() => setOpen(false)}
  />
)}

{isMobile && (
  <NotificationBottomSheet
    open={open}
    loading={loading}
    notifications={notifications}
    onRead={markAsRead}
    onClose={() => setOpen(false)}
  />
)}

</>
  </div>
);
}