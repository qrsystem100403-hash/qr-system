import { cn } from "@/lib/utils";

type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const padding = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function DashboardCard({
  children,
  className,
  hover = false,
  padding: spacing = "md",
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-sm)]",
        "transition-all duration-200",
        hover &&
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
        padding[spacing],
        className
      )}
    >
      {children}
    </section>
  );
}