"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import DashboardToolbar from "@/app/components/dashboard/ui/DashboardToolbar";
import DashboardSearch from "@/app/components/dashboard/ui/DashboardSearch";
import DashboardDropdown from "@/app/components/dashboard/ui/DashboardDropdown";
import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";



import type { Category } from "./menu-types";
import { Plus, RefreshCw } from "lucide-react";

type Props = {
  categories: Category[];
};

export default function MenuToolbar({
  categories,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(
    params.get("q") ?? ""
  );

  const category =
    params.get("category") ?? "all";

  const availability =
    params.get("availability") ?? "all";

  const sort =
    params.get("sort") ?? "name";

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(
        params.toString()
      );

      if (search.trim()) {
        next.set("q", search.trim());
      } else {
        next.delete("q");
      }

      startTransition(() => {
        router.replace(
          `/dashboard/menu?${next.toString()}`
        );
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, params, router]);

  function updateParam(
    key: string,
    value: string
  ) {
    const next = new URLSearchParams(
      params.toString()
    );

    if (
      value === "all" ||
      value === "name"
    ) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    startTransition(() => {
      router.replace(
        `/dashboard/menu?${next.toString()}`
      );
    });
  }

  const hasFilters = useMemo(() => {
    return (
      search ||
      category !== "all" ||
      availability !== "all" ||
      sort !== "name"
    );
  }, [
    search,
    category,
    availability,
    sort,
  ]);
  const [open, setOpen] = useState(false);


  return (
  <>
    <DashboardToolbar
      left={
        <div className="w-full">
          <DashboardSearch
            value={search}
            onChange={setSearch}
            placeholder="Search menu items..."
          />
        </div>
      }
      center={
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <DashboardDropdown
            className="w-full"
            value={category}
            onChange={(v) =>
              updateParam("category", v)
            }
            options={[
              {
                label: "All Categories",
                value: "all",
              },
              ...categories.map((c) => ({
                label: c.parent
                  ? `${c.parent.name} • ${c.name}`
                  : c.name,
                value: c.id,
              })),
            ]}
          />

          <DashboardDropdown
            className="w-full"
            value={availability}
            onChange={(v) =>
              updateParam(
                "availability",
                v
              )
            }
            options={[
              {
                label: "All Status",
                value: "all",
              },
              {
                label: "Available",
                value: "available",
              },
              {
                label: "Hidden",
                value: "hidden",
              },
            ]}
          />

          <DashboardDropdown
            className="w-full"
            value={sort}
            onChange={(v) =>
              updateParam("sort", v)
            }
            options={[
              {
                label: "A → Z",
                value: "name",
              },
              {
                label: "Price ↑",
                value: "priceAsc",
              },
              {
                label: "Price ↓",
                value: "priceDesc",
              },
            ]}
          />
        </div>
      }
      right={
        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
          {hasFilters && (
            <DashboardButton
              variant="secondary"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/dashboard/menu">
                Reset
              </Link>
            </DashboardButton>
          )}

                    <DashboardButton
                      variant="secondary"
                      onClick={() => router.refresh()}
                      className="
                        h-9
                        w-9
                        p-0
                        lg:h-11
                        lg:w-auto
                        lg:px-5
                        
                      "
                    >
                      <RefreshCw className="size-4" />
          
                      <span className="hidden lg:inline">
                        Refresh
                      </span>
                    </DashboardButton>
          
                    <DashboardButton
                      onClick={() => setOpen(true)}
                      className="
                        h-9
                        w-9
                        p-0
                        
                        lg:h-11
                        lg:w-auto
                        lg:px-5
                      "
                    >
                      <Plus className="size-4" />
          
                      <span className="hidden lg:inline">
                        Add Item
                      </span>
                    </DashboardButton>
                  

        </div>
      }
    />

    
    
  </>
);

}