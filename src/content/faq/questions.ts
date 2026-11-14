import type { FAQAnswer, FAQQuestion } from "@/lib/faq/types";

/**
 * Preguntas frecuentes.
 *
 * Todo el contenido actual es de EJEMPLO (`status: "draft"`): solo se ve en
 * vista previa (desarrollo) y nunca en producción. Para publicar una
 * pregunta, sustituye los `[PENDIENTE: ...]` por el texto que apruebe
 * Alfonso y cambia su `status` a `"published"`.
 *
 * Para añadir una pregunta, copia un objeto y cambia `id`, `categoryId`,
 * `question`, `answer.text` y `order`.
 */

/**
 * Respuestas compartidas: una sola fuente para políticas que aparecen
 * en varias categorías.
 */
const depositAnswer: FAQAnswer = {
  text: "[PENDIENTE: Alfonso debe indicar cómo funciona la señal de reserva]",
};
export const questions: FAQQuestion[] = [
  // ── Reserva y disponibilidad ──────────────────────────────────────────
  {
    id: "booking-check-date",
    categoryId: "booking",
    question: "¿Cómo consulto si una fecha está libre?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar el canal preferido para consultar disponibilidad y qué datos necesita (fecha, lugar, tipo de evento…)]",
      showContact: true,
    },
    relatedIds: ["booking-advance", "booking-confirmation"],
    status: "draft",
    order: 10,
    enabled: true,
  },
  {
    id: "booking-advance",
    categoryId: "booking",
    question: "¿Con cuánta antelación es recomendable reservar?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar con cuánta antelación recomienda reservar]",
    },
    status: "draft",
    order: 20,
    enabled: true,
  },
  {
    id: "booking-confirmation",
    categoryId: "booking",
    question: "¿Cómo se confirma una reserva?",
    answer: {
      text: "[PENDIENTE: Alfonso debe explicar los pasos para confirmar una reserva]",
    },
    relatedIds: ["payments-deposit"],
    status: "draft",
    order: 30,
    enabled: true,
  },
  {
    id: "booking-deposit",
    categoryId: "booking",
    question: "¿Hay que pagar una señal?",
    answer: depositAnswer,
    relatedIds: ["payments-deposit"],
    status: "draft",
    order: 40,
    enabled: true,
  },

  // ── Desplazamientos ───────────────────────────────────────────────────
  {
    id: "travel-area",
    categoryId: "travel",
    question: "¿En qué zonas actúa Alfonso?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar su zona habitual de actuación]",
    },
    status: "draft",
    order: 10,
    enabled: true,
  },
  {
    id: "travel-costs",
    categoryId: "travel",
    question: "¿El desplazamiento tiene coste adicional?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar si el desplazamiento se cobra aparte y cómo se calcula]",
    },
    status: "draft",
    order: 20,
    enabled: true,
  },
  {
    id: "travel-accommodation",
    categoryId: "travel",
    question: "¿Qué ocurre si el evento es lejos o requiere alojamiento?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar cómo gestiona los eventos que requieren alojamiento]",
    },
    status: "draft",
    order: 30,
    enabled: true,
  },

  // ── Pagos y señal ─────────────────────────────────────────────────────
  {
    id: "payments-deposit",
    categoryId: "payments",
    question: "¿Cómo funciona la señal de reserva?",
    answer: depositAnswer,
    status: "draft",
    order: 10,
    enabled: true,
  },
  {
    id: "payments-methods",
    categoryId: "payments",
    question: "¿Qué formas de pago se aceptan?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar las formas de pago que acepta]",
    },
    status: "draft",
    order: 20,
    enabled: true,
  },
  {
    id: "payments-invoice",
    categoryId: "payments",
    question: "¿Se emite factura?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar si emite factura y en qué condiciones]",
    },
    status: "draft",
    order: 30,
    enabled: true,
  },

  // ── Requisitos técnicos ───────────────────────────────────────────────
  {
    id: "technical-needs",
    categoryId: "technical",
    question: "¿Qué necesitas en el lugar del evento?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar sus necesidades básicas de espacio, luz y sonido]",
    },
    status: "draft",
    order: 10,
    enabled: true,
  },
  {
    id: "technical-sound",
    categoryId: "technical",
    question: "¿Llevas equipo de sonido propio?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar si aporta equipo de sonido o lo necesita del recinto]",
    },
    status: "draft",
    order: 20,
    enabled: true,
  },
  {
    id: "technical-stage",
    categoryId: "technical",
    question: "¿Qué necesitas en un teatro o una sala?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar dónde se puede solicitar su rider técnico para teatros y salas]",
    },
    // Ejemplo de pregunta prioritaria en páginas de teatro y espectáculos.
    contexts: ["theatre", "shows"],
    status: "draft",
    order: 30,
    enabled: true,
  },
  {
    id: "technical-setup-time",
    categoryId: "technical",
    question: "¿Cuánto tiempo necesitas para prepararte antes de actuar?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar el tiempo de montaje o preparación que necesita]",
    },
    status: "draft",
    order: 40,
    enabled: true,
  },

  // ── Cambios y cancelaciones ───────────────────────────────────────────
  {
    id: "changes-date",
    categoryId: "changes",
    question: "¿Puedo cambiar la fecha una vez reservada?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar su política de cambios de fecha]",
    },
    status: "draft",
    order: 10,
    enabled: true,
  },
  {
    id: "changes-cancellation",
    categoryId: "changes",
    question: "¿Qué pasa si tengo que cancelar?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar su política de cancelación]",
    },
    relatedIds: ["payments-deposit"],
    status: "draft",
    order: 20,
    enabled: true,
  },
  {
    id: "changes-weather",
    categoryId: "changes",
    question: "¿Qué ocurre si el evento es al aire libre y hace mal tiempo?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar cómo se actúa ante imprevistos meteorológicos]",
    },
    contexts: ["weddings", "companies"],
    status: "draft",
    order: 30,
    enabled: true,
  },

  // ── Otras dudas ───────────────────────────────────────────────────────
  // Desactivadas: el público y la personalización son argumentos de las
  // páginas de Bodas, Empresas, Espectáculos y Teatro, no del widget.
  {
    id: "other-audience",
    categoryId: "other",
    question: "¿Para qué tipo de público es el espectáculo?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar para qué públicos están pensados sus espectáculos]",
    },
    status: "draft",
    order: 10,
    enabled: false,
  },
  {
    id: "other-custom",
    categoryId: "other",
    question: "¿Se puede adaptar la actuación a mi evento?",
    answer: {
      text: "[PENDIENTE: Alfonso debe indicar qué grado de personalización ofrece]",
      showContact: true,
    },
    status: "draft",
    order: 20,
    enabled: false,
  },
];
