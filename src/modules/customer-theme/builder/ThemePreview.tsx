import Image from "next/image";
import type { CustomerTheme } from "../types/theme";

type Props = {
  theme: CustomerTheme;
};

const categories = [
  "Pizza",
  "Burger",
  "Drinks",
  "Desserts",
];

const items = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: "₹299",
  },
  {
    id: 2,
    name: "Veg Burger",
    price: "₹199",
  },
  {
    id: 3,
    name: "Cold Coffee",
    price: "₹149",
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    price: "₹179",
  },
];

const radiusMap = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
} as const;

export default function ThemePreview({ theme }: Props) {
  return (
    <aside
      className="sticky top-6 overflow-hidden rounded-2xl border shadow-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Hero */}

      <div
        className="relative h-40"
        style={{
          backgroundColor: theme.primaryColor,
        }}
      >
        {theme.heroImageUrl && (
          <Image
            src={theme.heroImageUrl}
            alt=""
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-5">
        {/* Logo */}

        <div className="-mt-14 mb-4 flex justify-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow">
            {theme.logoUrl ? (
              <Image
                src={theme.logoUrl}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold">
                Logo
              </div>
            )}
          </div>
        </div>

        {/* Restaurant */}

        <h2
          className="text-center text-2xl font-bold"
          style={{
            color: theme.textColor,
          }}
        >
          Pizza Palace
        </h2>

        <p
          className="mt-2 text-center text-sm"
          style={{
            color: theme.mutedTextColor,
          }}
        >
          {theme.welcomeMessage ||
            "Welcome to our restaurant"}
        </p>

        {/* Search */}

        {theme.showSearch && (
          <input
            placeholder="Search menu..."
            readOnly
            className="mt-5 w-full border px-3 py-2 outline-none"
            style={{
              background: "#fff",
              borderRadius:
                radiusMap[theme.inputRadius],
            }}
          />
        )}

        {/* Categories */}

        <div
          className={
            theme.categoryLayout === "grid"
              ? "mt-5 grid grid-cols-2 gap-2"
              : "mt-5 flex gap-2 overflow-x-auto pb-1"
          }
        >
          {categories.map((category) => (
            <div
              key={category}
              className="whitespace-nowrap px-3 py-2 text-sm font-medium"
              style={{
                background:
                  theme.surfaceColor,
                color: theme.textColor,
                borderRadius:
                  radiusMap[
                    theme.buttonRadius
                  ],
              }}
            >
              {category}
            </div>
          ))}
        </div>

        {/* Menu */}

        <div
          className={`mt-6 grid gap-4 ${
            theme.menuLayout === "2_column"
              ? "grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`transition ${
                theme.cardStyle ===
                "minimal"
                  ? ""
                  : theme.cardStyle ===
                    "elevated"
                  ? "shadow-lg"
                  : "border"
              }`}
              style={{
                background:
                  theme.surfaceColor,
                borderRadius:
                  radiusMap[
                    theme.cardRadius
                  ],
                padding: 16,
              }}
            >
              <div
                className="font-semibold"
                style={{
                  color: theme.textColor,
                }}
              >
                {item.name}
              </div>

              <div
                className="mt-1 text-sm"
                style={{
                  color:
                    theme.mutedTextColor,
                }}
              >
                {item.price}
              </div>

              <button
                className="mt-4 w-full py-2 font-medium transition"
                style={{
                  borderRadius:
                    radiusMap[
                      theme.buttonRadius
                    ],
                  background:
                    theme.buttonStyle ===
                    "solid"
                      ? theme.primaryColor
                      : "transparent",
                  color:
                    theme.buttonStyle ===
                    "solid"
                      ? "#fff"
                      : theme.primaryColor,
                  border:
                    theme.buttonStyle ===
                    "outline"
                      ? `2px solid ${theme.primaryColor}`
                      : "none",
                }}
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Powered By */}

        {theme.showPoweredBy && (
          <div
            className="mt-8 text-center text-xs"
            style={{
              color: theme.mutedTextColor,
            }}
          >
            Powered by Your Restaurant
          </div>
        )}
      </div>
    </aside>
  );
}