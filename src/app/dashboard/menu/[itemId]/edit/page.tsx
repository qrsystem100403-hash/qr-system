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

  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select(`
      id,
      name,
      parent_id
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .not("parent_id", "is", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (categoriesError) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-4 py-4 text-[var(--color-text)]">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <h1 className="text-xl font-semibold text-red-100">
            Failed to load categories
          </h1>
          <p className="mt-2 text-sm text-red-200">
            {categoriesError.message}
          </p>
        </div>
      </main>
    );
  }

  const subCategories = categories ?? [];

  const parentIds = Array.from(
    new Set(
      subCategories
        .map((category) => category.parent_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  let parentMap = new Map<string, { id: string; name: string }>();

  if (parentIds.length > 0) {
    const { data: parentsData, error: parentsError } = await supabase
      .from("menu_categories")
      .select("id, name")
      .eq("restaurant_id", restaurant.id)
      .in("id", parentIds);

    if (parentsError) {
      return (
        <main className="min-h-screen bg-[var(--color-bg)] px-4 py-4 text-[var(--color-text)]">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <h1 className="text-xl font-semibold text-red-100">
              Failed to load parent categories
            </h1>
            <p className="mt-2 text-sm text-red-200">
              {parentsError.message}
            </p>
          </div>
        </main>
      );
    }

    parentMap = new Map(
      ((parentsData ?? []) as { id: string; name: string }[]).map((parent) => [
        parent.id,
        parent,
      ])
    );
  }

  const formattedCategories = subCategories.map((category) => ({
    ...category,
    parent: category.parent_id ? parentMap.get(category.parent_id) ?? null : null,
  }));

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-4 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/dashboard/menu"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-black/25 text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)]"
            aria-label="Back to menu"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Menu Builder
            </p>
            <h1 className="mt-1 truncate font-heading text-3xl font-normal leading-none sm:text-4xl">
              Edit Menu Item
            </h1>
          </div>

          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
            <Pencil className="size-4" />
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-black/20 px-4 py-3">
          <p className="truncate text-sm leading-6 text-[var(--color-text-muted)]">
            Editing{" "}
            <span className="font-medium text-[var(--color-text)]">
              {item.name}
            </span>
          </p>
        </div>

        <section className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-4 shadow-[var(--shadow-soft)] sm:p-5">
          <MenuItemForm
            item={
              {
                ...item,
                tags: item.tag ? [item.tag] : [],
              } as Parameters<typeof MenuItemForm>[0]["item"]
            }
            categories={
              formattedCategories as Parameters<typeof MenuItemForm>[0]["categories"]
            }
          />
        </section>
      </div>
    </main>
  );
}