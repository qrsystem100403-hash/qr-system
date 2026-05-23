"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellRing, Loader2, Volume2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Props = {
  restaurantId: string;
};

export default function OrdersRealtime({ restaurantId }: Props) {
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showNewOrderNotice, setShowNewOrderNotice] = useState(false);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    const audio = new Audio("/sounds/new-order.mp3");
    audio.volume = 1;
    audio.preload = "auto";
    audioRef.current = audio;

    const savedSound = localStorage.getItem("orders-sound-enabled") === "true";
    const savedNotification =
      localStorage.getItem("orders-notification-enabled") === "true";

    setSoundEnabled(savedSound);

    if (
      savedNotification &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      setNotificationEnabled(true);
    }
  }, []);

  const enableSound = async () => {
    try {
      if (!audioRef.current) return;

      audioRef.current.currentTime = 0;
      await audioRef.current.play();

      localStorage.setItem("orders-sound-enabled", "true");
      setSoundEnabled(true);
    } catch (error) {
      console.error("SOUND ENABLE ERROR:", error);
      alert("Tap again to enable sound. Browser blocked autoplay.");
    }
  };

  const playSound = useCallback(async () => {
    if (!soundEnabled || !audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (error) {
      console.error("PLAY SOUND ERROR:", error);
      setSoundEnabled(false);
      localStorage.removeItem("orders-sound-enabled");
    }
  }, [soundEnabled]);

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported here.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      localStorage.setItem("orders-notification-enabled", "true");
      setNotificationEnabled(true);
    } else {
      localStorage.removeItem("orders-notification-enabled");
      setNotificationEnabled(false);
      alert("Notification permission was blocked.");
    }
  };

  const showBrowserNotification = () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    new Notification("New order received", {
      body: "A new table order has been placed.",
      icon: "/favicon.ico",
      tag: `new-order-${Date.now()}`,
    });
  };

  const refreshOrders = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      router.refresh();
    }, 300);
  }, [router]);

  const showNotice = () => {
    setShowNewOrderNotice(true);

    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = setTimeout(() => {
      setShowNewOrderNotice(false);
    }, 4500);
  };

  const handleNewOrder = useCallback(async () => {
    showNotice();
    showBrowserNotification();
    await playSound();
    refreshOrders();
  }, [playSound, refreshOrders]);

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
          handleNewOrder();
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
          refreshOrders();
        }
      )
      .subscribe((status) => {
        console.log("ORDERS REALTIME STATUS:", status);
        setConnecting(status !== "SUBSCRIBED");
      });

    const handleFocus = () => refreshOrders();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshOrders();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);

      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);

      supabaseBrowser.removeChannel(channel);
    };
  }, [restaurantId, handleNewOrder, refreshOrders]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {!soundEnabled && (
          <button
            type="button"
            onClick={enableSound}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold)]"
          >
            <Volume2 className="size-4" />
            Enable Sound
          </button>
        )}

        {!notificationEnabled && (
          <button
            type="button"
            onClick={enableNotifications}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
          >
            <Bell className="size-4" />
            Enable Notifications
          </button>
        )}

        {connecting && (
          <span className="inline-flex h-10 items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-3 text-xs font-bold text-yellow-200">
            <Loader2 className="size-4 animate-spin" />
            Connecting live orders
          </span>
        )}
      </div>

      {showNewOrderNotice && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">
          <BellRing className="size-5" />
          New order received
        </div>
      )}
    </>
  );
}