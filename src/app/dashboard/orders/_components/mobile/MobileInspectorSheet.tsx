"use client";

import DashboardBottomSheet from "@/app/components/dashboard/mobile/DashboardBottomSheet";

import InspectorHeader from "../inspector/InspectorHeader";
import CustomerSection from "../inspector/CustomerSection";
import ItemsSection from "../inspector/ItemsSection";
import NotesSection from "../inspector/NotesSection";
import SummarySection from "../inspector/SummarySection";
import MobileActionBar from "./MobileActionBar";

import type { Order } from "../order-types";

import { getCapabilities } from "@/lib/auth/capabilities";
import MobileInspectorHeader from "./MobileInspectorHeader";
import MobileItemsSection from "./MobileItemsSection";
import MobileCustomerSection from "./MobileCustomerSection";
import MobileSummarySection from "./MobileSummarySection";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;
};

export default function MobileInspectorSheet({
  open,
  onOpenChange,
  order,
  requiresReadyStage,
  capabilities,
}: Props) {
  if (!order) return null;

  return (
    <DashboardBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title=""
    >
      <div
        className="
          flex
          max-h-[95dvh]
          flex-col
        "
      >
        <div
          className="
            flex-1
            space-y-5
            overflow-y-auto
            p-5
            pb-32
          "
        >
          <MobileInspectorHeader order={order} />

          <MobileCustomerSection order={order} />

          <MobileItemsSection order={order} />

          <NotesSection order={order} />

          <MobileSummarySection order={order} />
        </div>

        <MobileActionBar
  order={order}
  requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
  onSuccess={() => onOpenChange(false)}
/>
      </div>
    </DashboardBottomSheet>
  );
}