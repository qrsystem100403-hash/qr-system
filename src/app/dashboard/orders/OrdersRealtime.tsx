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
  const unlockedRef = useRef(false);

  const [soundPreferred, setSoundPreferred] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showNewOrderNotice, setShowNewOrderNotice] = useState(false);
  const [connecting, setConnecting] = useState(true);

  const unlockSound = useCallback(async () => {
    if (unlockedRef.current) return;

    try {
      const audio = audioRef.current;
      if (!audio) return;

      audio.muted = true;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;

      unlockedRef.current = true;

      localStorage.setItem("orders-sound-enabled", "true");
      setSoundPreferred(true);
      setSoundEnabled(true);
    } catch {
      unlockedRef.current = false;
    }
  }, []);

  useEffect(() => {
    const audio = new Audio("/sounds/new-order.mp3");
    audio.volume = 1;
    audio.preload = "auto";
    audioRef.current = audio;

    const savedSound = localStorage.getItem("orders-sound-enabled") === "true";
    const savedNotification =
      localStorage.getItem("orders-notification-enabled") === "true";

    setSoundPreferred(savedSound);
    setSoundEnabled(savedSound);

    if (
      savedNotification &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      setNotificationEnabled(true);
    }

    const handleFirstInteraction = () => {
      if (savedSound) {
        unlockSound();
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [unlockSound]);

  const enableSound = async () => {
    localStorage.setItem("orders-sound-enabled", "true");
    setSoundPreferred(true);
    setSoundEnabled(true);

    await unlockSound();

    if (!unlockedRef.current) {
      alert("Sound preference saved. Tap anywhere on this page once to unlock sound.");
    }
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported here.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setNotificationEnabled(true);
      localStorage.setItem("orders-notification-enabled", "true");
    } else {
      setNotificationEnabled(false);
      localStorage.removeItem("orders-notification-enabled");
      alert("Notification permission was blocked.");
    }
  };

  const playSound = async () => {
    if (!soundPreferred || !audioRef.current) return;

    try {
      if (!unlockedRef.current) {
        await unlockSound();
      }

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      await audioRef.current.play();

      setSoundEnabled(true);
    } catch (error) {
      console.error("PLAY SOUND ERROR:", error);
      setSoundEnabled(false);
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

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    let noticeTimer: ReturnType<typeof setTimeout> | null = null;

    const refreshOrders = () => {
      if (refreshTimer) clearTimeout(refreshTimer);

      refreshTimer = setTimeout(() => {
        router.refresh();
      }, 250);
    };

    const showNotice = () => {
      setShowNewOrderNotice(true);

      if (noticeTimer) clearTimeout(noticeTimer);

      noticeTimer = setTimeout(() => {
        setShowNewOrderNotice(false);
      }, 4500);
    };

    const handleNewOrder = async () => {
      showNotice();
      showBrowserNotification();
      await playSound();
      refreshOrders();
    };

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
        handleNewOrder
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        refreshOrders
      )
      .subscribe((status) => {
        setConnecting(status !== "SUBSCRIBED");
      });

    const handleFocus = () => {
      router.refresh();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (noticeTimer) clearTimeout(noticeTimer);

      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);

      supabaseBrowser.removeChannel(channel);
    };
  }, [restaurantId, router, soundPreferred, unlockSound]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {!soundPreferred && (
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

        {soundPreferred && !soundEnabled && (
          <span className="inline-flex h-10 items-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-3 text-xs font-bold text-yellow-200">
            Tap once to unlock sound
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