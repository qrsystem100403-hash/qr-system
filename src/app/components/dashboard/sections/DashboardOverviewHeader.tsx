"use client";

import { useEffect } from "react";
import { useDashboardHeader } from "@/app/components/dashboard/header/DashboardHeaderProvider";

export default function DashboardOverviewHeader() {
  const { setHeader } = useDashboardHeader();

  useEffect(() => {
    setHeader({
      title: "Dashboard",
      description:
        "Monitor your restaurant performance, live operations and business insights.",
    });

    return () => setHeader(null);
  }, [setHeader]);

  return null;
}