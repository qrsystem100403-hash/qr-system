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
      <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" />
          <div>
            <p className="font-semibold text-red-100">No subcategories found</p>
            <p className="mt-1 text-sm leading-6 text-red-200/80">
              Create menu subcategories first before adding items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="pb-24">
      {errorMessage && (
        <div className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <FormField label="Item Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paneer Butter Masala"
              className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/35 px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-border-gold)]"
            />
          </FormField>

          <FormField label="Subcategory">
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-black/35 px-4 pr-10 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-border-gold)]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parent?.name
                      ? `${category.parent.name} → ${category.name}`
                      : category.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-soft)]" />
            </div>

            {selectedCategory && (
              <p className="mt-2 text-xs text-[var(--color-text-soft)]">
                Selected:{" "}
                <span className="text-[var(--color-gold)]">
                  {selectedCategory.parent?.name
                    ? `${selectedCategory.parent.name} → ${selectedCategory.name}`
                    : selectedCategory.name}
                </span>
              </p>
            )}
          </FormField>

          <FormField label="Price">
            <div className="flex h-12 items-center rounded-2xl border border-[var(--color-border)] bg-black/35 px-4 transition focus-within:border-[var(--color-border-gold)]">
              <span className="mr-2 text-sm font-semibold text-[var(--color-gold)]">
                ₹
              </span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="1"
                inputMode="numeric"
                placeholder="199"
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
              />
            </div>
          </FormField>

          <FormField label="Search Tags">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="paneer, spicy, gravy"
              className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/35 px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-border-gold)]"
            />

            <p className="mt-2 text-xs leading-5 text-[var(--color-text-soft)]">
              Separate with commas. Helps customers search items faster.
            </p>
          </FormField>

          <label className="flex min-h-[58px] items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-black/25 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Available on QR menu
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-soft)]">
                Turn off if item is out of stock.
              </p>
            </div>

            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="size-5 accent-[var(--color-gold)]"
            />
          </label>
        </div>

        <div className="lg:sticky lg:top-5 lg:self-start">
          <div className="rounded-[24px] border border-[var(--color-border)] bg-black/25 p-3">
            <div className="relative overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-black/40">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Menu item preview"
                    className="h-56 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImage("");
                      setImagePublicId("");
                    }}
                    disabled={uploadingImage || loading || deleting}
                    className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md"
                    aria-label="Remove image"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <div className="flex h-56 flex-col items-center justify-center px-5 text-center">
                  <div className="grid size-12 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                    <ImagePlus className="size-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">
                    Upload item image
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-text-soft)]">
                    Use a clear food photo. Square or landscape works best.
                  </p>
                </div>
              )}
            </div>

            <label className="mt-3 flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-gold)]/10 px-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--color-gold)] transition hover:border-[var(--color-border-gold)]">
              {uploadingImage ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Uploading
                </span>
              ) : (
                "Choose Image"
              )}

              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage || loading || deleting}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 p-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={deleteItem}
              disabled={loading || uploadingImage || deleting}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 disabled:opacity-50"
              aria-label="Delete item"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-bg)] shadow-[0_18px_45px_rgba(211,181,74,0.18)] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading || uploadingImage ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEdit ? (
              <Save className="size-4" />
            ) : (
              <Check className="size-4" />
            )}

            {uploadingImage
              ? "Uploading..."
              : loading
              ? "Saving..."
              : isEdit
              ? "Update Item"
              : "Create Item"}
          </button>
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
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
        {label}
      </label>
      {children}
    </div>
  );
}