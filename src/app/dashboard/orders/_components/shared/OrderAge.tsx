import { Clock3 } from "lucide-react";
import { formatRelativeTime } from "../order-utils";

type Props = {
  createdAt: string;
};

export default function OrderAge({
  createdAt,
}: Props) {
  return (
    <div className="text-right">

      <div className="flex items-center justify-end gap-1 text-[var(--color-text-muted)]">
        <Clock3 className="h-3.5 w-3.5" />
        <span className="text-xs">
          Waiting
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-orange-600 dark:text-orange-400">
        {formatRelativeTime(createdAt)}
      </p>

    </div>
  );
}