import { CUSTOMER_THEME_VARIABLES } from "../constants/cssVariables";
import type { CustomerTheme } from "../../types/theme";

export function applyCustomerTheme(
  element: HTMLElement,
  theme: CustomerTheme
) {
  const mappings = [
    ["primaryColor", theme.primaryColor],
    ["secondaryColor", theme.secondaryColor],
    ["accentColor", theme.accentColor],

    ["backgroundColor", theme.backgroundColor],
    ["surfaceColor", theme.surfaceColor],

    ["textColor", theme.textColor],
    ["mutedTextColor", theme.mutedTextColor],

    ["buttonRadius", theme.buttonRadius],
    ["cardRadius", theme.cardRadius],
    ["inputRadius", theme.inputRadius],

    ["fontFamily", theme.fontFamily],
  ] as const;

  for (const [key, value] of mappings) {
    if (!value) continue;

    element.style.setProperty(
      CUSTOMER_THEME_VARIABLES[key],
      String(value)
    );
  }
}