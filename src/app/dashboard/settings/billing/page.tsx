import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import BillingSettingsForm from "./BillingSettingsForm";

export default async function BillingSettingsPage() {
  const { restaurant, supabase } =
    await requireRestaurantUser();

  const { data: settings } =
    await supabase
      .from("restaurant_billing_settings")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .single();

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Settings
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Billing & Taxes
        </h1>

        <p className="mt-3 text-[var(--color-text-muted)]">
          Configure GST, service charge and
          billing preferences for your restaurant.
        </p>

      </div>

      <BillingSettingsForm
  initialData={settings}
  restaurant={restaurant}
/>

    </div>
  );
}