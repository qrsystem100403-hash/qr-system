import type { ReceiptItem } from "./receipt-types";

type Props = {
  items: ReceiptItem[];
};

export default function ReceiptItems({
  items,
}: Props) {
  return (
    <section className="my-4">

      {/* Heading */}

      <div className="mb-3 flex items-center justify-between border-b border-dashed border-neutral-300 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">

        <span>Items</span>

        <span>Amount</span>

      </div>

      <div className="space-y-3">

        {items.map((item) => (
          <ReceiptItemRow
            key={item.id}
            item={item}
          />
        ))}

      </div>

    </section>
  );
}

function ReceiptItemRow({
  item,
}: {
  item: ReceiptItem;
}) {
  return (
    <div>

      {/* Item */}

      <div className="flex items-start gap-3">

        <div className="min-w-0 flex-1">

          <p className="break-words text-[12px] font-semibold leading-5 text-black">
            {item.qty} × {item.name}
          </p>

          {item.variant && (
            <p className="mt-0.5 pl-4 text-[10px] leading-4 text-neutral-500">
              • {item.variant}
            </p>
          )}

          {item.addons &&
            item.addons.length > 0 && (
              <div className="mt-1 space-y-0.5 pl-4">
                {item.addons.map(
                  (addon) => (
                    <p
                      key={addon.id}
                      className="text-[10px] leading-4 text-neutral-500"
                    >
                      + {addon.name}
                    </p>
                  )
                )}
              </div>
            )}

          {item.note && (
            <p className="mt-1 rounded bg-neutral-100 px-2 py-1 text-[9px] italic leading-4 text-neutral-600">
              Note: {item.note}
            </p>
          )}

        </div>

        <div className="shrink-0 text-right">

          <p className="text-[12px] font-bold text-black">
            ₹{item.totalPrice.toFixed(2)}
          </p>

        </div>

      </div>

    </div>
  );
}