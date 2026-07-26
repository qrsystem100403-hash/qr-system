type Props = {
  role: "manager" | "cashier" | "kitchen" | "waiter";
};

const styles = {
  manager: {
    label: "Manager",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  cashier: {
    label: "Cashier",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
  kitchen: {
    label: "Kitchen",
    className:
      "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  },
  waiter: {
    label: "Waiter",
    className:
      "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  },
} as const;

export default function StaffRoleBadge({
  role,
}: Props) {
    console.log("Staff role:", role);
  const badge = styles[role];

  return (
    <span
      className={`
inline-flex
items-center
rounded-full
border
px-3
py-1
text-xs
font-semibold
${badge.className}
`}
    >
      {badge.label}
    </span>
  );
}