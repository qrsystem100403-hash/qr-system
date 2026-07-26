import Link from "next/link";
import { Utensils } from "lucide-react";

type Props = {
  title: string;
  text: string;
  href: string;
  action: string;
};

export default function MenuEmptyState({
  title,
  text,
  href,
  action,
}: Props) {
  return (
    <div
      className="
        flex
        min-h-[420px]
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-8
      "
    >
      <div className="max-w-md text-center">
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[var(--color-surface-soft)]
          "
        >
          <Utensils
            className="
              size-7
              text-[var(--color-primary)]
            "
          />
        </div>

        <h2
          className="
            mt-6
            text-xl
            font-bold
            text-[var(--color-heading)]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-6
            text-[var(--color-text-muted)]
          "
        >
          {text}
        </p>

        <Link
          href={href}
          className="
            mt-8
            inline-flex
            h-11
            items-center
            justify-center
            rounded-xl
            bg-[var(--color-primary)]
            px-5
            text-sm
            font-semibold
            text-white
            transition-all
            hover:opacity-90
          "
        >
          {action}
        </Link>
      </div>
    </div>
  );
}