import type { FAQContactInfo } from "@/lib/faq/types";

/**
 * Datos de contacto del widget.
 *
 * Mientras `value` sea `null` (o tenga un formato no válido), el canal no se
 * publica. Si no queda ningún canal, en producción se ocultan la categoría
 * «Contactar» y todos los accesos a contacto. Formatos esperados:
 * - whatsapp: número internacional sin espacios ni "+", p. ej. "34XXXXXXXXX"
 * - phone: número tal y como debe marcarse, p. ej. "+34XXXXXXXXX"
 * - email: dirección completa
 * - instagram: nombre de usuario sin "@"
 */
export const contact: FAQContactInfo = {
  title: "¿Hablamos?",
  description:
    "Si tu duda no aparece aquí, puedes escribir directamente por cualquiera de estos canales.",
  channels: [
    {
      type: "whatsapp",
      label: "WhatsApp",
      value: null,
      prefilledMessage: "Hola, tengo una duda sobre una actuación.",
      order: 10,
    },
    {
      type: "phone",
      label: "Llamar",
      value: null,
      order: 20,
    },
    {
      type: "email",
      label: "Email",
      value: null,
      prefilledMessage: "Hola, tengo una duda sobre una actuación.",
      order: 30,
    },
    {
      type: "instagram",
      label: "Instagram",
      value: null,
      order: 40,
    },
  ],
};
