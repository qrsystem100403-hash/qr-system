"use client";

import { UsersRound, UserPlus } from "lucide-react";

type Props = {
  onAdd?: () => void;
};

export default function EmptyStaffTable({
  onAdd,
}: Props) {
  return (
    <section
      className="
        flex
        min-h-[520px]
        items-center
        justify-center
        rounded-[32px]
        border
        border-dashed
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-10
      "
    >
      <div className="max-w-md text-center">

        <div
          className="
            mx-auto
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-3xl
            bg-[var(--color-primary-soft)]
          "
        >
          <UsersRound
            className="
              h-12
              w-12
              text-[var(--color-primary)]
            "
          />
        </div>

        <h2
          className="
            mt-7
            text-3xl
            font-black
            text-[var(--color-heading)]
          "
        >
          Build Your Team
        </h2>

        <p
          className="
            mt-3
            text-base
            leading-7
            text-[var(--color-text-muted)]
          "
        >
          You haven't added any staff members yet.
          Invite managers, waiters, chefs and cashiers
          to start managing your restaurant together.
        </p>

        <button
          onClick={onAdd}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-[var(--color-primary)]
            px-6
            py-3
            text-sm
            font-bold
            text-white
            transition-all
            hover:scale-[1.03]
            active:scale-[0.98]
          "
        >
          <UserPlus className="size-5" />

          Add First Employee
        </button>

      </div>
    </section>
  );
}