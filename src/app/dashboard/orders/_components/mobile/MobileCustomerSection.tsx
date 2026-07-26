"use client";

import {
  MapPin,
  Phone,
  User2,
} from "lucide-react";

import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function MobileCustomerSection({
  order,
}: Props) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
      "
    >
      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-[var(--color-primary-soft)]
          "
        >
          <User2
            className="
              size-6
              text-[var(--color-primary)]
            "
          />
        </div>

        <div className="min-w-0 flex-1">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-[var(--color-text-soft)]
            "
          >
            Customer
          </p>

          <h3
            className="
              truncate
              text-lg
              font-bold
              text-[var(--color-heading)]
            "
          >
            {order.customer_name ??
              "Walk-in Customer"}
          </h3>

        </div>

      </div>

      {(order.customer_phone ||
        order.address) && (
        <div
          className="
            mt-5
            space-y-3
            border-t
            border-[var(--color-border)]
            pt-4
          "
        >

          {order.customer_phone && (
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-surface-soft)]
                "
              >
                <Phone className="size-4" />
              </div>

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                {order.customer_phone}
              </span>
            </div>
          )}

          {order.address && (
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <div
                className="
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-surface-soft)]
                "
              >
                <MapPin className="size-4" />
              </div>

              <p
                className="
                  text-sm
                  leading-6
                  text-[var(--color-text-muted)]
                "
              >
                {order.address}
              </p>

            </div>
          )}

        </div>
      )}
    </section>
  );
}