"use client"

import { supabaseBrowser } from "@/lib/supabase/browser"
import { Loader2, LogOut } from "lucide-react"
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
      aria-busy={loading}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#E4DED3] bg-[#FCFAF6] px-3 text-xs font-bold text-[#667085] transition hover:border-[#F3C6C2] hover:bg-[#FDECEC] hover:text-[#B42318] disabled:pointer-events-none disabled:opacity-50 dark:border-[#2A2F35] dark:bg-[#171A1F] dark:text-[#AAB2BD] dark:hover:border-[#5B2A2A] dark:hover:bg-[#2A1A1A] dark:hover:text-[#FCA5A5]"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}

      <span className="hidden sm:inline">
        {loading ? "Logging out..." : "Logout"}
      </span>

      <span className="sm:hidden">{loading ? "..." : "Out"}</span>
    </button>
  )
}