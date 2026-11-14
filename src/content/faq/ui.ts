import type { FAQUiTexts } from "@/lib/faq/types";

/**
 * Textos fijos de la interfaz del widget, agrupados por zona de la pantalla.
 * Se pueden editar libremente: no afectan al funcionamiento.
 */
export const faqUi: FAQUiTexts = {
  // Botón flotante de la esquina.
  launcher: {
    open: "¿Tienes alguna duda?",
    close: "Cerrar",
  },

  // Cabecera del panel. back/home/close los leen los lectores de pantalla.
  panel: {
    title: "Dudas frecuentes",
    back: "Volver",
    home: "Menú principal",
    close: "Cerrar",
  },

  // Pantalla inicial.
  welcome: {
    title: "✨ Hola",
    body: "Soy el asistente de Alfonso. Estoy aquí para resolver las dudas más habituales antes de contratar.",
    prompt: "¿Sobre qué tienes dudas?",
  },

  // Pantalla de respuesta.
  answer: {
    related: "También te puede interesar",
    notFound: "No hemos encontrado esta pregunta.",
  },

  // Enlace a contacto al pie de las pantallas.
  contactPrompt: {
    text: "¿Necesitas algo más concreto?",
    action: "Contactar",
  },

  // Carga, errores y listas vacías.
  states: {
    loading: "Cargando…",
    error: "No se ha podido cargar la información.",
    retry: "Reintentar",
    emptyCategory: "Todavía no hay preguntas en esta categoría.",
  },

  // Solo en vista previa (desarrollo): el visitante nunca ve estos textos.
  preview: {
    badge: "Vista previa",
    missingChannel: "[PENDIENTE: falta el dato]",
    noContact:
      "[PENDIENTE: añade al menos un canal válido en src/content/faq/contact.ts]",
  },
};
