"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
};

type Props = {
  categories: Category[];
  item?: {
    id: string;
    name: string;
    price: number;
    category_id: string | null;
    image: string | null;
    image_public_id?: string | null;
    is_available: boolean;
    tags?: string[] | null;
  };
};

export default function MenuItemForm({ item, categories }: Props) {
  const router = useRouter();

  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(
    item?.category_id ?? categories[0]?.id ?? ""
  );
  const [image, setImage] = useState(item?.image ?? "");
  const [imagePublicId, setImagePublicId] = useState(item?.image_public_id ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [tags, setTags] = useState((item?.tags ?? []).join(", "));
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEdit = Boolean(item);

  const numericPrice = Number(price);

  const canSubmit =
    name.trim().length > 0 &&
    categoryId &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    !loading &&
    !uploadingImage &&
    !deleting;

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );

  const uploadImage = async (file: File) => {
    setErrorMessage("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/dashboard/menu/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to upload image.");
        return;
      }

      setImage(data.url);
      setImagePublicId(data.publicId);
    } catch (error) {
      console.error(error);
      setErrorMessage("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteItem = async () => {
    if (!item || deleting || loading || uploadingImage) return;

    const confirmed = window.confirm(
      "Delete this menu item? This action cannot be undone."
    );

    if (!confirmed) return;

    setErrorMessage("");
    setDeleting(true);

    try {
      const response = await fetch(`/api/dashboard/menu/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to delete item.");
        return;
      }

      router.push("/dashboard/menu");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("Please fill item name, category and valid price.");
      return;
    }

    const cleanedTags = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        isEdit ? `/api/dashboard/menu/${item?.id}` : "/api/dashboard/menu",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            price: numericPrice,
            categoryId,
            image: image.trim() || null,
            imagePublicId: imagePublicId || null,
            isAvailable,
            tags: cleanedTags,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to save item.");
        return;
      }

      router.push("/dashboard/menu");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  if (!categories.length) {
    return (
  <div
    className="
      rounded-3xl
      border
      border-red-200
      bg-white
      p-6
      shadow-sm
      dark:border-red-900/40
      dark:bg-[#171A1F]
    "
  >
    <div className="flex gap-4">
      <div
        className="
          flex
          size-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-red-50
          text-red-600
          dark:bg-red-950/30
          dark:text-red-400
        "
      >
        <AlertTriangle className="size-5" />
      </div>

      <div>
        <h2 className="font-semibold text-[#111827] dark:text-[#E7E9EC]">
          No Subcategories Found
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] dark:text-[#AAB2BD]">
          You need at least one active subcategory before creating menu
          items. Create a category and subcategory first, then return
          here to add items.
        </p>
      </div>
    </div>
  </div>
);
  }

  return (
  <form onSubmit={submit} className="pb-28">
    {errorMessage && (
      <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
        {errorMessage}
      </div>
    )}

    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      {/* LEFT */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#E4DED3] bg-white p-6 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#111827] dark:text-[#E7E9EC]">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
              Item details shown to customers.
            </p>
          </div>

          <div className="space-y-5">
            <FormField label="Item Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Paneer Butter Masala"
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-[#E4DED3]
                  bg-white
                  px-4
                  text-sm
                  text-[#111827]
                  outline-none
                  transition
                  focus:border-[#2F7D57]
                  dark:border-[#2A2F35]
                  dark:bg-[#20242A]
                  dark:text-[#E7E9EC]
                "
              />
            </FormField>

            <FormField label="Subcategory">
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="
                    h-12
                    w-full
                    appearance-none
                    rounded-2xl
                    border
                    border-[#E4DED3]
                    bg-white
                    px-4
                    pr-10
                    text-sm
                    text-[#111827]
                    outline-none
                    transition
                    focus:border-[#2F7D57]
                    dark:border-[#2A2F35]
                    dark:bg-[#20242A]
                    dark:text-[#E7E9EC]
                  "
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.parent?.name
                        ? `${category.parent.name} → ${category.name}`
                        : category.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
              </div>

              {selectedCategory && (
                <p className="mt-2 text-xs text-[#667085] dark:text-[#AAB2BD]">
                  Selected:{" "}
                  <span className="font-medium text-[#2F7D57] dark:text-[#7BC99A]">
                    {selectedCategory.parent?.name
                      ? `${selectedCategory.parent.name} → ${selectedCategory.name}`
                      : selectedCategory.name}
                  </span>
                </p>
              )}
            </FormField>

            <FormField label="Price">
              <div className="flex h-12 items-center rounded-2xl border border-[#E4DED3] bg-white px-4 focus-within:border-[#2F7D57] dark:border-[#2A2F35] dark:bg-[#20242A]">
                <span className="mr-2 font-semibold text-[#2F7D57] dark:text-[#7BC99A]">
                  ₹
                </span>

                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="199"
                  className="
                    h-full
                    flex-1
                    bg-transparent
                    text-sm
                    text-[#111827]
                    outline-none
                    dark:text-[#E7E9EC]
                  "
                />
              </div>
            </FormField>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E4DED3] bg-white p-6 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#111827] dark:text-[#E7E9EC]">
              Search & Visibility
            </h2>

            <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
              Improve discoverability and stock control.
            </p>
          </div>

          <div className="space-y-5">
            <FormField label="Search Tags">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="paneer, spicy, gravy"
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-[#E4DED3]
                  bg-white
                  px-4
                  text-sm
                  text-[#111827]
                  outline-none
                  transition
                  focus:border-[#2F7D57]
                  dark:border-[#2A2F35]
                  dark:bg-[#20242A]
                  dark:text-[#E7E9EC]
                "
              />

              <p className="mt-2 text-xs text-[#667085] dark:text-[#AAB2BD]">
                Separate tags using commas.
              </p>
            </FormField>

            <div className="rounded-2xl border border-[#E4DED3] p-4 dark:border-[#2A2F35]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[#111827] dark:text-[#E7E9EC]">
                    Item Availability
                  </p>

                  <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
                    Customers can order this item.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    isAvailable
                      ? "bg-[#2F7D57]"
                      : "bg-[#D0D5DD] dark:bg-[#39414A]"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-5 rounded-full bg-white transition-all ${
                      isAvailable ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-6 xl:sticky xl:top-5 xl:self-start">
        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <h2 className="mb-5 text-lg font-semibold text-[#111827] dark:text-[#E7E9EC]">
            Item Image
          </h2>

          <div className="overflow-hidden rounded-3xl border border-[#E4DED3] dark:border-[#2A2F35]">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="h-72 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImage("");
                    setImagePublicId("");
                  }}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/70 text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center bg-[#F7F8FA] dark:bg-[#20242A]">
                <ImagePlus className="size-10 text-[#98A2B3]" />

                <p className="mt-3 text-sm font-medium text-[#667085] dark:text-[#AAB2BD]">
                  Upload Item Image
                </p>
              </div>
            )}
          </div>

          <label className="mt-4 flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-[#2F7D57] text-sm font-semibold text-white">
            {uploadingImage ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Choose Image"
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingImage || loading || deleting}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </label>
        </div>

        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F7D57] font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEdit ? (
              <Save className="size-4" />
            ) : (
              <Check className="size-4" />
            )}

            {loading
              ? "Saving..."
              : isEdit
              ? "Update Item"
              : "Create Item"}
          </button>
        </div>

        {isEdit && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/20">
            <h3 className="font-semibold text-red-700 dark:text-red-300">
              Danger Zone
            </h3>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Deleting this item cannot be undone.
            </p>

            <button
              type="button"
              onClick={deleteItem}
              disabled={deleting}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-white"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}

              Delete Item
            </button>
          </div>
        )}
      </div>
    </div>
  </form>
);
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
  <div>
    <label
      className="
        mb-2
        block
        text-[10px]
        font-bold
        uppercase
        tracking-[0.2em]
        text-[#667085]
        dark:text-[#98A2B3]
      "
    >
      {label}
    </label>

    {children}
  </div>
);
}