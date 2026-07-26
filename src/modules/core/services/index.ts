import { supabaseAdmin } from "@/lib/supabase/admin";
import { createRestaurantServices } from "./restaurantServices";

export const restaurantServices =
  createRestaurantServices(supabaseAdmin);