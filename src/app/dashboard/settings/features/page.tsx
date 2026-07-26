import { requireOwnerUser } from "@/lib/requireRestaurantUser";
import RestaurantFeaturesForm from "./RestaurantFeaturesForm";
export default async function FeaturesPage() {
  const { features } =
    await requireOwnerUser();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Settings
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Restaurant Features
        </h1>

        <p className="mt-3 text-[var(--color-text-muted)]">
          Enable or disable modules
          according to how your
          restaurant operates.
        </p>
      </div>

      <RestaurantFeaturesForm
        initialData={features}
      />
    </div>
  );
}