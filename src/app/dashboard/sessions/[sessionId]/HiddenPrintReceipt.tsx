"use client";

import RestaurantReceipt from "@/app/components/billing/RestaurantReceipt";
import type {
  ReceiptRestaurant,
  ReceiptItem,
  ReceiptSettings,
} from "@/app/components/billing/receipt-types";

type Props = {
  restaurant: ReceiptRestaurant;
  items: ReceiptItem[];
  settings: ReceiptSettings;
  totals: {
    subtotal: number;
    gstAmount: number;
    serviceChargeAmount: number;
    roundOff: number;
    grandTotal: number;
  };
  bill: {
    number: string;
    table: string;
    cashier: string;
    date: string;
    time: string;
  };
};

export default function HiddenPrintReceipt({
  restaurant,
  items,
  settings,
  totals,
  bill,
}: Props) {
  return (
    <div
      id="receipt-print"
      style={{
        position: "fixed",
        left: "-99999px",
        top: 0,
        width: "80mm",
        zIndex: -1,
      }}
    >
      <RestaurantReceipt
        restaurant={restaurant}
        items={items}
        settings={settings}
        totals={totals}
        bill={bill}
        mode="print"
      />
    </div>
  );
}