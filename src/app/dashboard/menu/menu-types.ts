export type Category = {
  id: string;
  name: string;
  sort_order: number;
  parent_id: string | null;
  parent?: {
    id: string;
    name: string;
    sort_order: number;
    parent_id: string | null;
  } | null;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  image: string | null;
  is_available: boolean;
  tag: string | null;
  menu_categories: Category | null;
};