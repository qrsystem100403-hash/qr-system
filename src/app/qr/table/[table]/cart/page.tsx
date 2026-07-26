import { notFound } from "next/navigation";
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";
import { supabaseAdmin } from "@/lib/supabase/admin";
import QRCartClient from "@/modules/qr-ordering/components/QRCartClient";

type Props = {
  params: Promise<{
    table: string;
  }>;
};

export default async function QRCartPage({
  params,
}: Props) {
  const { table: tableToken } = await params;

  const resolved = await resolvePublicRestaurant();

if (!resolved) {
  notFound();
}

const { restaurant, features } = resolved;

  const { data: restaurantTable } = await supabaseAdmin
    .from("restaurant_tables")
    .select("id,name,qr_token,is_active")
    .eq("restaurant_id", restaurant.id)
    .eq("qr_token", tableToken)
    .single();

  if (!restaurantTable) {
    notFound();
  }

  // NEW
  const { data: billingSettings, error } = await supabaseAdmin
  .from("restaurant_billing_settings")
  .select(`
    gst_enabled,
    gst_mode,
    gst_percent,
    service_charge_enabled,
    service_charge_type,
    service_charge_value,
    round_off_enabled
  `)
  .eq("restaurant_id", restaurant.id)
  .maybeSingle();

console.log("Restaurant ID:", restaurant.id);
console.log("Billing Settings:", billingSettings);
console.log("Billing Error:", error);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRCartClient
        table={restaurantTable.name}
        tableToken={restaurantTable.qr_token}
        restaurantId={restaurant.id}
        billingSettings={
          billingSettings ?? {
            gst_enabled: false,
            gst_mode: "exclusive",
            gst_percent: 0,
            service_charge_enabled: false,
            service_charge_type: "percentage",
            service_charge_value: 0,
            round_off_enabled: true,
          }
        }
      />
    </main>
  );
}