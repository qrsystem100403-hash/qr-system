export type CartAddon = {
  id: string;
};

export type CartVariant = {
  id: string;
};

export type CartItem = {
  cartKey: string;
  id: string;
  quantity: number;
  variant: CartVariant | null;
  addons: CartAddon[];
};

export type ValidatedAddon = {
  addonId: string;
  addonName: string;
  addonPrice: number;
};

export type ValidatedCartItem = {
  cartKey: string;
  menuItemId: string;
  itemName: string;
  variantId: string | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  addons: ValidatedAddon[];
};

export type RestaurantTable = {
  id: string;
  name: string;
};

export type CreateOrderPayload = {
  restaurant_id: string;
  table_id: string;
  session_id: string;

  order_type: string;
  table_name: string;

  subtotal: number;
  service_charge: number;
  gst_amount: number;
  round_off: number;
  total: number;

  gst_enabled: boolean;
  gst_mode: "inclusive" | "exclusive";
  gst_percent: number;

  service_charge_enabled: boolean;
  service_charge_type: "fixed" | "percentage";
  service_charge_value: number;

  payment_status: string;
  order_status: string;

  customer_note: string | null;
};

export type CreateOrderItemPayload = {
  order_id: string;
  menu_item_id: string;
  variant_id: string | null;
  variant_name: string | null;
  item_name: string;
  item_price: number;
  qty: number;
};

export type CreateOrderItemAddonPayload = {
  order_item_id: string;
  addon_id: string;
  addon_name: string;
  addon_price: number;
};

export const __ORDER_TYPES_CHECK__ = true;