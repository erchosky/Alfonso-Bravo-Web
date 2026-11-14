"use client";

import { useRef } from "react";
import { useFAQWidget } from "../FAQWidgetContext";
import { useFocusOnMount } from "../hooks/use-focus-on-mount";

/** Clave de foco para volver a este enlace desde la pantalla de contacto. */
export const CONTACT_PROMPT_KEY = "contact-prompt";

/**
 * Acceso discreto a la pantalla de contacto al pie de una pantalla.
 * No se muestra si no hay ningún canal de contacto disponible.
 */
export function ContactPrompt({
  onContact,
  autoFocus,
}: {
  onContact: () => void;
  autoFocus?: boolean;
}) {
  const { texts, hasContact } = useFAQWidget();
  const ref = useRef<HTMLButtonElement>(null);
  useFocusOnMount(ref, autoFocus);

  if (!hasContact) return null;

  return (
    <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-(--faq-border) pt-3 text-sm text-(--faq-muted)">
      {texts.contactPrompt.text}
      <button
        ref={ref}
        type="button"
        onClick={onContact}
        className="inline-flex min-h-9 items-center rounded-sm font-medium text-(--faq-primary) underline-offset-4 hover:underline"
      >
        {texts.contactPrompt.action}
      </button>
    </p>
  );
}
