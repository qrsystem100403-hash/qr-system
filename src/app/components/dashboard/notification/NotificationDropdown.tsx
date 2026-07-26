"use client";

import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}; 

type Props = {
  open: boolean;
  loading: boolean;
  unreadCount: number;
  notifications: Notification[];
  onClose: () => void;
  onRead: (id: string) => void;
};

export default function NotificationDropdown({
  open,
  loading,
  unreadCount,
  notifications,
  onClose,
  onRead,
}: Props) {
  if (!open) return null;





  return (
    
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-[380px]
        overflow-hidden
        rounded-[var(--radius-xl)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        shadow-[var(--shadow-xl)]
        animate-in
        fade-in
        slide-in-from-top-2
        duration-200
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
        <div>
          <h3 className="font-semibold text-[var(--color-heading)]">
            Notifications
          </h3>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {unreadCount} unread
          </p>
        </div>

        <div
          className="
            rounded-full
            bg-[var(--color-primary-soft)]
            px-3
            py-1
            text-xs
            font-semibold
            text-[var(--color-primary)]
          "
        >
          {notifications.length}
        </div>
      </div>

      {/* Body */}

      <div className="max-h-[40vh] overflow-y-auto dashboard-scrollbar">
        {loading ? (
          <div className="flex h-32 items-center justify-center text-sm text-[var(--color-text-muted)]">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="size-8 text-[var(--color-text-soft)]" />

            <p className="mt-4 font-medium text-[var(--color-heading)]">
              You're all caught up
            </p>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              No notifications available.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
  onRead(notification.id);
  onClose();
}}
              className={`
                w-full
                border-b
                border-[var(--color-divider)]
                px-5
                py-4
                text-left
                transition-colors
                hover:bg-[var(--color-surface-hover)]

                ${
                  notification.is_read
                    ? ""
                    : "border-l-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`
                    mt-2
                    h-2
                    w-2
                    rounded-full

                    ${
                      notification.is_read
                        ? "bg-transparent"
                        : "bg-[var(--color-primary)]"
                    }
                  `}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      truncate
                      text-sm

                      ${
                        notification.is_read
                          ? "font-medium text-[var(--color-text)]"
                          : "font-semibold text-[var(--color-heading)]"
                      }
                    `}
                  >
                    {notification.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-muted)]">
                    {notification.message}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t border-[var(--color-border)] p-3">
          <Link
            href="/dashboard/operations"
            onClick={onClose}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-[var(--radius-md)]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              py-2.5
              text-sm
              font-medium
              transition-colors
              hover:bg-[var(--color-surface-hover)]
            "
          >
            Go To Requests
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}
      </div>
    


    
  );
}