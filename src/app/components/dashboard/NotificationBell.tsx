"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  ChevronRight,
} from "lucide-react"

import { supabaseBrowser } from "@/lib/supabase/browser"
import Link from "next/link"

type Notification = {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function NotificationBell() {
  const [open, setOpen] =
    useState(false)

  const [notifications, setNotifications] =
    useState<Notification[]>([])

  const [loading, setLoading] =
    useState(true)

  const loadNotifications =
    async () => {
      try {
        const response =
          await fetch(
            "/api/dashboard/notifications"
          )

        const data =
          await response.json()

        if (data.success) {
          setNotifications(
            data.notifications
          )
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadNotifications()

    const channel =
      supabaseBrowser
        .channel(
          "dashboard-notifications"
        )

        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "notifications",
          },
          () => {
            loadNotifications()
          }
        )

        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table:
              "notifications",
          },
          () => {
            loadNotifications()
          }
        )

        .subscribe()

    return () => {
      supabaseBrowser.removeChannel(
        channel
      )
    }
  }, [])

  const unreadCount =
    notifications.filter(
      (n) => !n.is_read
    ).length

  const markAsRead =
    async (id: string) => {
      try {
        await fetch(
          `/api/dashboard/notifications/${id}/read`,
          {
            method: "POST",
          }
        )

        setNotifications(
          (prev) =>
            prev.map((n) =>
              n.id === id
                ? {
                    ...n,
                    is_read: true,
                  }
                : n
            )
        )
      } catch (error) {
        console.error(error)
      }
    }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative
          grid
          size-10
          place-items-center
          rounded-2xl
          border
          border-[#E4DED3]
          bg-white
          text-[#667085]
          transition-all
          hover:border-[#2F7D57]
          hover:text-[#2F7D57]

          dark:border-[#2A2F35]
          dark:bg-[#171A1F]
          dark:text-[#AAB2BD]
          dark:hover:border-[#2F7D57]
          dark:hover:text-[#7BC99A]
        "
      >
        <Bell className="size-4" />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-[#2F7D57] dark:bg-[#7BC99A] dark:text-[#101215]
              px-1
              text-[10px]
              font-bold
              text-white
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-12
            z-50
            w-[380px]
            overflow-hidden
            rounded-3xl
            border
            border-[#E4DED3]
            bg-white
            shadow-2xl

            dark:border-[#2A2F35]
            dark:bg-[#171A1F]
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#E4DED3]
              p-4

              dark:border-[#2A2F35]
            "
          >
            <div>
              <h3 className="font-bold">
                Notifications
              </h3>

              <p className="text-xs text-[#98A2B3]">
                {unreadCount} unread
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-[#E7F3EC]
                px-2.5
                py-1
                text-xs
                font-bold
                text-[#2F7D57]

                dark:bg-[#183026]
                dark:text-[#7BC99A]
              "
            >
              {
                notifications.length
              }
            </span>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-[#667085]">
                Loading...
              </div>
            ) : notifications.length ===
              0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto size-8 text-[#98A2B3]" />

                <p className="mt-3 text-sm text-[#667085]">
                  No notifications
                </p>
              </div>
            ) : (
              notifications
                .slice(0, 8)
                .map(
                  (
                    notification
                  ) => (
                    <button
                      key={
                        notification.id
                      }
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                      className={`
                        w-full
                        border-b
                        p-4
                        text-left
                        transition-all

                        dark:border-[#2A2F35]

                        ${
                          notification.is_read
                            ? "bg-transparent"
                            : "bg-[#F7FAF8] dark:bg-[#1B231E]"
                        }

                        hover:bg-[#F7F8FA]
                        dark:hover:bg-[#20242A]
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.is_read && (
                          <div className="mt-2 size-2 rounded-full bg-[#2F7D57]" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#111827] dark:text-[#E7E9EC]">
                            {
                              notification.title
                            }
                          </p>

                          <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
                            {
                              notification.message
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                )
            )}
          </div>

          {notifications.length >
            0 && (
            <div
              className="
                border-t
                border-[#E4DED3]
                p-3

                dark:border-[#2A2F35]
              "
            >
              <Link
                href="/dashboard/operations"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#F7F8FA]
                  py-3
                  text-sm
                  font-semibold
                  transition-all

                  hover:bg-[#E7F3EC]
                  hover:text-[#2F7D57]

                  dark:bg-[#20242A]
                  dark:hover:bg-[#183026]
                  dark:hover:text-[#7BC99A]
                "
              >
                View All Notifications
                <ChevronRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}