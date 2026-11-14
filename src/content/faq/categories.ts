import type { FAQCategory } from "@/lib/faq/types";

/**
 * Menú principal del widget.
 * Las categorías sin preguntas activas se ocultan automáticamente
 * (salvo las de tipo `contact`).
 */
export const categories: FAQCategory[] = [
  {
    id: "booking",
    label: "Reserva y disponibilidad",
    icon: "📅",
    kind: "faq",
    order: 10,
    enabled: true,
  },
  {
    id: "travel",
    label: "Desplazamientos",
    icon: "📍",
    kind: "faq",
    order: 20,
    enabled: true,
  },
  {
    id: "payments",
    label: "Pagos y señal",
    icon: "💳",
    kind: "faq",
    order: 30,
    enabled: true,
  },
  {
    id: "technical",
    label: "Requisitos técnicos",
    icon: "🎤",
    kind: "faq",
    order: 40,
    enabled: true,
  },
  {
    id: "changes",
    label: "Cambios y cancelaciones",
    icon: "🔄",
    kind: "faq",
    order: 50,
    enabled: true,
  },
  {
    id: "other",
    label: "Otras dudas",
    icon: "❓",
    kind: "faq",
    order: 60,
    enabled: true,
  },
  {
    id: "contact",
    label: "Contactar",
    icon: "💬",
    kind: "contact",
    order: 70,
    enabled: true,
  },
];
