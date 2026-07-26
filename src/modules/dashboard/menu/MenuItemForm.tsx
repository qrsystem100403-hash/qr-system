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
import Image from "next/image";

import type { Category } from "@/app/dashboard/menu/menu-types";
import DashboardDropdown from "@/app/components/dashboard/ui/DashboardDropdown";

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
  onSuccess?:()=> void;
};

export default function MenuItemForm({
  item,
  categories,
  onSuccess,
}: Props) {
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

      if (onSuccess) {
  onSuccess();
} else {
  router.push("/dashboard/menu");
}

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

      if (onSuccess) {
  onSuccess();
} else {
  router.push("/dashboard/menu");
}

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
      rounded-[var(--radius-lg)]
      border
      border-[var(--color-danger-border)]
      bg-[var(--color-surface)]
      p-6
      shadow-[var(--shadow-sm)]
    "
  >
    <div className="flex gap-4">
      <div
        className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-[var(--radius-md)]
          bg-[var(--color-danger-soft)]
          text-[var(--color-danger)]
        "
      >
        <AlertTriangle className="size-5" />
      </div>

      <div>
        <h2
          className="
            text-sm
            font-semibold
            text-[var(--color-heading)]
          "
        >
          No Subcategories Found
        </h2>

        <p
          className="
            mt-1
            max-w-xl
            text-xs
            leading-relaxed
            text-[var(--color-text-muted)]
          "
        >
          You need at least one active subcategory before creating menu
          items. Create a category and subcategory first, then return here
          to add items.
        </p>
      </div>
    </div>
  </div>
);
  }

  return (
    <form onSubmit={submit} className="pb-24 max-w-7xl mx-auto">
      {errorMessage && (
        <div className="
mb-5
rounded-[var(--radius-lg)]
border
border-[var(--color-danger-border)]
bg-[var(--color-danger-soft)]
p-4
text-xs
font-medium
leading-relaxed
text-[var(--color-danger)]
">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* LEFT COMPACT INFO ENGINE */}
        <div className="space-y-6">
  <div
    className="
      rounded-[var(--radius-xl)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      p-6
      shadow-[var(--shadow-sm)]
    "
  >
    <div className="mb-6">
      <h2 className="text-base font-bold tracking-tight text-[var(--color-heading)]">
        Basic Information
      </h2>

      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
        Item details shown to customers across digital store modules.
      </p>
    </div>

    <div className="space-y-5">
      <FormField label="Item Name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Paneer Butter Masala"
          className="
            h-10
            w-full
            rounded-[var(--radius-md)]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3.5
            text-sm
            text-[var(--color-text)]
            outline-none
            transition-all
            focus:border-[var(--color-primary)]
            focus:ring-2
            focus:ring-[var(--color-primary-soft)]
          "
        />
      </FormField>

      <FormField label="Subcategory">
        <DashboardDropdown
  value={categoryId}
  onChange={setCategoryId}
  className="w-full"
  options={categories.map((category) => ({
    value: category.id,
    label: category.parent
      ? `${category.parent.name} • ${category.name}`
      : category.name,
  }))}
/>

        {selectedCategory && (
          <p className="mt-1.5 text-[11px] text-[var(--color-text-soft)]">
            Selected Node{" "}
            <span className="font-semibold text-[var(--color-success)]">
              {selectedCategory.parent?.name
                ? `${selectedCategory.parent.name} → ${selectedCategory.name}`
                : selectedCategory.name}
            </span>
          </p>
        )}
      </FormField>

      <FormField label="Price">
        <div
          className="
            flex
            h-10
            items-center
            rounded-[var(--radius-md)]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3.5
            transition-all
            focus-within:border-[var(--color-primary)]
            focus-within:ring-2
            focus-within:ring-[var(--color-primary-soft)]
          "
        >
          <span className="mr-2 text-sm font-bold text-[var(--color-text-soft)]">
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
              text-[var(--color-text)]
              outline-none
            "
          />
        </div>
      </FormField>
    </div>
  </div>

  <div
    className="
      rounded-[var(--radius-xl)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      p-6
      shadow-[var(--shadow-sm)]
    "
  >
    <div className="mb-6">
      <h2 className="text-base font-bold tracking-tight text-[var(--color-heading)]">
        Search & Visibility
      </h2>

      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
        Improve discoverability parameters and instant catalog stock control.
      </p>
    </div>

    <div className="space-y-5">
      <FormField label="Search Tags">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="paneer, spicy, gravy"
          className="
            h-10
            w-full
            rounded-[var(--radius-md)]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3.5
            text-sm
            text-[var(--color-text)]
            outline-none
            transition-all
            focus:border-[var(--color-primary)]
            focus:ring-2
            focus:ring-[var(--color-primary-soft)]
          "
        />

        <p className="mt-1.5 text-[11px] text-[var(--color-text-soft)]">
          Separate tags using precise indexing commas.
        </p>
      </FormField>

      <div
        className="
          rounded-[var(--radius-lg)]
          border
          border-[var(--color-border)]
          bg-[var(--color-surface-soft)]
          p-4
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[var(--color-heading)]">
              Item Availability Status
            </p>

            <p className="mt-0.5 text-[11px] text-[var(--color-text-soft)]">
              Toggle whether customers can actively view and place orders for
              this item.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
              isAvailable
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-border)]"
            }`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-xs)] transition-all duration-200 ${
                isAvailable ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* RIGHT CONTROL SIDEBAR STRIP */}
        <div className="space-y-6 xl:sticky xl:top-5 xl:self-start">

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
    <h2 className="mb-4 text-sm font-bold tracking-tight text-[var(--color-heading)]">
      Item Image Asset
    </h2>

    <div
      className="
        overflow-hidden
        rounded-[var(--radius-md)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface-soft)]
      "
    >
      {image ? (
        <div className="relative aspect-video w-full">
          <Image
            src={image}
            alt="Preview"
            fill
            className="object-cover"
          />

          <button
            type="button"
            onClick={() => {
              setImage("");
              setImagePublicId("");
            }}
            className="
              absolute
              right-2
              top-2
              grid
              size-7
              place-items-center
              rounded-full
              bg-[var(--color-surface)]
              text-[var(--color-text)]
              shadow-[var(--shadow-sm)]
              transition-colors
              hover:bg-[var(--color-surface-hover)]
            "
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center text-[var(--color-text-soft)]">
          <ImagePlus className="size-8 stroke-[1.5]" />

          <p className="mt-2 text-xs font-semibold">
            No Asset Selected
          </p>
        </div>
      )}
    </div>

    <label
      className="
        mt-3
        flex
        h-10
        cursor-pointer
        items-center
        justify-center
        rounded-[var(--radius-md)]
        bg-[var(--color-primary)]
        px-4
        text-xs
        font-semibold
        text-[var(--color-primary-foreground)]
        transition-colors
        hover:bg-[var(--color-primary-hover)]
        shadow-[var(--shadow-sm)]
      "
    >
      {uploadingImage ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-3.5 animate-spin" />
          Uploading...
        </span>
      ) : (
        "Choose New Image"
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

  <div
    className="
      rounded-[var(--radius-xl)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      p-4
      shadow-[var(--shadow-sm)]
    "
  >
    <button
      type="submit"
      disabled={!canSubmit}
      className="
        flex
        h-10
        w-full
        items-center
        justify-center
        gap-2
        rounded-[var(--radius-md)]
        bg-[var(--color-primary)]
        text-xs
        font-semibold
        text-[var(--color-primary-foreground)]
        transition-colors
        hover:bg-[var(--color-primary-hover)]
        disabled:opacity-40
      "
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : isEdit ? (
        <Save className="size-3.5" />
      ) : (
        <Check className="size-3.5" />
      )}

      {loading
        ? "Saving Item..."
        : isEdit
        ? "Update Item"
        : "Create Item"}
    </button>
  </div>

  {isEdit && (
    <div
      className="
        rounded-[var(--radius-xl)]
        border
        border-[var(--color-danger-border)]
        bg-[var(--color-danger-soft)]
        p-5
      "
    >
      <h3
        className="
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-[var(--color-danger)]
        "
      >
        Danger Zone
      </h3>

      <p
        className="
          mt-1
          text-[11px]
          leading-relaxed
          text-[var(--color-danger)]
        "
      >
        Removing this item cannot be undone.
      </p>

      <button
        type="button"
        onClick={deleteItem}
        disabled={deleting}
        className="
          mt-4
          flex
          h-10
          w-full
          items-center
          justify-center
          gap-2
          rounded-[var(--radius-md)]
          bg-[var(--color-danger)]
          text-xs
          font-semibold
          text-[var(--color-danger-foreground)]
          transition-colors
          hover:opacity-90
        "
      >
        {deleting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
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
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-soft)]">
        {label}
      </label>
      {children}
    </div>
  );
}