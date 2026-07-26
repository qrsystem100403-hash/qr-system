import type {
  Order,
  StatusTabValue,
} from "./order-types";

import OrderCardHeader from "./card/OrderCardHeader";
import OrderCardCustomer from "./card/OrderCardCustomer";
import OrderCardMetrics from "./card/OrderCardMetrics";
import { getCapabilities } from "@/lib/auth/capabilities";
type Props = {
  order: Order;
  selected: boolean;
  activeStatus: StatusTabValue;
  searchQuery: string;
  requiresReadyStage: boolean;
  capabilities: ReturnType<typeof getCapabilities>;

};

export default function OrderCard(props: Props) {
  return (
    <article
  className={`
    flex
    flex-col
    overflow-hidden
    rounded-[var(--radius-xl)]
    border
    bg-[var(--color-surface)]
    transition-all
    duration-200
    ${
      props.selected
        ? `
          border-[var(--color-primary)]
          ring-2
          ring-[var(--color-primary-ring)]
          shadow-[var(--shadow-lg)]
        `
        : `
          border-[var(--color-border)]
          shadow-[var(--shadow-sm)]
          hover:-translate-y-0.5
          hover:border-[var(--color-primary-border)]
          hover:shadow-[var(--shadow-md)]
        `
    }
  `}
>
  <OrderCardHeader
    order={props.order}
    selected={props.selected}
    activeStatus={props.activeStatus}
    searchQuery={props.searchQuery}
  />

  <div className="flex flex-col">
  <OrderCardCustomer order={props.order} />
  <OrderCardMetrics order={props.order} />
</div>
</article>
  );
}