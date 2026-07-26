import { forbidden } from "next/navigation";

import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { can } from "@/lib/auth/can";

import DashboardPageHeader from "@/app/components/dashboard/ui/DashboardPageHeader";

import type {
  Category,
  MenuItem,
} from "./menu-types";

import {
  getCategory,
  processMenuItems,
} from "./menu-utils";

import MenuToolbar from "./MenuToolbar";
import MenuCard from "./MenuCard";
import MenuEmptyState from "./MenuEmptyState";
import MenuError from "./MenuError";
import MenuPagination from "./MenuPagination";

import DashboardStats from "@/app/components/dashboard/ui/DashboardStats";
import { Eye, EyeOff, FolderTree, Utensils } from "lucide-react";
import MenuHeader from "./MenuHeader";

type Props = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    availability?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function MenuPage({
  searchParams,
}: Props) {
  const {
    restaurant,
    supabase,
    role,
  } = await requireRestaurantUser();

  if (!can(role, "menu")) {
    forbidden();
  }

  const params = await searchParams;

  const search =
    params?.q?.trim() ?? "";

  const category =
    params?.category ?? "all";

  const availability =
    params?.availability ?? "all";

  const sort =
    params?.sort ?? "name";

  const page = Number(
    params?.page ?? "1"
  );

  const { data: categoriesData, error: categoriesError } =
  await supabase
    .from("menu_categories")
    .select(`
      id,
      name,
      sort_order,
      parent_id
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .not("parent_id", "is", null)
    .order("sort_order")
    .order("name");

if (categoriesError) {
  return (
    <MenuError
      title="Failed to load categories"
      message={categoriesError.message}
    />
  );
}

const subCategories =
  (categoriesData ?? []) as Category[];

const parentIds = Array.from(
  new Set(
    subCategories
      .map((category) => category.parent_id)
      .filter(
        (id): id is string => Boolean(id)
      )
  )
);

let parentMap = new Map<
  string,
  Category
>();

if (parentIds.length > 0) {
  const {
    data: parentsData,
    error: parentsError,
  } = await supabase
    .from("menu_categories")
    .select(`
      id,
      name,
      sort_order,
      parent_id
    `)
    .eq("restaurant_id", restaurant.id)
    .in("id", parentIds);

  if (parentsError) {
    return (
      <MenuError
        title="Failed to load parent categories"
        message={parentsError.message}
      />
    );
  }

  parentMap = new Map(
    ((parentsData ?? []) as Category[]).map(
      (parent) => [parent.id, parent]
    )
  );
}

const categories = subCategories.map(
  (category) => ({
    ...category,
    parent: category.parent_id
      ? parentMap.get(category.parent_id) ??
        null
      : null,
  })
);

const {
  data: menuItemsData,
  error: menuItemsError,
} = await supabase
  .from("menu_items")
  .select(`
    id,
    name,
    price,
    category_id,
    image,
    is_available,
    tag
  `)
  .eq("restaurant_id", restaurant.id)
  .eq("is_archived", false)
  .order("name");

if (menuItemsError) {
  return (
    <MenuError
      title="Failed to load menu"
      message={menuItemsError.message}
    />
  );
}
const categoryMap = new Map(
  categories.map((category) => [
    category.id,
    category,
  ])
);

const items = (
  (menuItemsData ?? []) as Omit<
    MenuItem,
    "menu_categories"
  >[]
).map((item) => ({
  ...item,
  menu_categories: item.category_id
    ? categoryMap.get(item.category_id) ??
      null
    : null,
}));

const sortedItems = [...items].sort(
  (a, b) => {
    const categoryA = getCategory(a);
    const categoryB = getCategory(b);

    const parentA =
      categoryA?.parent?.name ?? "";

    const parentB =
      categoryB?.parent?.name ?? "";

    if (parentA !== parentB) {
      return parentA.localeCompare(parentB);
    }

    const orderA =
      categoryA?.sort_order ?? 9999;

    const orderB =
      categoryB?.sort_order ?? 9999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.name.localeCompare(b.name);
  }
);

const {
  items: paginatedItems,
  filteredItems,
  totalPages,
  currentPage,
} = processMenuItems({
  items: sortedItems,
  search,
  category,
  availability,
  sort,
  page,
});

const stats = [
  {
    label: "Total Items",
    value: sortedItems.length,
    icon: Utensils,
    description: "Menu items",
  },
  {
    label: "Available",
    value: sortedItems.filter(
      (item) => item.is_available
    ).length,
    icon: Eye,
    colorClass:
      "bg-emerald-100 dark:bg-emerald-500/10",
    description: "Visible to customers",
  },
  {
    label: "Hidden",
    value: sortedItems.filter(
      (item) => !item.is_available
    ).length,
    icon: EyeOff,
    colorClass:
      "bg-red-100 dark:bg-red-500/10",
    description: "Hidden from menu",
  },
  {
    label: "Categories",
    value: categories.length,
    icon: FolderTree,
    colorClass:
      "bg-blue-100 dark:bg-blue-500/10",
    description: "Active categories",
  },
];

return (
  <>
<MenuHeader categories={categories} />
  <div
    className="
      mx-auto
      w-full
      max-w-[1700px]
      space-y-6
      px-2
      sm:px-4
      lg:px-6
      xl:px-8
      pt-2
      mb-20 lg:mb-0
    "
  >
    <DashboardStats items={stats} />
    <MenuToolbar categories={categories} />

    {!sortedItems.length ? (
      <MenuEmptyState
        title="No menu items yet"
        text="Your menu is empty. Add your first menu item to start accepting orders."
        href="/dashboard/menu/new"
        action="Add Item"
      />
    ) : !filteredItems.length ? (
      <MenuEmptyState
        title="No matching items"
        text="No menu items match the current filters."
        href="/dashboard/menu"
        action="Reset Filters"
      />
    ) : (
      <>
        <div
          className="
            grid
            gap-5
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {paginatedItems.map((item) => (
            <MenuCard
  key={item.id}
  item={item}
  category={getCategory(item)}
  categories={categories}
/>
          ))}
        </div>

        {totalPages > 1 && (
          <MenuPagination
  page={currentPage}
  totalPages={totalPages}
  totalItems={filteredItems.length}
/>
        )}
      </>
    )}
  </div>

  </>
  
);

}