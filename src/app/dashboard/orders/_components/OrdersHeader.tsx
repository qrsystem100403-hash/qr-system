"use client";

import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useDashboardHeader } from "@/app/components/dashboard/header/DashboardHeaderProvider";
import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";

export default function OrdersHeader() {
  const router = useRouter();
  const { setHeader } = useDashboardHeader();

  useEffect(() => {
    setHeader({
      title: "Orders",
      description:
        "Monitor live orders and manage the kitchen workflow.",
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