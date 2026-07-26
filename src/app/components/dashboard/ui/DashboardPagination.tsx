"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import DashboardButton from "./DashboardButton";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export default function DashboardPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;

const to = Math.min(
  page * pageSize,
  totalItems
);

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return (
    <div
      className="
        mt-8
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div
  className="
    flex
    flex-wrap
    items-center
    gap-3
    text-sm
    text-[var(--color-text-muted)]
  "
>
  <span>
    Showing{" "}
    <span className="font-semibold text-[var(--color-heading)]">
      {from}
    </span>
    –
    <span className="font-semibold text-[var(--color-heading)]">
      {to}
    </span>{" "}
    of{" "}
    <span className="font-semibold text-[var(--color-heading)]">
      {totalItems}
    </span>
  </span>

  {onPageSizeChange && (
    <div className="flex items-center gap-2">
      <span>Rows</span>

      <select
        value={pageSize}
        onChange={(e) =>
          onPageSizeChange(Number(e.target.value))
        }
        className="
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-3
          py-2
          text-sm
          outline-none
          focus:border-[var(--color-primary)]
        "
      >
        {pageSizeOptions.map((size) => (
          <option
            key={size}
            value={size}
          >
            {size}
          </option>
        ))}
      </select>
    </div>
  )}
</div>

      <>
  {/* Desktop Pagination */}

  <div
    className="
      hidden
      sm:flex
      items-center
      gap-2
      overflow-x-auto
    "
  >
        <DashboardButton
          variant="secondary"
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          <ChevronLeft className="size-4" />
        </DashboardButton>
                {pages.map((item, index) => {
          if (item === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  text-[var(--color-text-muted)]
                "
              >
                <MoreHorizontal className="size-4" />
              </div>
            );
          }

          const active = item === page;

          return (
            <DashboardButton
              key={item}
              variant={
                active
                  ? "primary"
                  : "secondary"
              }
              onClick={() => onPageChange(item)}
              className="
                h-11
                w-11
                p-0
              "
            >
              {item}
            </DashboardButton>
          );
        })}

        <DashboardButton
          variant="secondary"
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          <ChevronRight className="size-4" />
        </DashboardButton>
      </div>

{/* Mobile Pagination */}

<div
  className="
    flex
    w-full
    items-center
    justify-between
    gap-3
    sm:hidden
  "
>
  <DashboardButton
    variant="secondary"
    disabled={page === 1}
    onClick={() => onPageChange(page - 1)}
  >
    <ChevronLeft className="size-4" />
    Prev
  </DashboardButton>

  <span
    className="
      text-sm
      font-medium
      text-[var(--color-text-muted)]
    "
  >
    Page {page} / {totalPages}
  </span>

  <DashboardButton
    variant="secondary"
    disabled={page === totalPages}
    onClick={() => onPageChange(page + 1)}
  >
    Next
    <ChevronRight className="size-4" />
  </DashboardButton>
</div>

</>
      
      
    </div>
  );
}