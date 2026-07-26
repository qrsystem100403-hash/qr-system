"use client";

import type {
  Category,
  MenuItem,
} from "./menu-types";

import MenuToolbar from "./MenuToolbar";
import MenuCard from "./MenuCard";
import MenuEmptyState from "./MenuEmptyState";
import DashboardPagination from "@/app/components/dashboard/ui/DashboardPagination";

type Props = {
  categories: Category[];
  sortedItems: MenuItem[];
  paginatedItems: MenuItem[];
  filteredItems: MenuItem[];
  totalPages: number;
  currentPage: number;
};

export default function MenuContent({
  categories,
  sortedItems,
  paginatedItems,
  filteredItems,
  totalPages,
  currentPage,
}: Props) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1700px]
        space-y-6
        px-2
        pt-2
        sm:px-4
        lg:px-6
        xl:px-8
      "
    >
      <MenuToolbar categories={categories} />

      {!sortedItems.length ? (
        <MenuEmptyState
          title="No menu items yet"
          text="Your menu is empty. Add your first menu item to start accepting orders."
          href="/dashboard/menu"
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
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
            "
          >
            {paginatedItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                category={item.menu_categories}
                categories={categories}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <DashboardPagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              pageSize={12}
              onPageChange={() => {}}
            />
          )}
        </>
      )}
    </div>
  );
}