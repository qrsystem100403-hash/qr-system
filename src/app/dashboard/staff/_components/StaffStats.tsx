"use client";

import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
} from "lucide-react";

type Props = {
  total: number;
  active: number;
  onLeave: number;
  managers: number;
};

const cards = (
  total: number,
  active: number,
  onLeave: number,
  managers: number,
) => [
  {
    title: "Total Staff",
    value: total,
    icon: Users,
    iconBg: "bg-[var(--color-primary-soft)]",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    title: "Active Staff",
    value: active,
    icon: UserCheck,
    iconBg: "bg-[var(--color-success-soft)]",
    iconColor: "text-[var(--color-success)]",
  },
  {
  title: "On Leave",
  value: onLeave,
  icon: UserX,
  iconBg: "bg-[var(--color-warning-soft)]",
  iconColor: "text-[var(--color-warning)]",
},
  {
    title: "Managers",
    value: managers,
    icon: Briefcase,
    iconBg: "bg-[var(--color-warning-soft)]",
    iconColor: "text-[var(--color-warning)]",
  },
];

export default function StaffStats({
  total,
  active,
  onLeave,
  managers,
}: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards(
  total,
  active,
  onLeave,
  managers,
).map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
            rounded-[var(--radius-xl)]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-5
            shadow-[var(--shadow-sm)]
            transition-all
            hover:-translate-y-0.5
            hover:shadow-[var(--shadow-md)]
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="
                  text-sm
                  font-medium
                  text-[var(--color-text-muted)]
                  "
                >
                  {card.title}
                </p>

                <h2
                  className="
                  mt-3
                  text-3xl
                  font-bold
                  text-[var(--color-heading)]
                  "
                >
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-[var(--radius-lg)]
                ${card.iconBg}
                `}
              >
                <Icon
                  className={`size-6 ${card.iconColor}`}
                />
              </div>
            </div>

            <div
              className="
              mt-5
              h-1.5
              overflow-hidden
              rounded-full
              bg-[var(--color-surface-soft)]
              "
            >
              <div
                className="
                h-full
                w-full
                rounded-full
                bg-[var(--color-primary)]
                opacity-20
                "
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}