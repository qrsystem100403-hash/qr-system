export interface PublicMenuCategory {
  id: string;
  name: string;
  sort_order: number;
  available_from: string | null;
  available_until: string | null;
  parent_id: string | null;
}

export interface PublicMenuItemAddon {
  id: string;
  name: string;
  price: number;
  sort_order: number;
  is_active: boolean;
}

export interface PublicMenuItemVariant {
  id: string;
  name: string;
  price: number;
  sort_order: number;
  is_available: boolean;
  menu_item_addons: PublicMenuItemAddon[];
}

export interface PublicMenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  category_id: string | null;
  image: string | null;
  is_available: boolean;
  is_archived: boolean;
  tag: string | null;
  description: string | null;
  rating: number | null;
  rating_count: number | null;
  menu_item_variants: PublicMenuItemVariant[];
}

export interface PublicMenu {
  categories: PublicMenuCategory[];
  items: PublicMenuItem[];
}