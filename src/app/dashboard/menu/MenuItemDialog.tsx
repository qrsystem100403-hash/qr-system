"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

export default function MenuItemDialog({
  open,
  onOpenChange,
  title,
  children,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
  <div className="dashboard-theme">

    <Dialog.Overlay
  className="
    fixed inset-0
    z-[100]
    bg-[var(--color-overlay)]
  "
/>

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            z-[101]
            w-[95vw]
            max-w-5xl
            max-h-[90vh]
            -translate-x-1/2
            -translate-y-1/2
            overflow-hidden
            rounded-3xl
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            shadow-2xl
          "
        >
          <div
  className="
    flex
    items-center
    justify-between
    border-b
    border-[var(--color-border)]
    px-6
    py-5
  "
>
  <Dialog.Title
    className="
      text-xl
      font-bold
      text-[var(--color-heading)]
    "
  >
    {title}
  </Dialog.Title>

  <Dialog.Close
    className="
      flex
      size-10
      items-center
      justify-center
      rounded-xl
      text-[var(--color-text-soft)]
      transition-colors
      hover:bg-[var(--color-surface-soft)]
      hover:text-[var(--color-heading)]
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--color-primary-soft)]
    "
  >
    <X className="size-5" />
  </Dialog.Close>
</div>

          <div
            className="
              max-h-[calc(90vh-80px)]
              overflow-y-auto
              p-6
            "
          >
            {children}
          </div>
        </Dialog.Content>

  </div>
        
      </Dialog.Portal>
    </Dialog.Root>
  );
}