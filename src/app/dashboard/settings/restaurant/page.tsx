import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import RestaurantProfileForm from "./RestaurantProfileForm";

export default async function RestaurantProfilePage() {
  const { restaurant } =
    await requireRestaurantUser();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Settings
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Restaurant Profile
        </h1>

        <p className="mt-3 text-[var(--color-text-muted)]">
          Manage your restaurant branding,
          business information and logo.
        </p>
      </div>

      <RestaurantProfileForm
        restaurant={restaurant}
      />
    </div>
  );
}