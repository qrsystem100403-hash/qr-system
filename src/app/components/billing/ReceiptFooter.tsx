import type { ReceiptRestaurant } from "./receipt-types";

type Props = {
  restaurant: ReceiptRestaurant;
  showPoweredBy?: boolean;
};

export default function ReceiptFooter({
  showPoweredBy = true,
}: Props) {
  return (
    <footer className="pt-3 text-center">

      <p className="text-[13px] font-black uppercase tracking-[0.18em]">
        Thank You!
      </p>

      <p className="mt-1 text-[10px] text-neutral-600">
        Visit Again
      </p>

      <div className="my-3 border-t border-dashed border-neutral-300" />

      <p className="text-[9px] leading-4 text-neutral-500">
        Computer generated receipt.
        <br />
        Please retain this bill for exchange or refund,
        where applicable.
      </p>

      {/* {showPoweredBy && (
        <>
          <div className="my-3 border-t border-dashed border-neutral-300" />

          <p className="text-[9px] tracking-wide text-neutral-400">
            Powered by{" "}
            <span className="font-semibold text-neutral-600">
              Bevichitra
            </span>
          </p>
        </>
      )} */}

    </footer>
  );
}