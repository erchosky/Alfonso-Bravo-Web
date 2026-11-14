import type { ContactChannel } from "./types";

const digitCount = (value: string) => value.replace(/\D/g, "").length;

const VALIDATORS: Record<ContactChannel["type"], (value: string) => boolean> =
  {
    // WhatsApp exige el prefijo internacional: al menos 10 dígitos en total.
    whatsapp: (v) => /^\+?[\d\s-]+$/.test(v) && digitCount(v) >= 10 && digitCount(v) <= 15,
    phone: (v) => /^\+?[\d\s()-]+$/.test(v) && digitCount(v) >= 6 && digitCount(v) <= 15,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    instagram: (v) => /^@?[A-Za-z0-9._]{1,30}$/.test(v),
  };

/** Construye el enlace de un canal o `null` si no tiene un dato válido. */
export function buildContactHref(channel: ContactChannel): string | null {
  const value = channel.value?.trim();
  if (!value || !VALIDATORS[channel.type](value)) return null;

  const message = channel.prefilledMessage
    ? encodeURIComponent(channel.prefilledMessage)
    : null;

  switch (channel.type) {
    case "whatsapp":
      return `https://wa.me/${value.replace(/\D/g, "")}${message ? `?text=${message}` : ""}`;
    case "phone":
      return `tel:${value.replace(/[^\d+]/g, "")}`;
    case "email":
      return `mailto:${value}${message ? `?body=${message}` : ""}`;
    case "instagram":
      return `https://instagram.com/${value.replace(/^@/, "")}`;
  }
}

export function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}
