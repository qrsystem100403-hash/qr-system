import { DEFAULT_CUSTOMER_THEME } from "../constants/defaultTheme"
import type { CustomerThemeRow } from "../../types/database"
import type { CustomerTheme } from "../../types/theme"

export function mapCustomerTheme(
  row: CustomerThemeRow
): CustomerTheme {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,

    logoUrl: row.logo_url,
    faviconUrl: row.favicon_url,
    heroImageUrl: row.hero_image_url,
    welcomeMessage:
      row.welcome_message ??
      DEFAULT_CUSTOMER_THEME.welcomeMessage,

    primaryColor:
      row.primary_color ??
      DEFAULT_CUSTOMER_THEME.primaryColor,

    secondaryColor:
  row.secondary_color ??
  DEFAULT_CUSTOMER_THEME.secondaryColor,

accentColor:
  row.accent_color ??
  DEFAULT_CUSTOMER_THEME.accentColor,

    backgroundColor:
      row.background_color ??
      DEFAULT_CUSTOMER_THEME.backgroundColor,

    surfaceColor:
      row.surface_color ??
      DEFAULT_CUSTOMER_THEME.surfaceColor,

    textColor:
      row.text_color ??
      DEFAULT_CUSTOMER_THEME.textColor,

    mutedTextColor:
      row.muted_text_color ??
      DEFAULT_CUSTOMER_THEME.mutedTextColor,

    fontFamily:
      row.font_family ??
      DEFAULT_CUSTOMER_THEME.fontFamily,

    borderRadius:
      row.border_radius as CustomerTheme["borderRadius"],

    buttonRadius:
      row.button_radius as CustomerTheme["buttonRadius"],

    cardRadius:
      row.card_radius as CustomerTheme["cardRadius"],

    inputRadius:
      row.input_radius as CustomerTheme["inputRadius"],

    menuLayout:
      row.menu_layout as CustomerTheme["menuLayout"],

    categoryLayout:
      row.category_layout as CustomerTheme["categoryLayout"],

    cardStyle:
      row.card_style as CustomerTheme["cardStyle"],

    buttonStyle:
      row.button_style as CustomerTheme["buttonStyle"],

    showSearch: row.show_search,
    showBanner: row.show_banner,
    showPopularItems: row.show_popular_items,
    showCategoryImages: row.show_category_images,
    showItemRatings: row.show_item_ratings,
    showPoweredBy: row.show_powered_by,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}