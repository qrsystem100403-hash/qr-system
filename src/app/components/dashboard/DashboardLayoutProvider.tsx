"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SidebarMode =
  | "expanded"
  | "hidden";

type ContextValue = {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  toggleSidebar: () => void;
};

const DashboardLayoutContext =
  createContext<ContextValue | null>(null);

export function DashboardLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarMode, setSidebarMode] =
    useState<SidebarMode>("expanded");

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "dashboard-sidebar-mode",
      ) as SidebarMode | null;

    if (saved) {
      setSidebarMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "dashboard-sidebar-mode",
      sidebarMode,
    );
  }, [sidebarMode]);

  function toggleSidebar() {
  setSidebarMode((mode) =>
    mode === "expanded"
      ? "hidden"
      : "expanded",
  );
}

  const value = useMemo(
    () => ({
      sidebarMode,
      setSidebarMode,
      toggleSidebar,
    }),
    [sidebarMode],
  );

  return (
    <DashboardLayoutContext.Provider
      value={value}
    >
      {children}
    </DashboardLayoutContext.Provider>
  );
}

export function useDashboardLayout() {
  const context = useContext(
    DashboardLayoutContext,
  );

  if (!context) {
    throw new Error(
      "DashboardLayoutProvider missing",
    );
  }

  return context;
}