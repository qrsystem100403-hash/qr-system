import CustomerInfo from "../shared/CustomerInfo";
import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function CustomerSection({
  order,
}: Props) {
  return (
    <section
      className="
        rounded-[var(--radius-lg)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
      "
    >
      

      <CustomerInfo
        name={order.customer_name}
        phone={order.customer_phone}
      />

      {order.address && (
        <div className="mt-5 border-t border-[var(--color-border)] pt-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">
            Delivery Address
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">
            {order.address}
          </p>

        </div>
      )}
    </section>
  );
}