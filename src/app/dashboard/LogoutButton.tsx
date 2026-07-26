"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      await supabaseBrowser.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-busy={loading}
      className="
        group
        inline-flex
        h-11
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4
        text-sm
        font-semibold
        text-[var(--color-text)]
        shadow-[var(--shadow-xs)]
        transition-all
        duration-200
        hover:border-red-300
        hover:bg-red-50
        hover:text-red-600
        hover:shadow-[var(--shadow-sm)]
        active:scale-[0.98]
        disabled:pointer-events-none
        disabled:opacity-50
        dark:hover:border-red-900/40
        dark:hover:bg-red-500/10
        dark:hover:text-red-400
      "
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut
          className="
            size-4
            transition-transform
            duration-200
            group-hover:-translate-x-0.5
          "
        />
      )}

      <span className="hidden sm:block">
        {loading ? "Signing Out..." : "Logout"}
      </span>
    </button>
  );
}