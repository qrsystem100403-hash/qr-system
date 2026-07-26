import ReceiptHeader from "./ReceiptHeader";
import ReceiptInfo from "./ReceiptInfo";
import ReceiptItems from "./ReceiptItems";
import ReceiptSummary from "./ReceiptSummary";
import ReceiptFooter from "./ReceiptFooter";
import ReceiptDivider from "./ReceiptDivider";

import type {
  ReceiptRestaurant,
  ReceiptItem,
  ReceiptSettings,
} from "./receipt-types";

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
  mode?: "preview" | "cashier" | "print" | "pdf";
};

export default function RestaurantReceipt({
  restaurant,
  items,
  settings,
  totals,
  bill,
  mode = "preview",
}: Props) {
  const thermal =
    mode === "print" || mode === "pdf";

    

  return (
    <div
      className={`
        relative
        mx-auto
        overflow-hidden
        bg-white
        text-black
        border
        border-neutral-300
        shadow-2xl
        print:shadow-none
        print:border-0
        ${
          thermal
            ? "w-[80mm] rounded-none"
            : "w-full max-w-[430px] rounded-2xl"
        }
      `}
    >
      

    

      {/* RECEIPT */}

      <div
  className={`
    ${thermal ? "px-3 py-4" : "px-6 py-6"}
  `}
>

        <ReceiptHeader
          restaurant={restaurant}
        />

        

        <ReceiptInfo
          billNo={bill.number}
          table={bill.table}
          cashier={bill.cashier}
          date={bill.date}
          time={bill.time}
        />


        <ReceiptItems
          items={items}
        />


        <ReceiptSummary
          settings={settings}
          totals={totals}
        />


        <ReceiptFooter
          restaurant={restaurant}
        />

      </div>
    </div>
  );
}