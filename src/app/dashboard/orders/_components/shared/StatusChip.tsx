type Props = {
  status:
    | "pending"
    | "preparing"
    | "ready"
    | "served"
    | "cancelled";
};

const styles = {
  pending:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  preparing:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  ready:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  served:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  cancelled:
    "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300",
};

const dots = {
  pending: "bg-red-500",
  preparing: "bg-orange-500",
  ready: "bg-emerald-500",
  served: "bg-blue-500",
  cancelled: "bg-slate-500",
};

const labels = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  cancelled: "Cancelled",
};

export default function StatusChip({
  status,
}: Props) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${styles[status]}
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${dots[status]}
        `}
      />

      {labels[status]}
    </span>
  );
}