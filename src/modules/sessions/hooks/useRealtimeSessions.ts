"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Props = {
  restaurantId: string;
  refresh: () => void;
};

export function useRealtimeSessions({
  restaurantId,
  refresh,
}: Props) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleRefresh = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        refresh();
      }, 250);
    };

    const channel = supabaseClient
      .channel(`sessions-${restaurantId}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_sessions",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        scheduleRefresh,
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        scheduleRefresh,
      )

      .subscribe();

    return () => {
      clearTimeout(timer);
      supabaseClient.removeChannel(channel);
    };
  }, [restaurantId, refresh]);
}