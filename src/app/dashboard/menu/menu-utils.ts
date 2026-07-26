import type { Category, MenuItem } from "./menu-types"

export function getCategory(item: MenuItem): Category | null {
  if (!item.menu_categories) return null;

  if (Array.isArray(item.menu_categories)) {
    return item.menu_categories[0] ?? null;
  }

  return item.menu_categories;
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

export function matchesSearch(
  item: MenuItem,
  query: string
) {
  const cleanedQuery = normalizeText(query);

  if (!cleanedQuery) return true;

  const category = getCategory(item);

  const searchableText = normalizeText(
    [
      item.name,
      category?.name,
      category?.parent?.name,
      item.tag,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const queryWords = cleanedQuery
    .split(" ")
    .filter(Boolean);

  return queryWords.every((word) =>
    searchableText.includes(word)
  );
}

type ProcessMenuItemsProps = {
  items: MenuItem[];
  search: string;
  category: string;
  availability: string;
  sort: string;
  page: number;
  pageSize?: number;
};

export function processMenuItems({
  items,
  search,
  category,
  availability,
  sort,
  page,
  pageSize = 12,
}: ProcessMenuItemsProps) {
  let filtered = items.filter((item) => {
    const categoryMatch =
      category === "all" ||
      item.category_id === category;

    const searchMatch = matchesSearch(
      item,
      search
    );

    return categoryMatch && searchMatch;
  });

  if (availability === "available") {
    filtered = filtered.filter(
      (item) => item.is_available
    );
  }

  if (availability === "hidden") {
    filtered = filtered.filter(
      (item) => !item.is_available
    );
  }

  filtered.sort((a, b) => {
    switch (sort) {
      case "priceAsc":
        return a.price - b.price;

      case "priceDesc":
        return b.price - a.price;

      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalItems = filtered.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const currentPage = Math.min(
    Math.max(page, 1),
    totalPages
  );

  const paginatedItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    items: paginatedItems,
    filteredItems: filtered,
    totalItems,
    totalPages,
    currentPage,
  };
}