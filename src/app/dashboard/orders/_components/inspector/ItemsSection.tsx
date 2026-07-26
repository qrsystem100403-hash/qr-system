import { Package2, Plus } from "lucide-react";

import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function ItemsSection({ order }: Props) {
  const totalItems = order.order_items.reduce((sum, item) => sum + item.qty, 0);
  return (
    <section
      className="
        rounded-[var(--radius-lg)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--color-border)]
          p-5
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <Package2 className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-heading)]">
              Ordered Items
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              {totalItems} item(s)
            </p>
          </div>
        </div>
      </div>

      {/* Items */}

      <div className="py-5 last:border-none divide-[var(--color-border)]">
        {order.order_items.map((item) => (
          <div key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span
  className="
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-lg
    bg-[var(--color-primary-soft)]
    text-base
    font-bold
    text-[var(--color-primary)]
  "
>
  ×{item.qty}
</span>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-[var(--color-heading)]">
                      {item.item_name}
                    </h3>

                    {item.variant_name && (
                      <span
                        className="
                        inline-flex
                        rounded-full
                        bg-[var(--color-surface-soft)]
                        px-2
                        py-1
                        text-xs
                        font-medium
                        "
                      >
                        {item.variant_name}
                      </span>
                    )}
                  </div>
                </div>

                {item.order_item_addons.length > 0 && (
                  <div className="mt-4 ml-11 space-y-2">
                    {item.order_item_addons.map((addon) => (
                      <div
                        key={addon.id}
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            w-fit
                            text-[var(--color-text-muted)]
                            rounded-lg
bg-[var(--color-surface-soft)]
px-3
py-2
                          "
                      >
                        <Plus className="size-3.5" />

                        <span>{addon.addon_name}</span>

                        <span className="font-medium">
                          ₹{addon.addon_price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 items-center">
  <p
    className="
      text-xl
      font-bold
      text-[var(--color-primary)]
    "
  >
    ₹{(item.item_price * item.qty).toLocaleString()}
  </p>
</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
