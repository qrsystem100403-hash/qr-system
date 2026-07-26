"use client";

import { RotateCcw, Search, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  role: string;
  status: string;
  sort: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;

  onClear: () => void;
};

const roleOptions = [
  { value: "all", label: "All" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "kitchen", label: "Kitchen" },
  { value: "waiter", label: "Waiter" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

export default function StaffFilters({
  search,
  role,
  status,
  sort,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
  onClear,
}: Props) {
  return (
    <div
      className="
      rounded-[var(--radius-xl)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      p-5
      shadow-[var(--shadow-sm)]
      "
    >
      <div className="flex flex-col gap-5">

        {/* Search */}

        <div className="relative">
          <Search
            className="
            absolute
            left-4
            top-1/2
            size-5
            -translate-y-1/2
            text-[var(--color-text-soft)]
            "
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search staff by name, email or phone..."
            className="
            h-12
            w-full
            rounded-[var(--radius-lg)]
            border
            border-[var(--color-border)]
            bg-[var(--color-bg)]
            pl-12
            pr-4
            outline-none
            transition
            focus:border-[var(--color-primary)]
            "
          />
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

          <div className="space-y-4">

            {/* Role */}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Role
              </p>

              <div className="flex flex-wrap gap-2">
                {roleOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      onRoleChange(item.value)
                    }
                    className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    ${
                      role === item.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]"
                    }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Status
              </p>

              <div className="flex flex-wrap gap-2">
                {statusOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      onStatusChange(item.value)
                    }
                    className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    ${
                      status === item.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]"
                    }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <Select
  value={sort}
  onValueChange={(value) => {
    if (value) {
      onSortChange(value);
    }
  }}
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Sort By" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="newest">
      Newest First
    </SelectItem>

    <SelectItem value="oldest">
      Oldest First
    </SelectItem>

    <SelectItem value="name">
      Name (A-Z)
    </SelectItem>

    <SelectItem value="role">
      Role
    </SelectItem>
  </SelectContent>
</Select>

            <button
              type="button"
              onClick={onClear}
              className="
              inline-flex
              h-10
              items-center
              gap-2
              rounded-[var(--radius-md)]
              border
              border-[var(--color-border)]
              px-4
              text-sm
              font-medium
              transition
              hover:bg-[var(--color-surface-hover)]
              "
            >
              <RotateCcw className="size-4" />
              Clear Filters
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}