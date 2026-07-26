type Props = {
  status:
    | "available"
    | "occupied"
    | "bill_requested";
};

const styles = {
  available:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",

  occupied:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",

  bill_requested:
    "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

const labels = {
  available: "Available",

  occupied: "Occupied",

  bill_requested: "Bill Requested",
};

export default function TableStatusChip({
  status,
}: Props) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1

        text-xs
        font-semibold

        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}