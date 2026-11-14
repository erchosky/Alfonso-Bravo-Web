/**
 * Tipos de dominio del widget de dudas frecuentes.
 * Son independientes de la fuente de datos (local, API o IA).
 */

/** Sección de la web desde la que se abre el widget. */
export type FAQContext = "weddings" | "companies" | "shows" | "theatre";

/**
 * Estado editorial de una pregunta:
 * - `draft`: ejemplo o texto pendiente de aprobar. Solo visible en vista previa.
 * - `published`: aprobado para mostrarse a los visitantes.
 */
export type FAQStatus = "draft" | "published";

/**
 * - `faq`: al pulsarla se listan sus preguntas.
 * - `contact`: al pulsarla se muestra la pantalla de contacto.
 */
export type FAQCategoryKind = "faq" | "contact";

export interface FAQCategory {
  id: string;
  label: string;
  /** Emoji o carácter corto que acompaña a la etiqueta. */
  icon?: string;
  /** Texto breve opcional que se muestra sobre la lista de preguntas. */
  description?: string;
  kind: FAQCategoryKind;
  order: number;
  enabled: boolean;
}

export interface FAQLink {
  label: string;
  href: string;
}

export interface FAQAnswer {
  /**
   * Texto de la respuesta. Los párrafos se separan con una línea en blanco.
   * Los fragmentos `[PENDIENTE: ...]` se resaltan en vista previa.
   */
  text: string;
  /** Enlaces opcionales, p. ej. a las secciones de la web. */
  links?: FAQLink[];
  /** Muestra el acceso a contacto debajo de la respuesta. */
  showContact?: boolean;
}

export interface FAQQuestion {
  id: string;
  categoryId: string;
  question: string;
  answer: FAQAnswer;
  status: FAQStatus;
  /**
   * Secciones en las que aplica la pregunta. Si se omite, aplica en todas.
   * En páginas con contexto, las preguntas específicas se muestran primero.
   */
  contexts?: FAQContext[];
  /** Ids de otras preguntas que se sugieren al final de la respuesta. */
  relatedIds?: string[];
  order: number;
  /** Interruptor para retirar una pregunta sin borrarla. */
  enabled: boolean;
}

export type ContactChannelType = "whatsapp" | "phone" | "email" | "instagram";

export interface ContactChannel {
  type: ContactChannelType;
  label: string;
  /**
   * Dato real del canal (teléfono, email, usuario de Instagram).
   * `null` mientras no se haya facilitado: el canal no se publica.
   */
  value: string | null;
  /** Mensaje inicial opcional (solo WhatsApp y email). */
  prefilledMessage?: string;
  order: number;
}

export interface FAQContactInfo {
  title: string;
  description: string;
  channels: ContactChannel[];
}

export interface FAQQueryOptions {
  context?: FAQContext;
}

/** Textos fijos de la interfaz del widget (ver `src/content/faq/ui.ts`). */
export interface FAQUiTexts {
  launcher: { open: string; close: string };
  panel: { title: string; back: string; home: string; close: string };
  welcome: { title: string; body: string; prompt: string };
  answer: { related: string; notFound: string };
  contactPrompt: { text: string; action: string };
  states: {
    loading: string;
    error: string;
    retry: string;
    emptyCategory: string;
  };
  /** Solo en vista previa: el visitante nunca los ve. */
  preview: { badge: string; missingChannel: string; noContact: string };
}
