import type { ReactNode } from "react";

type Props = {
  hero: ReactNode;
  stats: ReactNode;
  children: ReactNode;
};

export default function StaffDashboardShell({
  hero,
  stats,
  children,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {hero}

      <section className="grid gap-6 lg:grid-cols-3">
        {stats}
      </section>

      <section>{children}</section>
    </div>
  );
}