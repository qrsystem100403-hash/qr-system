"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DashboardHeaderState = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

type DashboardHeaderContextValue = {
  header: DashboardHeaderState | null;
  setHeader: (header: DashboardHeaderState | null) => void;
};

const DashboardHeaderContext =
  createContext<DashboardHeaderContextValue | null>(null);

export function DashboardHeaderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [header, setHeader] =
    useState<DashboardHeaderState | null>(null);

  const value = useMemo(
    () => ({
      header,
      setHeader,
    }),
    [header]
  );

  return (
    <DashboardHeaderContext.Provider value={value}>
      {children}
    </DashboardHeaderContext.Provider>
  );
}

export function useDashboardHeader() {
  const context = useContext(DashboardHeaderContext);

  if (!context) {
    throw new Error(
      "useDashboardHeader must be used inside DashboardHeaderProvider"
    );
  }

  return context;
}