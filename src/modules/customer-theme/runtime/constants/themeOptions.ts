export const MENU_LAYOUTS = [
  "1_column",
  "2_column",
] as const;

export const CATEGORY_LAYOUTS = [
  "scroll",
  "grid",
] as const;

export const CARD_STYLES = [
  "default",
  "minimal",
  "elevated",
] as const;

export const BUTTON_STYLES = [
  "solid",
  "outline",
] as const;

export const BORDER_RADII = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
] as const;

export const FONT_FAMILIES = [
  "Inter",
  "Poppins",
  "Manrope",
  "DM Sans",
  "Outfit",
  "Plus Jakarta Sans",
] as const;

export type MenuLayout = (typeof MENU_LAYOUTS)[number];
export type CategoryLayout = (typeof CATEGORY_LAYOUTS)[number];
export type CardStyle = (typeof CARD_STYLES)[number];
export type ButtonStyle = (typeof BUTTON_STYLES)[number];
export type BorderRadius = (typeof BORDER_RADII)[number];
export type FontFamily = (typeof FONT_FAMILIES)[number];