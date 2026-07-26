import type { Order } from "../order-types";

import InspectorHeader from "./InspectorHeader";
import CustomerSection from "./CustomerSection";
import ItemsSection from "./ItemsSection";
import SummarySection from "./SummarySection";
import NotesSection from "./NotesSection";
import WorkflowSection from "./WorkflowSection";
import { getCapabilities } from "@/lib/auth/capabilities";

type Props = {
  order: Order;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;

};

export default function OrderInspector({
  order,
  requiresReadyStage,
  capabilities,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden">

      <InspectorHeader
        order={order}
      />

      <div
  className="
    flex-1
    overflow-y-auto
  "
>
  <div
    className="
      space-y-6
      p-6
    "
  >

        <CustomerSection
          order={order}
        />

        <ItemsSection
          order={order}
        />

        <SummarySection
          order={order}
        />

        <NotesSection
          order={order}
        />

      </div>
      </div>

      <WorkflowSection
  order={order}
  requiresReadyStage={requiresReadyStage}
  capabilities={capabilities}
/>

    </div>
    
  );
}