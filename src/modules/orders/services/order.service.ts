import { OrderRepository } from "../repositories/order.repository";
import type {
  Order,
  StatusTabValue,
} from "@/app/dashboard/orders/_components/order-types";

export class OrderService {

    private readonly repository =
  new OrderRepository();

 private async getRestaurantOrders(
  restaurantId: string,
) {
  return (await this.repository.getRestaurantOrders(
    restaurantId,
  )) as Order[];
}

async getDashboardData(
  restaurantId: string,
  status: StatusTabValue,
  search: string,
  selectedId?: string,
) {
  const allOrders =
    await this.getRestaurantOrders(
      restaurantId,
    );

  const orders =
    this.filterOrders(
      allOrders,
      status,
      search,
    );

  const selectedOrder =
    this.getSelectedOrder(
      orders,
      selectedId,
    );

  const counts =
    this.getCounts(allOrders);

  const revenue =
    this.getTodayRevenue(
      allOrders,
    );

  return {
    allOrders,
    orders,
    selectedOrder,
    counts,
    revenue,
  };
}

  filterOrders(
    orders: Order[],
    status: StatusTabValue,
    search: string,
  ) {
    let filtered = [...orders];

    if (status !== "all") {
      filtered = filtered.filter(
        (order) =>
          order.order_status === status,
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      filtered = filtered.filter(
        (order) =>
          order.tracking_token
            ?.toLowerCase()
            .includes(q) ||
          order.table_name
            ?.toLowerCase()
            .includes(q) ||
          order.customer_name
            ?.toLowerCase()
            .includes(q) ||
          order.customer_phone
            ?.toLowerCase()
            .includes(q),
      );
    }

    return filtered;
  }

  getSelectedOrder(
    orders: Order[],
    selectedId?: string,
  ) {
    return (
      orders.find(
        (o) => o.id === selectedId,
      ) ??
      orders[0] ??
      null
    );
  }

  getCounts(orders: Order[]) {
    return {
      pending: orders.filter(
        (o) =>
          o.order_status === "pending",
      ).length,

      preparing: orders.filter(
        (o) =>
          o.order_status ===
          "preparing",
      ).length,

      ready: orders.filter(
        (o) =>
          o.order_status === "ready",
      ).length,

      served: orders.filter(
        (o) =>
          o.order_status === "served",
      ).length,

      cancelled: orders.filter(
        (o) =>
          o.order_status ===
          "cancelled",
      ).length,

      all: orders.length,
    };
  }

  getTodayRevenue(
    orders: Order[],
  ) {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0,
    );

    return orders
      .filter(
        (o) =>
          new Date(o.created_at) >=
            today &&
          o.order_status === "served",
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(order.total),
        0,
      );
  }
  async getKitchenDashboardData(
  restaurantId: string,
) {
  const allOrders =
    await this.getRestaurantOrders(
      restaurantId,
    );

  return {
    pending: allOrders.filter(
      (o) =>
        o.order_status === "pending",
    ),

    preparing: allOrders.filter(
      (o) =>
        o.order_status ===
        "preparing",
    ),

    ready: allOrders.filter(
      (o) =>
        o.order_status === "ready",
    ),
  };
}
  
}
export const orderService =
  new OrderService();