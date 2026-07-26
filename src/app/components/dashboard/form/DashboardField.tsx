import { ReactNode } from "react";

type Props = {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export default function DashboardField({
  label,
  description,
  required,
  error,
  children,
}: Props) {
  return (
    <div className="space-y-2">
      <div>
        <label
          className="block text-sm font-semibold"
          style={{
            color: "var(--color-heading)",
          }}
        >
          {label}

          {required && (
            <span
              className="ml-1"
              style={{
                color: "var(--color-danger)",
              }}
            >
              *
            </span>
          )}
        </label>

        {description && (
          <p
            className="mt-1 text-xs"
            style={{
              color:
                "var(--color-text-muted)",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {children}

      {error && (
        <p
          className="text-xs font-medium"
          style={{
            color: "var(--color-danger)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}