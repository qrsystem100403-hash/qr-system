import type { SupabaseClient } from "@supabase/supabase-js";

import { mapCustomerTheme } from "../runtime/mappers/customerThemeMapper";
import type { CustomerThemeRow } from "../types/database";
import type {
  CustomerTheme,
  CustomerThemeUpdate,
} from "../types/theme";

export class CustomerThemeRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  async findByRestaurantId(
    restaurantId: string,
  ): Promise<CustomerTheme | null> {
    const { data, error } = await this.supabase
      .from("restaurant_customer_theme")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapCustomerTheme(data as CustomerThemeRow);
  }

  async create(
    restaurantId: string,
  ): Promise<CustomerTheme> {
    const { data, error } = await this.supabase
      .from("restaurant_customer_theme")
      .insert({
        restaurant_id: restaurantId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapCustomerTheme(data as CustomerThemeRow);
  }

  async update(
    restaurantId: string,
    updates: CustomerThemeUpdate,
  ): Promise<CustomerTheme> {
    const payload = this.toDatabase(updates);

    const { data, error } = await this.supabase
      .from("restaurant_customer_theme")
      .update(payload)
      .eq("restaurant_id", restaurantId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapCustomerTheme(data as CustomerThemeRow);
  }

  private toDatabase(
    updates: CustomerThemeUpdate,
  ): Partial<CustomerThemeRow> {
    const payload: Partial<CustomerThemeRow> = {};

    if (updates.logoUrl !== undefined)
      payload.logo_url = updates.logoUrl;

    if (updates.faviconUrl !== undefined)
      payload.favicon_url = updates.faviconUrl;

    if (updates.heroImageUrl !== undefined)
      payload.hero_image_url = updates.heroImageUrl;

    if (updates.welcomeMessage !== undefined)
      payload.welcome_message = updates.welcomeMessage;

    if (updates.primaryColor !== undefined)
      payload.primary_color = updates.primaryColor;

    if (updates.secondaryColor !== undefined)
      payload.secondary_color = updates.secondaryColor;

    if (updates.accentColor !== undefined)
      payload.accent_color = updates.accentColor;

    if (updates.backgroundColor !== undefined)
      payload.background_color = updates.backgroundColor;

    if (updates.surfaceColor !== undefined)
      payload.surface_color = updates.surfaceColor;

    if (updates.textColor !== undefined)
      payload.text_color = updates.textColor;

    if (updates.mutedTextColor !== undefined)
      payload.muted_text_color = updates.mutedTextColor;

    if (updates.fontFamily !== undefined)
      payload.font_family = updates.fontFamily;

    if (updates.borderRadius !== undefined)
      payload.border_radius = updates.borderRadius;

    if (updates.buttonRadius !== undefined)
      payload.button_radius = updates.buttonRadius;

    if (updates.cardRadius !== undefined)
      payload.card_radius = updates.cardRadius;

    if (updates.inputRadius !== undefined)
      payload.input_radius = updates.inputRadius;

    if (updates.menuLayout !== undefined)
      payload.menu_layout = updates.menuLayout;

    if (updates.categoryLayout !== undefined)
      payload.category_layout = updates.categoryLayout;

    if (updates.cardStyle !== undefined)
      payload.card_style = updates.cardStyle;

    if (updates.buttonStyle !== undefined)
      payload.button_style = updates.buttonStyle;

    if (updates.showSearch !== undefined)
      payload.show_search = updates.showSearch;

    if (updates.showBanner !== undefined)
      payload.show_banner = updates.showBanner;

    if (updates.showPopularItems !== undefined)
      payload.show_popular_items = updates.showPopularItems;

    if (updates.showCategoryImages !== undefined)
      payload.show_category_images = updates.showCategoryImages;

    if (updates.showItemRatings !== undefined)
      payload.show_item_ratings = updates.showItemRatings;

    if (updates.showPoweredBy !== undefined)
      payload.show_powered_by = updates.showPoweredBy;

    return payload;
  }
}