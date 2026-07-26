"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import MenuItemDialog from "./MenuItemDialog";
import MenuItemForm from "@/modules/dashboard/menu/MenuItemForm";

import type {
  Category,
  MenuItem,
} from "./menu-types";

type Props = {
  item: MenuItem;
  categories: Category[];
};

export default function EditMenuItemButton({
  item,
  categories,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="
          flex
          items-center
          gap-1
          text-sm
          font-semibold
          text-[var(--color-primary)]
          transition-all
          duration-300
          hover:gap-2
        "
      >
        <Pencil className="size-4" />
        Edit

        <span
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </button>

      <MenuItemDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Menu Item"
      >
        <MenuItemForm
          item={item}
          categories={categories}
          onSuccess={() => setOpen(false)}
        />
      </MenuItemDialog>
    </>
  );
}