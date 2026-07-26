import { notFound } from "next/navigation";

import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

import { getReceiptData } from "@/modules/receipt/services/getReceiptData";

import SessionOrders from "./SessionOrders";
import PaymentActions from "./PaymentActions";
import CashierBillSummary from "./CashierBillSummary";
import HiddenPrintReceipt from "./HiddenPrintReceipt";
import "./print/print.css"

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function SessionBillingPage({
  params,
}: Props) {
  const { sessionId } = await params;

  const { restaurant, supabase } =
    await requireRestaurantUser();

  let receipt;

  try {
    receipt = await getReceiptData(
      supabase,
      restaurant.id,
      sessionId
    );
  } catch {
    notFound();
  }

  const {
  session,
  orders,
  receiptRestaurant,
  receiptSettings,
  receiptTotals,
  receiptBill,
  items,
} = receipt;

  return (
  <div className="mx-auto
w-full
px-6 space-y-6 px-4 mb-2 md:mb-0">


    <div className="
grid
gap-6
xl:grid-cols-[1fr_1fr_340px]
">

      {/* Orders */}

      <div className="min-w-0">
        <SessionOrders
          orders={orders}
        />
      </div>

      {/* Receipt Preview */}

      <div className="xl:sticky xl:top-6 xl:self-start">

        <CashierBillSummary
  totals={receiptTotals}
  orders={orders}
/>

      </div>

      {/* Payment */}

      <div className="xl:sticky xl:top-6 xl:self-start">

        <PaymentActions
          session={session}
        />

      </div>

    </div>
    <HiddenPrintReceipt
  restaurant={receiptRestaurant}
  items={items}
  settings={receiptSettings}
  totals={receiptTotals}
  bill={receiptBill}
/>

  </div>
);
}