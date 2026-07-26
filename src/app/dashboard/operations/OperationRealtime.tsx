"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Props = {
  restaurantId: string;
};

export default function OperationsRealtime({
  restaurantId,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`operations-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Operations realtime subscription failed.");
        }

        if (status === "TIMED_OUT") {
          console.warn("Operations realtime subscription timed out.");
        }
      });

    return () => {
      void supabaseBrowser.removeChannel(channel);
    };
  }, [restaurantId, router]);

  return null;
}