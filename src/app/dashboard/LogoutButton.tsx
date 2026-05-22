"use client"

import { supabaseBrowser } from "@/lib/supabase/browser"
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (loading) return

    setLoading(true)

    try {
      await supabaseBrowser.auth.signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("LOGOUT ERROR:", error)
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-red-200 transition hover:border-red-500/40 hover:bg-red-500/15 disabled:pointer-events-none disabled:opacity-50"
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">
        {loading ? "Logging out..." : "Logout"}
      </span>
      <span className="sm:hidden">
        {loading ? "..." : "Out"}
      </span>
    </button>
  )
}