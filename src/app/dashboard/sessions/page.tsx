import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import SessionsPageClient from "./_components/SessionsPageClient";
import { getActiveSessions } from "@/modules/sessions/services/getActiveSessions";

export default async function SessionsPage() {
  const { restaurant, supabase } =
    await requireRestaurantUser();

  const sessions =
    await getActiveSessions(
      supabase,
      restaurant.id,
    );

  return (
    <SessionsPageClient
      restaurantId={restaurant.id}
      initialSessions={sessions}
    />
  );
}