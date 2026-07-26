type Props = {
  billNo: string;
  table: string;
  date: string;
  time: string;
  cashier: string;
};

export default function ReceiptInfo({
  billNo,
  date,
  time,
  table,
  cashier,
}: Props) {
  return (
    <div className="my-3 border-y border-dashed border-neutral-300 py-3 space-y-1.5 text-[11px]">
  <InfoRow label="Bill No." value={billNo} />
  <InfoRow label="Table" value={table} />


  <InfoRow label="Date" value={date} />
  <InfoRow label="Time" value={time} />
  <InfoRow label="Cashier" value={cashier} />
</div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex text-[11px] leading-5">
      <span className="w-20 font-medium text-neutral-600">
        {label}
      </span>

      <span className="mr-2">:</span>

      <span className="flex-1 font-semibold text-black break-words">
        {value}
      </span>
    </div>
  );
}