import type { CustomerTheme } from "../../types/theme"

export const DEFAULT_CUSTOMER_THEME: Omit<
  CustomerTheme,
  | "id"
  | "restaurantId"
  | "createdAt"
  | "updatedAt"
> = {
  // Branding
  logoUrl: null,
  faviconUrl: null,
  heroImageUrl: null,
  welcomeMessage: "Welcome",

  // Colors
  primaryColor: "#D4AF37",
  secondaryColor: "#1E293B",
accentColor: "#F59E0B",

  backgroundColor: "#0F1115",
  surfaceColor: "#181B20",

  textColor: "#FFFFFF",
  mutedTextColor: "#A1A1AA",

  // Typography
  fontFamily: "Inter",

  // Shape
  borderRadius: "lg",
  buttonRadius: "lg",
  cardRadius: "xl",
  inputRadius: "lg",

  // Layout
  menuLayout: "2_column",
  categoryLayout: "scroll",

  cardStyle: "default",
  buttonStyle: "solid",

  // Features
  showSearch: true,
  showBanner: true,
  showPopularItems: true,
  showCategoryImages: true,
  showItemRatings: true,
  showPoweredBy: true,
}