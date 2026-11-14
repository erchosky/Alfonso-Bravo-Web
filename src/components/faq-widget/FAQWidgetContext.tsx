"use client";

import { createContext, useContext } from "react";
import type { MascotActivity, MascotMode } from "@/config/faq-mascot.config";
import type { FAQProvider } from "@/lib/faq/provider";
import type { FAQContext, FAQUiTexts } from "@/lib/faq/types";

interface FAQWidgetContextValue {
  provider: FAQProvider;
  context?: FAQContext;
  texts: FAQUiTexts;
  /** Vista previa: borradores y placeholders visibles. */
  preview: boolean;
  /** Hay al menos un canal de contacto disponible. */
  hasContact: boolean;
  /** Cierra el panel (p. ej. al seguir un enlace a otra página). */
  closePanel: () => void;
  setMascotActivity: (activity: MascotActivity) => void;
  mascotMode: MascotMode;
}

const FAQWidgetContext = createContext<FAQWidgetContextValue | null>(null);

export const FAQWidgetContextProvider = FAQWidgetContext.Provider;

/** Acceso a la fuente de datos, los textos y el estado global del widget. */
export function useFAQWidget() {
  const value = useContext(FAQWidgetContext);
  if (!value) {
    throw new Error("useFAQWidget debe usarse dentro de <FAQWidget />");
  }
  return value;
}
