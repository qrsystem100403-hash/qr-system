import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

export async function GET() {
  try {
    const {
      restaurant,
      supabase,
    } = await requireRestaurantUser();

    // Will be replaced by workflow logic later.
    const servingStatus = "ready";

    const { data, error } =
      await supabase
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
        .eq(
          "restaurant_id",
          restaurant.id,
        )
        .eq(
          "order_status",
          servingStatus,
        )
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      logger.error({
        message:
          "Failed to load waiter orders",
        error,
        context: {
          module: "waiter",
          action: "getReadyOrders",
          restaurantId:
            restaurant.id,
        },
      });

      return fail(error);
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

    return ok({ orders });
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while loading waiter orders",
      error,
      context: {
        module: "waiter",
        action: "getReadyOrders",
      },
    });

    return fail(error);
  }
}