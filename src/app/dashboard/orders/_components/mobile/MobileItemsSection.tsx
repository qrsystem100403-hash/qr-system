"use client";

import { Package2, Plus } from "lucide-react";
import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function MobileItemsSection({
  order,
}: Props) {
  const totalItems = order.order_items.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <section
      className="
        rounded-3xl
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
          px-5
          py-4
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
              rounded-2xl
              bg-[var(--color-primary-soft)]
            "
          >
            <Package2
              className="
                size-5
                text-[var(--color-primary)]
              "
            />
          </div>

          <div>

            <h2 className="font-bold">
              Ordered Items
            </h2>

            <p
              className="
                text-xs
                text-[var(--color-text-muted)]
              "
            >
              {totalItems} items
            </p>

          </div>

        </div>
      </div>

      {/* Items */}

      <div className="divide-y divide-[var(--color-border)]">

        {order.order_items.map((item) => (

          <div
            key={item.id}
            className="p-4"
          >
            <div className="flex justify-between gap-4">

              <div className="min-w-0 flex-1">

                <div className="flex gap-3">

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--color-primary-soft)]
                      font-bold
                      text-[var(--color-primary)]
                    "
                  >
                    ×{item.qty}
                  </div>

                  <div className="min-w-0">

                    <h3
                      className="
                        truncate
                        font-semibold
                      "
                    >
                      {item.item_name}
                    </h3>

                    {item.variant_name && (
                      <p
                        className="
                          mt-1
                          text-xs
                          text-[var(--color-text-muted)]
                        "
                      >
                        {item.variant_name}
                      </p>
                    )}

                  </div>

                </div>

                {item.order_item_addons.length >
                  0 && (
                  <div
                    className="
                      mt-3
                      ml-12
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {item.order_item_addons.map(
                      (addon) => (
                        <span
                          key={addon.id}
                          className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            bg-[var(--color-surface-soft)]
                            px-3
                            py-1
                            text-xs
                          "
                        >
                          <Plus className="size-3" />

                          {addon.addon_name}
                        </span>
                      )
                    )}
                  </div>
                )}

              </div>

              <div className="shrink-0">

                <p
                  className="
                    text-lg
                    font-bold
                    text-[var(--color-primary)]
                  "
                >
                  ₹
                  {(
                    item.item_price *
                    item.qty
                  ).toFixed(0)}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>
    </section>
  );
}