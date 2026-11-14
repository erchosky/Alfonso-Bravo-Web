import { categories } from "@/content/faq/categories";
import { contact } from "@/content/faq/contact";
import { questions } from "@/content/faq/questions";
import { faqUi } from "@/content/faq/ui";
import { LocalFAQProvider } from "@/lib/faq/local-provider";
import type { FAQProvider } from "@/lib/faq/provider";
import type { FAQContextRoute } from "@/lib/faq/route-context";
import type { FAQUiTexts } from "@/lib/faq/types";

/**
 * Configuración técnica del widget: comportamiento, tema y fuente de datos.
 * Los textos NO se editan aquí, sino en `src/content/faq/`.
 */

/**
 * Tokens visuales. Cada clave corresponde a una variable CSS `--faq-*`.
 * Los valores por defecto viven en `src/components/faq-widget/faq-widget.css`.
 */
export interface FAQThemeTokens {
  primary: string;
  primaryContrast: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  radius: string;
  shadow: string;
  font: string;
  fontHeading: string;
  zIndex: string;
  /** Color de las marcas [PENDIENTE] y la franja de vista previa. */
  pending: string;
}

export type FAQWidgetPosition = "bottom-right" | "bottom-left";

export interface FAQWidgetConfig {
  position: FAQWidgetPosition;
  /**
   * Vista previa: muestra borradores, marcas [PENDIENTE] y canales sin dato.
   * Activa en desarrollo o con NEXT_PUBLIC_FAQ_PREVIEW=true (p. ej. staging).
   */
  preview: boolean;
  /** Contexto según la ruta actual. La prop `context` tiene prioridad. */
  contextRoutes: FAQContextRoute[];
  /**
   * Cuándo el panel pasa a hoja modal a pantalla casi completa
   * (móvil vertical y horizontal). Fuera de ella es un panel flotante no modal.
   */
  sheetMediaQuery: string;
  /** Sobrescribe tokens concretos sin tocar el CSS. */
  theme: Partial<FAQThemeTokens>;
  /** Textos de la interfaz: se editan en `src/content/faq/ui.ts`. */
  texts: FAQUiTexts;
  /** Cierra el panel al pulsar fuera de él. */
  closeOnOutsideClick: boolean;
  /** Clave de localStorage para recordar si el usuario ya abrió el widget. */
  seenStorageKey: string;
  createProvider: () => FAQProvider;
}

const preview =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_FAQ_PREVIEW === "true";

export const faqWidgetConfig: FAQWidgetConfig = {
  position: "bottom-right",
  preview,
  // Rellenar cuando existan las secciones, p. ej.:
  // { pathPrefix: "/bodas", context: "weddings" },
  contextRoutes: [],
  sheetMediaQuery: "(max-width: 639px), (max-height: 559px)",
  theme: {},
  texts: faqUi,
  closeOnOutsideClick: true,
  seenStorageKey: "faq-widget:seen",
  createProvider: () =>
    new LocalFAQProvider({ categories, questions, contact }, { preview }),
};
