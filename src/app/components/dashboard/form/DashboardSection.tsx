import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function DashboardSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="dashboard-card p-6">
      <div className="mb-6">
        <h2
          className="text-xl font-bold"
          style={{
            color: "var(--color-heading)",
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}