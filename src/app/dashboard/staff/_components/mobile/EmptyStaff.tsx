"use client";

import {
  UsersRound,
  UserPlus,
} from "lucide-react";

type Props = {
  onAdd?: () => void;
};

export default function EmptyStaff({
  onAdd,
}: Props) {
  return (
    <section
      className="
        flex
        min-h-[70vh]
        items-center
        justify-center
        px-6
      "
    >
      <div className="max-w-sm text-center">

        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-[var(--color-primary-soft)]
          "
        >
          <UsersRound
            className="
              h-10
              w-10
              text-[var(--color-primary)]
            "
          />
        </div>

        <h2
          className="
            mt-6
            text-2xl
            font-black
            text-[var(--color-heading)]
          "
        >
          No Employees Yet
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-[var(--color-text-muted)]
          "
        >
          Add your first employee to start
          managing attendance, shifts and
          restaurant operations.
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
            px-5
            py-3
            text-sm
            font-bold
            text-white
          "
        >
          <UserPlus className="size-4" />

          Add Employee
        </button>

      </div>
    </section>
  );
}