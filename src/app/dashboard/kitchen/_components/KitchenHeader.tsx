import { ChefHat } from "lucide-react";

export default function KitchenHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Kitchen
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Kitchen Display
        </h1>

        <p className="mt-2 text-[var(--color-text-muted)]">
          Monitor incoming orders and update cooking status in real time.
        </p>
      </div>

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-[var(--color-primary-soft)]
        "
      >
        <ChefHat className="h-7 w-7 text-[var(--color-primary)]" />
      </div>
      </div>
    );
}