import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import MenuItemForm from "@/modules/dashboard/menu/MenuItemForm";

type Props = {
  params: Promise<{
    itemId: string;
  }>;
};

export default async function EditMenuItemPage({ params }: Props) {
  const { itemId } = await params;
  const { restaurant, supabase } = await requireRestaurantUser();

  // 1. Fetch target menu item details
  const { data: item, error } = await supabase
    .from("menu_items")
    .select(
      "id, name, price, category_id, image, image_public_id, is_available, tag"
    )
    .eq("id", itemId)
    .eq("restaurant_id", restaurant.id)
    .eq("is_archived", false)
    .single();

  if (error || !item) {
    notFound();
  }

  // 2. Optimized single query fetches child categories and joins their parents inline
  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select(`
      id,
      name,
      parent_id,
      parent:menu_categories!parent_id (
        id,
        name
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .not("parent_id", "is", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (categoriesError) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-900/30 dark:bg-[#0c0c0e]">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-600 dark:bg-red-950/20 dark:text-red-400">
              ✕
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Failed to load categories
            </h1>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              We couldn't load the menu categories required to populate your form hierarchy.
            </p>

            <div className="mt-4 rounded-lg border border-red-100 bg-red-50/50 p-3.5 dark:border-red-900/20 dark:bg-red-950/10">
              <p className="text-xs font-mono text-red-700 dark:text-red-400">
                {categoriesError.message}
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/menu"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="size-3.5" />
                Return to Menu
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const formattedCategories = categories ?? [];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/menu"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="size-3.5" />
            Back to Menu
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Edit Menu Item
              </h1>

              <div className="mt-2 inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  {item.name}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex">
              <div className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white px-3.5 text-xs font-bold text-zinc-400 dark:border-zinc-800/60 dark:bg-zinc-950 dark:text-zinc-500 shadow-sm select-none">
                <Pencil className="size-3.5 stroke-[2.5]" />
                Edit Mode
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/60 dark:bg-[#0c0c0e]">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Currently updating production records for item identifier:{" "}
            <span className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-900 dark:text-zinc-50 font-medium">
              {item.id}
            </span>
          </p>
        </div>

        {/* Form Container */}
        <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-[#0c0c0e]">
          <div className="mb-6 border-b border-zinc-100 dark:border-zinc-900/60 pb-5">
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Item Parameters
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Modify the structural parameters, active modifiers, and pricing models below.
            </p>
          </div>

          <MenuItemForm
            item={
              {
                ...item,
                tags: item.tag ? [item.tag] : [],
              } as Parameters<typeof MenuItemForm>[0]["item"]
            }
            categories={
              formattedCategories as unknown as Parameters<
                typeof MenuItemForm
              >[0]["categories"]
            }
          />
        </section>
      </div>
    </main>
  );
}