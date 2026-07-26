"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Props = {
  sessionId: string;
  onUpdate: () => void;
};

export default function SessionRealtime({
  sessionId,
  onUpdate,
}: Props) {
  useEffect(() => {
    const channel = supabaseClient
      .channel(`session-${sessionId}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `session_id=eq.${sessionId}`,
        },
        onUpdate
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_sessions",
          filter: `id=eq.${sessionId}`,
        },
        onUpdate
      )

      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [sessionId, onUpdate]);

  return null;
}