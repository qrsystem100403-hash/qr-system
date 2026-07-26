import React from 'react'
import DashboardBottomSheet from '../mobile/DashboardBottomSheet';
import { Bell } from "lucide-react";
import Link from "next/link";

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
  notifications: Notification[];
  onClose: () => void;
  onRead: (id: string) => void;
};

export default function NotificationBottomSheet({
  open,
  loading,
  notifications,
  onClose,
  onRead,
}: Props) {
  return (
    
      <DashboardBottomSheet
        open={open}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
        title="Notifications"
      >
    {loading ? (
      <div className="py-10 text-center text-[var(--color-text-muted)]">
        Loading...
      </div>
    ) : notifications.length === 0 ? (
      <div className="flex flex-col items-center py-10">
        <Bell className="size-10 text-[var(--color-text-soft)]" />

        <h3 className="mt-4 font-semibold text-[var(--color-heading)]">
          You're all caught up
        </h3>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          No notifications available.
        </p>
      </div>
    ) : (
      <div className="max-h-[60vh] space-y-2 overflow-y-auto dashboard-scrollbar">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => {
  onRead(notification.id);
  onClose();
}}
            className="
              flex
              w-full
              items-start
              gap-4
              rounded-2xl
              p-4
              transition
              hover:bg-[var(--color-surface-hover)]
            "
          >
            <div
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

            <div className="flex-1 text-left">
              <h4 className="font-semibold text-[var(--color-heading)]">
                {notification.title}
              </h4>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {notification.message}
              </p>
            </div>
          </button>
        ))}
      </div>
    )}

    {notifications.length > 0 && (
      <Link
  href="/dashboard/operations"
  onClick={onClose}
  className="
    mt-6
    flex
    h-11
    items-center
    justify-center
    rounded-xl
    bg-[var(--color-primary)]
    font-medium
    text-white
  "
>
  Go To Requests
  <div className="h-2" />
</Link>

    )}
  </DashboardBottomSheet>
    
  )
}
