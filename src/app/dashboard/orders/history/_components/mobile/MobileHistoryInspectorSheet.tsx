"use client";

import DashboardBottomSheet from "@/app/components/dashboard/mobile/DashboardBottomSheet";

import type { Order } from "../../../_components/order-types";

import MobileInspectorHeader from "../../../_components/mobile/MobileInspectorHeader";
import MobileCustomerSection from "../../../_components/mobile/MobileCustomerSection";
import MobileItemsSection from "../../../_components/mobile/MobileItemsSection";
import MobileSummarySection from "../../../_components/mobile/MobileSummarySection";
import NotesSection from "../../../_components/inspector/NotesSection";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
};

export default function MobileHistoryInspectorSheet({
  open,
  onOpenChange,
  order,
}: Props) {
  if (!order) return null;

  return (
    <DashboardBottomSheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <div
        className="
          flex
          max-h-[90dvh]
          flex-col
        "
      >
        <div
          className="
            flex-1
            space-y-5
            p-5
            pb-8
          "
        >
          <MobileInspectorHeader
            order={order}
          />

          <MobileCustomerSection
            order={order}
          />

          <MobileItemsSection
            order={order}
          />

          <MobileSummarySection
            order={order}
          />

          <NotesSection
            order={order}
          />
        </div>
      </div>
    </DashboardBottomSheet>
  );
}