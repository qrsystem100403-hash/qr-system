import { z } from "zod"

import {
  BORDER_RADII,
  BUTTON_STYLES,
  CARD_STYLES,
  CATEGORY_LAYOUTS,
  MENU_LAYOUTS,
} from "../runtime/constants/themeOptions"

export const customerThemeSchema = z.object({
  // Branding
  logoUrl: z.string().url().nullable().optional(),

  faviconUrl: z.string().url().nullable().optional(),

  heroImageUrl: z.string().url().nullable().optional(),

  welcomeMessage: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),

  // Colors
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),

  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),

  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),

  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),

  surfaceColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),

  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),

  mutedTextColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),

  // Typography
  fontFamily: z
    .string()
    .trim()
    .max(100)
    .optional(),

  // Shape
  borderRadius: z.enum(BORDER_RADII).optional(),

  buttonRadius: z.enum(BORDER_RADII).optional(),

  cardRadius: z.enum(BORDER_RADII).optional(),

  inputRadius: z.enum(BORDER_RADII).optional(),

  // Layout
  menuLayout: z.enum(MENU_LAYOUTS).optional(),

  categoryLayout: z.enum(CATEGORY_LAYOUTS).optional(),

  cardStyle: z.enum(CARD_STYLES).optional(),

  buttonStyle: z.enum(BUTTON_STYLES).optional(),

  // Features
  showSearch: z.boolean().optional(),

  showBanner: z.boolean().optional(),

  showPopularItems: z.boolean().optional(),

  showCategoryImages: z.boolean().optional(),

  showItemRatings: z.boolean().optional(),

  showPoweredBy: z.boolean().optional(),
})

export type CustomerThemeInput = z.infer<
  typeof customerThemeSchema
>