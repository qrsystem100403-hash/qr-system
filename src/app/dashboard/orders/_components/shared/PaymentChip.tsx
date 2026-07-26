type Props = {
  status: string;
};

export default function PaymentChip({
  status,
}: Props) {
  const paid = status === "paid";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${
          paid
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
        }
      `}
    >
      <span
        className={`
          mr-1.5
          h-1.5
          w-1.5
          rounded-full
          ${
            paid
              ? "bg-emerald-500"
              : "bg-orange-500"
          }
        `}
      />
      {paid ? "Paid" : "Pending"}
    </span>
  );
}