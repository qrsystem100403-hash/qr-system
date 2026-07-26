import { ChefHat } from "lucide-react";

export default function KitchenEmptyState() {
  return (
    <div
      className="
        flex
        h-48
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-[var(--color-border)]
      "
    >
      <ChefHat className="h-10 w-10 text-[var(--color-text-soft)]" />

      <p className="mt-4 font-semibold">
        No Orders
      </p>

      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Everything is up to date.
      </p>
    </div>
  );
}