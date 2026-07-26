export interface CartAddon {
  id: string;

  addonId: string | null;

  addonName: string;

  addonPrice: number;

  addonQty: number;

  addonTotal: number;
}

export interface CartItem {
  id: string;

  menuItemId: string;

  itemName: string;

  itemPrice: number;

  qty: number;

  lineTotal: number;

  itemNote: string | null;

  variantId: string | null;

  variantName: string | null;

  variantPrice: number;

  addons: CartAddon[];
}

export interface Cart {
  id: string;

  restaurantId: string;

  tableId: string;

  sessionId: string | null;

  status: "active" | "checked_out" | "abandoned";

  subtotal: number;

  serviceCharge: number;

  gstAmount: number;

  roundOff: number;

  total: number;

  items: CartItem[];
}