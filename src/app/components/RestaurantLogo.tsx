type Props = {
  logo?: string | null;
  name: string;
  size?: number;
  rounded?: boolean;
  className?: string;
};

export default function RestaurantLogo({
  logo,
  name,
  size = 44,
  rounded = true,
  className = "",
}: Props) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        width={size}
        height={size}
        className={`
          object-cover
          border
          border-[var(--color-border)]
          ${rounded ? "rounded-full" : "rounded-xl"}
          ${className}
        `}
      />
    );
  }

  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`
        flex
        items-center
        justify-center
        border
        border-[var(--color-border)]
        bg-[var(--color-primary-soft)]
        font-bold
        text-[var(--color-primary)]
        ${rounded ? "rounded-full" : "rounded-xl"}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}