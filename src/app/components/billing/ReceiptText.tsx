type Props = {
  left: string;
  right: string;
  bold?: boolean;
};

export default function ReceiptText({
  left,
  right,
  bold,
}: Props) {
  return (
    <div className="flex justify-between py-1">
      <span
        className={
          bold
            ? "font-semibold"
            : "text-gray-600"
        }
      >
        {left}
      </span>

      <span
        className={
          bold
            ? "font-semibold"
            : ""
        }
      >
        {right}
      </span>
    </div>
  );
}