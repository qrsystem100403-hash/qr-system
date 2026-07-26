import type { SupabaseClient } from "@supabase/supabase-js";

import { CustomerThemeRepository } from "@/modules/customer-theme/repositories/customerThemeRepository";
import { CartRepository } from "@/modules/cart/repositories/cartRepository";
import { MenuRepository } from "@/modules/qr-ordering/repositories/menuRepository";
import { TableRepository } from "@/modules/qr-ordering/repositories/tableRepository";

export function createRestaurantRepositories(
  supabase: SupabaseClient,
) {
  return {
    customerTheme: new CustomerThemeRepository(
      supabase,
    ),

    table: new TableRepository(
      supabase,
    ),

    menu: new MenuRepository(
      supabase,
    ),

    cart: new CartRepository(
      supabase,
    ),
  };
}

export type RestaurantRepositories =
  ReturnType<
    typeof createRestaurantRepositories
  >;