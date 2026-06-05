// src/app/dashboard/DashboardThemeToggle.tsx

"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function DashboardThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className="grid size-10 place-items-center rounded-xl border border-[#E4DED3] bg-[#FCFAF6]"
        aria-label="Toggle theme"
      />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-xl border border-[#E4DED3] bg-[#FCFAF6] text-[#667085] transition hover:bg-[#F8F5EF] hover:text-[#2F7D57] dark:border-[#2A2F35] dark:bg-[#171A1F] dark:text-[#AAB2BD] dark:hover:bg-[#20242A] dark:hover:text-[#7BC99A]"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}