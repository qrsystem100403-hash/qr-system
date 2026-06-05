// src/app/dashboard/DashboardThemeProvider.tsx

"use client"

import { ThemeProvider } from "next-themes"

export default function DashboardThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme={undefined}
      enableSystem={false}
      disableTransitionOnChange
      storageKey="dashboard-theme"
    >
      {children}
    </ThemeProvider>
  )
}