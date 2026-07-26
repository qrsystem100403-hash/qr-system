"use client";

import * as Select from "@radix-ui/react-select";
import {
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export default function DashboardDropdown({
  value,
  onChange,
  options,
  placeholder,
  className,
}: Props) {
  return (
    <Select.Root
      value={value}
      onValueChange={onChange}
    >
      <Select.Trigger
        className={cn(
          `
          flex
          h-11
          w-full
          min-w-[180px]
          items-center
          justify-between
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-4
          text-sm
          font-medium
          text-[var(--color-heading)]
          shadow-[var(--shadow-xs)]
          outline-none
          transition-all
          hover:border-[var(--color-border-strong)]
          focus:border-[var(--color-primary)]
          focus:ring-2
          focus:ring-[var(--color-primary-soft)]
          `,
          className
        )}
      >
        <Select.Value
          placeholder={placeholder}
        />

        <Select.Icon>
          <ChevronDown className="size-4 text-[var(--color-text-soft)]" />
        </Select.Icon>
      </Select.Trigger>

      
        <Select.Content
  position="popper"
  sideOffset={8}
  className="
    z-[100]
    w-[var(--radix-select-trigger-width)]
    overflow-hidden
    rounded-2xl
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    text-[var(--color-text)]
    shadow-xl
"
>
          <Select.ScrollUpButton
            className="
              flex
              h-8
              items-center
              justify-center
            "
          >
            <ChevronUp className="size-4" />
          </Select.ScrollUpButton>

          <Select.Viewport
  className="
    max-h-72
    overflow-y-auto
    p-2
  "
>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="
relative
flex
cursor-pointer
select-none
items-center
rounded-xl
py-2.5
pl-9
pr-3
text-sm
text-[var(--color-text)]
outline-none
transition-colors
data-[highlighted]:bg-[var(--color-primary-soft)]
data-[highlighted]:text-[var(--color-primary)]
data-[state=checked]:font-semibold
"
              >
                <Select.ItemIndicator
                  className="
                    absolute
                    left-3
                    flex
                    items-center
                  "
                >
                  <Check className="size-4" />
                </Select.ItemIndicator>

                <Select.ItemText>
                  {option.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton
            className="
              flex
              h-8
              items-center
              justify-center
            "
          >
            <ChevronDown className="size-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      
    </Select.Root>
  );
}