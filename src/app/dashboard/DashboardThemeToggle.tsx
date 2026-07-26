"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import DashboardIconButton from "../components/dashboard/ui/DashboardIconButton";

export default function DashboardThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <DashboardIconButton
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <DashboardIconButton
      aria-label="Toggle theme"
      onClick={() =>
        setTheme(isDark ? "light" : "dark")
      }
      className="
        relative
        overflow-hidden
      "
    >
      <Sun
        className={`
          absolute
          size-4
          md:size-5
          transition-all
          duration-300
          ${
            isDark
              ? "rotate-0 scale-100"
              : "rotate-90 scale-0"
          }
        `}
      />

      <Moon
        className={`
          absolute
          size-4
          md:size-5
          transition-all
          duration-300
          ${
            isDark
              ? "-rotate-90 scale-0"
              : "rotate-0 scale-100"
          }
        `}
      />
    </DashboardIconButton>
  );
}