import type {
  FAQCategory,
  FAQContactInfo,
  FAQQueryOptions,
  FAQQuestion,
} from "./types";

/**
 * Contrato entre la interfaz del widget y su fuente de datos.
 *
 * Los componentes solo conocen esta interfaz. Para cambiar de origen
 * (API, CMS, IA...) basta con crear otra implementación —p. ej.
 * `ApiFAQProvider` o `AIFAQProvider`— y pasarla al widget.
 *
 * Reglas que debe cumplir cualquier implementación:
 * - Devolver solo contenido publicable para el visitante.
 * - `getCategories` omite las categorías sin preguntas y la de contacto
 *   cuando no hay ningún canal disponible. El widget se oculta si no
 *   recibe ninguna categoría.
 */
export interface FAQProvider {
  getCategories(options?: FAQQueryOptions): Promise<FAQCategory[]>;
  getQuestions(
    categoryId: string,
    options?: FAQQueryOptions,
  ): Promise<FAQQuestion[]>;
  getQuestion(
    id: string,
    options?: FAQQueryOptions,
  ): Promise<FAQQuestion | null>;
  getContact(): Promise<FAQContactInfo>;
}
