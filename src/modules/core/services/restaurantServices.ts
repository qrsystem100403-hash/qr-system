import type { SupabaseClient } from "@supabase/supabase-js";

import { CustomerThemeService } from "@/modules/customer-theme/services/customerThemeService";
import { CartService } from "@/modules/cart/services/cartService";
import { MenuService } from "@/modules/qr-ordering/services/menuService";
import { TableService } from "@/modules/qr-ordering/services/tableService";

import { createRestaurantRepositories } from "./restaurantRepositories";

export function createRestaurantServices(
  supabase: SupabaseClient,
) {
  const repositories =
    createRestaurantRepositories(supabase);

  return {
    customerTheme:
      new CustomerThemeService(
        repositories.customerTheme,
      ),

    table:
      new TableService(
        repositories.table,
      ),

    menu:
      new MenuService(
        repositories.menu,
      ),

    cart:
      new CartService(
        repositories.cart,
      ),
  };
}

export type RestaurantServices =
  ReturnType<
    typeof createRestaurantServices
  >;