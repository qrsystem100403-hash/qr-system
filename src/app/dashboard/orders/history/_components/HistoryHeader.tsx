"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";
import { useDashboardHeader } from "@/app/components/dashboard/header/DashboardHeaderProvider";

export default function HistoryHeader() {
  const router = useRouter();
  const { setHeader } = useDashboardHeader();

  useEffect(() => {
    setHeader({
      title: "Order History",
      description:
        "Browse completed and cancelled orders with full order details.",
      actions: (
        <DashboardButton
          variant="secondary"
          onClick={() => router.refresh()}
          className="
            h-9
            w-9
            p-0
            lg:h-11
            lg:w-auto
            lg:px-5
          "
        >
          <RefreshCw className="size-4" />
          <span className="hidden lg:inline">
            Refresh
          </span>
        </DashboardButton>
      ),
    });

    return () => setHeader(null);
  }, [router, setHeader]);

  return null;
}