"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";

import { useDashboardHeader } from "@/app/components/dashboard/header/DashboardHeaderProvider";
import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";

import MenuItemDialog from "./MenuItemDialog";
import MenuItemForm from "@/modules/dashboard/menu/MenuItemForm";
import type { Category } from "./menu-types";

type Props = {
  categories: Category[];
};

export default function MenuHeader({
  categories,
}: Props) {
  const router = useRouter();

  const { setHeader } = useDashboardHeader();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHeader({
      title: "Menu",
      description: "Add and manage menu items.",

      actions: (
        <>
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
        </>
      ),
    });

    return () => setHeader(null);
  }, [router, setHeader]);

  return (
    <MenuItemDialog
      open={open}
      onOpenChange={setOpen}
      title="Add Menu Item"
    >
      <MenuItemForm
        categories={categories}
        onSuccess={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </MenuItemDialog>
  );
}