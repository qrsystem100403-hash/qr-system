import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import WaiterPageClient from "@/app/components/dashboard/staff/roles/waiter/_components/WaiterPageClient";
export default async function WaiterOrderPage() {
  const { restaurant, supabase } =
    await requireRestaurantUser();

  // TODO:
  // Replace with your workflow config
  // "ready" for Advanced
  // "preparing" for Simple
  const servingStatus = "ready";

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      table_name,
      total,
      created_at,
      payment_status,
      order_status,
      order_items(
        id,
        qty
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", servingStatus)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  const orders = (data ?? []).map(
    (order: any) => ({
      ...order,
      itemCount: (
        order.order_items ?? []
      ).reduce(
        (
          sum: number,
          item: any,
        ) => sum + item.qty,
        0,
      ),
    }),
  );

  return (
    <WaiterPageClient
      restaurantId={restaurant.id}
      initialOrders={orders}
    />
  );
}