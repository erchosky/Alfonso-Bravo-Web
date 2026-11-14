import type { CSSProperties } from "react";
import type { FAQThemeTokens } from "@/config/faq-widget.config";

const TOKEN_VARIABLES: Record<keyof FAQThemeTokens, string> = {
  primary: "--faq-primary",
  primaryContrast: "--faq-primary-contrast",
  background: "--faq-background",
  surface: "--faq-surface",
  text: "--faq-text",
  muted: "--faq-muted",
  border: "--faq-border",
  radius: "--faq-radius",
  shadow: "--faq-shadow",
  font: "--faq-font",
  fontHeading: "--faq-font-heading",
  zIndex: "--faq-z-index",
  pending: "--faq-pending",
};

/** Convierte tokens del tema en variables CSS para el atributo `style`. */
export function themeToStyle(theme: Partial<FAQThemeTokens>): CSSProperties {
  const style: Record<string, string> = {};
  for (const [token, value] of Object.entries(theme)) {
    if (value) style[TOKEN_VARIABLES[token as keyof FAQThemeTokens]] = value;
  }
  return style as CSSProperties;
}
