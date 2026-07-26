"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AccountStatusWatcher({
  userId,
}: {
  userId: string;
}) {
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`user-status-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        async (payload) => {
          const row = payload.new as {
            is_active: boolean;
          };

          if (!row.is_active) {
            await supabaseBrowser.auth.signOut();

            window.location.href =
              "/login?error=account_disabled";
          }
        },
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [userId]);

  return null;
}