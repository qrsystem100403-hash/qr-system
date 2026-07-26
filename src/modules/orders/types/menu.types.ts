export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  is_available: boolean;
  is_archived: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  parent_id: string | null;
  available_from: string | null;
  available_until: string | null;
};

export type MenuVariant = {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_available: boolean;
};

export type MenuAddon = {
  id: string;
  menu_item_id: string;
  variant_id: string | null;
  name: string;
  price: number;
  is_active: boolean;
};