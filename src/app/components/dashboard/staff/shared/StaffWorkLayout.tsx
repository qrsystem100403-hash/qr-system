"use client";

import { ReactNode } from "react";

type Props = {
  attendance: ReactNode;
  children: ReactNode;
};

export default function StaffWorkLayout({
  attendance,
  children,
}: Props) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 mb-2 md:mb-0">

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">

        <aside
          className="
          lg:sticky
          lg:top-5
          self-start
          "
        >
          {attendance}
        </aside>

        <section
          className="
          min-w-0
          space-y-5
          "
        >
          {children}
        </section>

      </div>

    </main>
  );
}