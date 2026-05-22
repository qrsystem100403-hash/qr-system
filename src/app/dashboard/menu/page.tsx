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
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)]/75 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)] sm:tracking-[0.32em]">
                Menu Management
              </p>

              <h1 className="mt-2 font-heading text-4xl font-normal leading-none sm:text-5xl">
                Menu
              </h1>

              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                Manage items for{" "}
                <span className="text-[var(--color-text)]">{restaurant.name}</span>
              </p>
            </div>

            <Link
              href="/dashboard/menu/new"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-bg)] shadow-[0_18px_45px_rgba(211,181,74,0.18)] transition hover:brightness-110 sm:w-auto"
            >
              <Plus className="size-4" />
              Add Item
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <MiniStat label="Total" value={sortedItems.length} />
            <MiniStat label="Available" value={availableCount} />
            <MiniStat label="Hidden" value={unavailableCount} />
          </div>
        </section>

        <form
          action="/dashboard/menu"
          className="sticky top-0 z-20 mt-5 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-bg)]/95 p-3 backdrop-blur-xl"
        >
          {activeCategory !== "all" && (
            <input type="hidden" name="category" value={activeCategory} />
          )}

          <div className="space-y-3 sm:flex sm:space-y-0 sm:gap-3">
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-black/35 px-4 focus-within:border-[var(--color-border-gold)]">
              <Search className="size-4 shrink-0 text-[var(--color-gold)]" />
              <input
                name="q"
                defaultValue={searchQuery}
                placeholder="Search item..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-soft)]"
              />
            </div>

            <div className="flex gap-2 sm:w-auto">
              <button
                type="submit"
                className="h-11 min-w-0 flex-1 rounded-2xl bg-[var(--color-gold)] px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-bg)] sm:h-12 sm:flex-none sm:px-5"
              >
                Search
              </button>

              {(searchQuery || activeCategory !== "all") && (
                <Link
                  href="/dashboard/menu"
                  className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-2xl border border-[var(--color-border)] px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:h-12 sm:flex-none sm:px-5"
                >
                  Clear
                </Link>
              )}
            </div>
          </div>
        </form>

        {!!sortedItems.length && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-soft)]">
              <SlidersHorizontal className="size-3.5" />
              Categories
            </div>

            <div className="flex max-w-full gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href={buildCategoryHref("all")}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold ${
                  activeCategory === "all"
                    ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                    : "border border-[var(--color-border)] bg-black/20 text-[var(--color-text-muted)]"
                }`}
              >
                All
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={buildCategoryHref(category.id)}
                  className={`max-w-[230px] shrink-0 truncate rounded-full px-4 py-2.5 text-xs font-bold ${
                    activeCategory === category.id
                      ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                      : "border border-[var(--color-border)] bg-black/20 text-[var(--color-text-muted)]"
                  }`}
                >
                  {category.parent?.name
                    ? `${category.parent.name} · ${category.name}`
                    : category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!sortedItems.length ? (
          <EmptyState
            title="No menu items yet"
            text="Start by adding your first food item."
            href="/dashboard/menu/new"
            action="Add first item"
          />
        ) : !filteredItems.length ? (
          <EmptyState
            title="No matching items"
            text="Try changing the search keyword or category filter."
            href="/dashboard/menu"
            action="Clear filters"
          />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const category = getCategory(item);

              return (
                <Link
                  key={item.id}
                  href={`/dashboard/menu/${item.id}/edit`}
                  className="group overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-gold)]"
                >
                  <div className="relative h-36 overflow-hidden bg-black/40 sm:h-40">
                    <img
                      src={item.image ?? "/images/restaurant-hero.png"}
                      alt={item.name}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                        !item.is_available ? "grayscale opacity-45" : ""
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ${
                        item.is_available
                          ? "bg-green-500/15 text-green-200"
                          : "bg-red-500/15 text-red-200"
                      }`}
                    >
                      {item.is_available ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      {item.is_available ? "Available" : "Hidden"}
                    </span>

                    {item.tag && (
                      <span className="absolute right-3 top-3 max-w-[130px] truncate rounded-full border border-yellow-500/25 bg-yellow-500/15 px-2.5 py-1 text-[10px] font-bold text-yellow-200 backdrop-blur-md">
                        {item.tag}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="truncate text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                        {category?.parent?.name
                          ? `${category.parent.name} · ${category.name}`
                          : category?.name ?? "Uncategorized"}
                      </p>

                      <h2 className="mt-1 line-clamp-2 break-words font-heading text-2xl font-normal leading-tight text-white">
                        {item.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-black/25 px-3 py-1.5 text-sm font-semibold text-[var(--color-text)]">
                        <BadgeIndianRupee className="size-3.5 text-[var(--color-gold)]" />
                        {item.price}
                      </span>

                      <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-soft)] transition group-hover:text-[var(--color-gold)]">
                        Edit
                        <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-black/25 p-3 text-center sm:p-4">
      <p className="font-heading text-2xl font-normal leading-none text-[var(--color-text)] sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-soft)] sm:text-[10px] sm:tracking-[0.2em]">
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