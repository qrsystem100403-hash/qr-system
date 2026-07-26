export interface CustomerThemeRow {
  id: string

  restaurant_id: string

  logo_url: string | null
  favicon_url: string | null
  hero_image_url: string | null
  welcome_message: string | null

  primary_color: string
  secondary_color: string | null
  accent_color: string | null

  background_color: string | null
  surface_color: string | null

  text_color: string | null
  muted_text_color: string | null

  font_family: string

  border_radius: string
  button_radius: string
  card_radius: string
  input_radius: string

  menu_layout: string
  category_layout: string

  card_style: string
  button_style: string

  show_search: boolean
  show_banner: boolean
  show_popular_items: boolean
  show_category_images: boolean
  show_item_ratings: boolean
  show_powered_by: boolean

  created_at: string
  updated_at: string
}