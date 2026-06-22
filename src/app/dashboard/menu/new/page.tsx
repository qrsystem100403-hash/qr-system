import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import MenuItemForm from "@/modules/dashboard/menu/MenuItemForm";

export default async function NewMenuItemPage() {
  const { restaurant, supabase } = await requireRestaurantUser();

  const { data: categories, error } = await supabase
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

  if (error) {
 return (
  <main className="min-h-screen bg-[#F8F9FB] px-4 py-5 dark:bg-[#101214]">
    <div className="mx-auto max-w-5xl">
      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-white
          p-8
          shadow-sm
          dark:border-[#2A2F35]
          dark:bg-[#171A1F]
        "
      >
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-2xl
            bg-red-50
            text-red-600
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          ✕
        </div>

        <h1
          className="
            mt-5
            text-2xl
            font-bold
            text-[#111827]
            dark:text-[#E7E9EC]
          "
        >
          Failed to load categories
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[#667085]
            dark:text-[#AAB2BD]
          "
        >
          We couldn't load the categories required to create a menu item.
        </p>

        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-100
            bg-red-50
            p-4
            dark:border-red-500/20
            dark:bg-red-500/10
          "
        >
          <p
            className="
              text-sm
              text-red-700
              dark:text-red-400
            "
          >
            {error.message}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard/menu"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-2xl
              bg-[#2F7D57]
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#27684A]
            "
          >
            <ArrowLeft className="size-4" />
            Return to Menu
          </Link>
        </div>
      </div>
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
    const { data: parents, error: parentError } = await supabase
      .from("menu_categories")
      .select("id, name")
      .eq("restaurant_id", restaurant.id)
      .in("id", parentIds);

    if (parentError) {
      return (
  <main className="min-h-screen bg-[#F8F9FB] px-4 py-5 dark:bg-[#101214]">
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/menu"
        className="
          mb-4
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-[#667085]
          transition
          hover:text-[#111827]
          dark:text-[#AAB2BD]
          dark:hover:text-[#E7E9EC]
        "
      >
        <ArrowLeft className="size-4" />
        Back to Menu
      </Link>

      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-white
          p-8
          shadow-sm
          dark:border-[#2A2F35]
          dark:bg-[#171A1F]
        "
      >
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-2xl
            bg-red-50
            text-red-600
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          ✕
        </div>

        <h1
          className="
            mt-5
            text-2xl
            font-bold
            text-[#111827]
            dark:text-[#E7E9EC]
          "
        >
          Failed to load parent categories
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[#667085]
            dark:text-[#AAB2BD]
          "
        >
          We couldn't load the category hierarchy required to create
          menu items.
        </p>

        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-100
            bg-red-50
            p-4
            dark:border-red-500/20
            dark:bg-red-500/10
          "
        >
          <p
            className="
              text-sm
              text-red-700
              dark:text-red-400
            "
          >
            {parentError.message}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard/menu"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-2xl
              bg-[#2F7D57]
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#27684A]
            "
          >
            <ArrowLeft className="size-4" />
            Return to Menu
          </Link>
        </div>
      </div>
    </div>
  </main>
);
    }

    parentMap = new Map(
      (parents ?? []).map((parent) => [
        parent.id,
        {
          id: parent.id,
          name: parent.name,
        },
      ])
    );
  }

  const formattedCategories = subCategories.map((category) => ({
    ...category,
    parent: category.parent_id ? parentMap.get(category.parent_id) ?? null : null,
  }));

  return (
  <main className="min-h-screen bg-[#F8F9FB] dark:bg-[#101214] px-4 py-5">
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/menu"
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-[#667085]
            transition
            hover:text-[#111827]
            dark:text-[#AAB2BD]
            dark:hover:text-[#E7E9EC]
          "
        >
          <ArrowLeft className="size-4" />
          Back to Menu
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-[#111827]
                dark:text-[#E7E9EC]
              "
            >
              Add Menu Item
            </h1>

            <div
              className="
                mt-3
                inline-flex
                rounded-full
                bg-[#E7F3EC]
                px-3
                py-1
                dark:bg-[#1E2A24]
              "
            >
              <span
                className="
                  text-xs
                  font-medium
                  text-[#2F7D57]
                  dark:text-[#7BC99A]
                "
              >
                {restaurant.name}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex">
            <div
              className="
                flex
                h-14
                items-center
                gap-2
                rounded-2xl
                bg-[#2F7D57]
                px-5
                font-medium
                text-white
                shadow-sm
              "
            >
              <Plus className="size-4" />
              New Item
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <section
        className="
          rounded-3xl
          border
          border-[#E4DED3]
          bg-white
          p-6
          shadow-sm
          dark:border-[#2A2F35]
          dark:bg-[#171A1F]
        "
      >
        <div className="mb-6">
          <h2
            className="
              text-xl
              font-semibold
              text-[#111827]
              dark:text-[#E7E9EC]
            "
          >
            Item Details
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-[#667085]
              dark:text-[#AAB2BD]
            "
          >
            Fill the information below and publish the item.
          </p>
        </div>

        <MenuItemForm
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