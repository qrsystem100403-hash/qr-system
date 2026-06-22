import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Plus,
  Search,
  SlidersHorizontal,
  Utensils,
  XCircle,
} from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import CategoryDropdown from "./CategoryDropdown";

type Category = {
  id: string;
  name: string;
  sort_order: number;
  parent_id: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
};

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  image: string | null;
  is_available: boolean;
  tag: string | null;
  menu_categories: Category | Category[] | null;
};

type Props = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
  }>;
};

function getCategory(item: MenuItem) {
  if (!item.menu_categories) return null;
  if (Array.isArray(item.menu_categories)) return item.menu_categories[0] ?? null;
  return item.menu_categories;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function matchesSearch(item: MenuItem, query: string) {
  const cleanedQuery = normalizeText(query);
  if (!cleanedQuery) return true;

  const category = getCategory(item);

  const searchableText = normalizeText(
    [item.name, category?.name, category?.parent?.name, item.tag]
      .filter(Boolean)
      .join(" ")
  );

  const queryWords = cleanedQuery.split(" ").filter(Boolean);

  return queryWords.every((word) => searchableText.includes(word));
}

export default async function MenuPage({ searchParams }: Props) {
  const { restaurant, supabase } = await requireRestaurantUser();
  const params = await searchParams;

  const activeCategory = params?.category ?? "all";
  const searchQuery = params?.q?.trim() ?? "";

  const { data: categoriesData, error: categoriesError } = await supabase
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
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (categoriesError) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
        <ErrorBox title="Failed to load categories" message={categoriesError.message} />
      </main>
    );
  }

  const subCategories = (categoriesData ?? []) as Category[];

  const parentIds = Array.from(
    new Set(
      subCategories
        .map((category) => category.parent_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  let parentMap = new Map<string, Category>();

  if (parentIds.length > 0) {
    const { data: parentsData, error: parentsError } = await supabase
      .from("menu_categories")
      .select("id, name, sort_order, parent_id")
      .eq("restaurant_id", restaurant.id)
      .in("id", parentIds);

    if (parentsError) {
      return (
        <main className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
          <ErrorBox title="Failed to load parent categories" message={parentsError.message} />
        </main>
      );
    }

    parentMap = new Map(
      ((parentsData ?? []) as Category[]).map((parent) => [parent.id, parent])
    );
  }

  const categories = subCategories.map((category) => ({
    ...category,
    parent: category.parent_id ? parentMap.get(category.parent_id) ?? null : null,
  }));

  const { data: menuItemsData, error } = await supabase
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
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
        <ErrorBox title="Failed to load menu" message={error.message} />
      </main>
    );
  }

  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const items = ((menuItemsData ?? []) as unknown as Omit<
    MenuItem,
    "menu_categories"
  >[]).map((item) => ({
    ...item,
    menu_categories: item.category_id
      ? categoryMap.get(item.category_id) ?? null
      : null,
  }));

  const sortedItems = items.sort((a, b) => {
    const categoryA = getCategory(a);
    const categoryB = getCategory(b);

    const parentA = categoryA?.parent?.name ?? "";
    const parentB = categoryB?.parent?.name ?? "";

    if (parentA !== parentB) return parentA.localeCompare(parentB);

    const orderA = categoryA?.sort_order ?? 9999;
    const orderB = categoryB?.sort_order ?? 9999;

    if (orderA !== orderB) return orderA - orderB;

    return a.name.localeCompare(b.name);
  });

  const filteredItems = sortedItems.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || item.category_id === activeCategory;

    const searchMatch = matchesSearch(item, searchQuery);

    return categoryMatch && searchMatch;
  });

  const availableCount = sortedItems.filter((item) => item.is_available).length;
  const unavailableCount = sortedItems.length - availableCount;

  const buildCategoryHref = (categoryId: string) => {
    const params = new URLSearchParams();

    if (categoryId !== "all") params.set("category", categoryId);
    if (searchQuery) params.set("q", searchQuery);

    const query = params.toString();
    return query ? `/dashboard/menu?${query}` : "/dashboard/menu";
  };

  return (
  <main className="space-y-6 px-4 py-5">
    {/* Header */}
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-[#E7E9EC]">
          Menu
        </h1>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
          Manage menu items and availability
        </p>
      </div>

      <Link
        href="/dashboard/menu/new"
        className="
          hidden
          lg:inline-flex
          h-11
          items-center
          gap-2
          rounded-2xl
          bg-[#2F7D57]
          px-4
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-[#27694A]
        "
      >
        <Plus className="size-4" />
        Add Item
      </Link>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl border border-[#E4DED3] bg-white p-4 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
          Total
        </p>

        <p className="mt-1 text-2xl font-bold text-[#111827] dark:text-[#E7E9EC]">
          {sortedItems.length}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E4DED3] bg-white p-4 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
          Available
        </p>

        <p className="mt-1 text-2xl font-bold text-[#2F7D57] dark:text-[#7BC99A]">
          {availableCount}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E4DED3] bg-white p-4 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
          Hidden
        </p>

        <p className="mt-1 text-2xl font-bold text-[#B42318] dark:text-[#FCA5A5]">
          {unavailableCount}
        </p>
      </div>
    </div>

    {/* Filters */}
    <form action="/dashboard/menu">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              size-4
              text-[#98A2B3]
            "
          />

          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search menu items..."
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-[#E4DED3]
              bg-white
              pl-11
              pr-4
              text-sm
              text-[#111827]
              outline-none
              transition
              focus:border-[#2F7D57]
              dark:border-[#2A2F35]
              dark:bg-[#171A1F]
              dark:text-[#E7E9EC]
            "
          />
        </div>

        <CategoryDropdown
          categories={categories}
          activeCategory={activeCategory}
        />

        <button
          type="submit"
          className="
            h-12
            rounded-2xl
            bg-[#2F7D57]
            px-5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#27694A]
          "
        >
          Apply
        </button>
      </div>
    </form>

    {/* Empty States */}
    {!sortedItems.length ? (
      <EmptyState
        title="No menu items yet"
        text="Start by adding your first menu item."
        href="/dashboard/menu/new"
        action="Add Item"
      />
    ) : !filteredItems.length ? (
      <EmptyState
        title="No matching items"
        text="Try changing the search or category filter."
        href="/dashboard/menu"
        action="Clear Filters"
      />
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const category = getCategory(item);

          return (
            <Link
              key={item.id}
              href={`/dashboard/menu/${item.id}/edit`}
              className="
                group
                rounded-3xl
                border
                border-[#E4DED3]
                bg-white
                p-4
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-lg
                dark:border-[#2A2F35]
                dark:bg-[#171A1F]
              "
            >
              <div className="flex gap-3">
                <img
                  src={
                    item.image ??
                    "/images/restaurant-hero.png"
                  }
                  alt={item.name}
                  className="
                    h-18
                    w-18
                    shrink-0
                    rounded-2xl
                    object-cover
                  "
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold text-[#111827] dark:text-[#E7E9EC]">
                      {item.name}
                    </h3>

                    <span
                      className={
                        item.is_available
                          ? "rounded-full bg-green-100 px-2 py-1 text-[11px] font-medium text-green-700 dark:bg-green-500/15 dark:text-green-300"
                          : "rounded-full bg-red-100 px-2 py-1 text-[11px] font-medium text-red-700 dark:bg-red-500/15 dark:text-red-300"
                      }
                    >
                      {item.is_available
                        ? "Available"
                        : "Hidden"}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-[#F7F8FA]
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-[#667085]
                        dark:bg-[#20242A]
                        dark:text-[#AAB2BD]
                      "
                    >
                      {category?.name ??
                        "Uncategorized"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-semibold text-[#111827] dark:text-[#E7E9EC]">
                      ₹{item.price}
                    </p>

                    <span
                      className="
                        rounded-xl
                        border
                        border-[#E4DED3]
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-[#475467]
                        transition
                        group-hover:border-[#2F7D57]
                        group-hover:text-[#2F7D57]
                        dark:border-[#2A2F35]
                        dark:text-[#AAB2BD]
                        dark:group-hover:border-[#7BC99A]
                        dark:group-hover:text-[#7BC99A]
                      "
                    >
                      Edit
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )}

    {/* Mobile FAB */}
    <Link
      href="/dashboard/menu/new"
      className="
        fixed
        bottom-20
        right-4
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-[#2F7D57]
        text-white
        shadow-lg
        transition
        hover:bg-[#27694A]
        lg:hidden
      "
    >
      <Plus className="size-5" />
    </Link>
  </main>
);
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
  <div
    className="
      rounded-2xl
      border
      border-[#E4DED3]
      bg-white
      p-3
      text-center
      shadow-sm
      dark:border-[#2A2F35]
      dark:bg-[#171A1F]
      sm:p-4
    "
  >
    <p
      className="
        text-2xl
        font-bold
        leading-none
        text-[#111827]
        dark:text-[#E7E9EC]
        sm:text-3xl
      "
    >
      {value}
    </p>

    <p
      className="
        mt-1
        text-[8px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-[#667085]
        dark:text-[#AAB2BD]
        sm:text-[10px]
        sm:tracking-[0.2em]
      "
    >
      {label}
    </p>
  </div>
);
}

function EmptyState({
  title,
  text,
  href,
  action,
}: {
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mt-6 rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-6 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
        <Utensils className="size-5" />
      </div>

      <h2 className="mt-4 font-heading text-3xl font-normal">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
        {text}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-bg)]"
      >
        {action}
      </Link>
    </div>
  );
}

function ErrorBox({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 p-5">
      <h1 className="font-heading text-3xl font-normal text-red-100">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-red-200">{message}</p>
    </div>
  );
}