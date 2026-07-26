import type {
  BORDER_RADII,
  BUTTON_STYLES,
  CARD_STYLES,
  CATEGORY_LAYOUTS,
  MENU_LAYOUTS,
} from "../runtime/constants/themeOptions";

export type MenuLayout = (typeof MENU_LAYOUTS)[number];
export type CategoryLayout = (typeof CATEGORY_LAYOUTS)[number];
export type CardStyle = (typeof CARD_STYLES)[number];
export type ButtonStyle = (typeof BUTTON_STYLES)[number];
export type BorderRadius = (typeof BORDER_RADII)[number];

export interface CustomerTheme {
  id: string;
  restaurantId: string;

  // Branding
  logoUrl: string | null;
  faviconUrl: string | null;
  heroImageUrl: string | null;
  welcomeMessage: string | null;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;

  // Typography
  fontFamily: string;

  // Radius
  borderRadius: BorderRadius;
  buttonRadius: BorderRadius;
  cardRadius: BorderRadius;
  inputRadius: BorderRadius;

  // Layout
  menuLayout: MenuLayout;
  categoryLayout: CategoryLayout;
  cardStyle: CardStyle;
  buttonStyle: ButtonStyle;

  // Features
  showSearch: boolean;
  showBanner: boolean;
  showPopularItems: boolean;
  showCategoryImages: boolean;
  showItemRatings: boolean;
  showPoweredBy: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CustomerThemeUpdate {
  // Branding
  logoUrl?: string | null;
  faviconUrl?: string | null;
  heroImageUrl?: string | null;
  welcomeMessage?: string | null;

  // Colors
primaryColor?: string;
secondaryColor?: string | null;
accentColor?: string | null;
backgroundColor?: string | null;
surfaceColor?: string | null;
textColor?: string | null;
mutedTextColor?: string | null;

  // Typography
  fontFamily?: string;

  // Radius
  borderRadius?: BorderRadius;
  buttonRadius?: BorderRadius;
  cardRadius?: BorderRadius;
  inputRadius?: BorderRadius;

  // Layout
  menuLayout?: MenuLayout;
  categoryLayout?: CategoryLayout;
  cardStyle?: CardStyle;
  buttonStyle?: ButtonStyle;

  // Features
  showSearch?: boolean;
  showBanner?: boolean;
  showPopularItems?: boolean;
  showCategoryImages?: boolean;
  showItemRatings?: boolean;
  showPoweredBy?: boolean;
}