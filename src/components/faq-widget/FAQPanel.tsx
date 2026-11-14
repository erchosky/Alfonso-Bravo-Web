"use client";

import { useEffect, useRef } from "react";
import type { FAQWidgetPosition } from "@/config/faq-widget.config";
import { screenKey } from "@/lib/faq/navigation";
import { useFAQWidget } from "./FAQWidgetContext";
import { useFocusTrap } from "./hooks/use-focus-trap";
import type { FAQNavigation } from "./hooks/use-faq-navigation";
import { PanelHeader } from "./PanelHeader";
import { CurrentScreen } from "./screens/CurrentScreen";

export type FAQPanelLayout = "floating" | "sheet";

interface FAQPanelProps {
  id: string;
  navigation: FAQNavigation;
  position: FAQWidgetPosition;
  /** `sheet`: diálogo modal (móvil). `floating`: panel no modal (escritorio). */
  layout: FAQPanelLayout;
  closeOnBackdropClick: boolean;
  onClose: () => void;
}

/** Armazón del panel: fondo, diálogo, cabecera y gestión del foco. */
export function FAQPanel({
  id,
  navigation,
  position,
  layout,
  closeOnBackdropClick,
  onClose,
}: FAQPanelProps) {
  const { texts, preview } = useFAQWidget();
  const panelRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const titleId = `${id}-title`;
  const modal = layout === "sheet";
  const { screen, restoreFocusKey, depth, push, back, home } = navigation;
  const currentKey = screenKey(screen);

  useFocusTrap(panelRef, modal);

  // Al cambiar de pantalla el foco pasa a su encabezado; si aún está
  // cargando, al contenedor (el encabezado lo recogerá al aparecer).
  useEffect(() => {
    const container = screenRef.current;
    if (!container || container.contains(document.activeElement)) return;
    const heading = container.querySelector<HTMLElement>("[data-faq-heading]");
    (heading ?? container).focus({ preventScroll: true });
  }, [currentKey]);

  // Al pasar a modal con el foco fuera (p. ej. al girar el móvil), se recupera.
  useEffect(() => {
    if (modal && !panelRef.current?.contains(document.activeElement)) {
      screenRef.current?.focus({ preventScroll: true });
    }
  }, [modal]);

  return (
    <>
      {modal && (
        <div
          aria-hidden="true"
          onClick={closeOnBackdropClick ? onClose : undefined}
          className="faq-animate-backdrop fixed inset-0 z-(--faq-z-index) touch-none bg-black/55"
        />
      )}

      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal={modal}
        aria-labelledby={titleId}
        data-layout={layout}
        data-position={position}
        className="faq-panel faq-animate-panel faq-panel-edge flex flex-col overflow-hidden rounded-(--faq-radius) border border-(--faq-border) bg-(--faq-background) text-(--faq-text) shadow-(--faq-shadow)"
      >
        <PanelHeader
          titleId={titleId}
          depth={depth}
          onBack={back}
          onHome={home}
          onClose={onClose}
        />

        {preview && (
          <p className="shrink-0 border-b border-(--faq-border) py-1 text-center text-[11px] tracking-wide text-(--faq-pending)">
            {texts.preview.badge}
          </p>
        )}

        <div
          ref={screenRef}
          // La key reinicia la animación, el scroll y el foco en cada pantalla.
          key={currentKey}
          tabIndex={-1}
          data-faq-screen
          className="faq-animate-screen flex flex-1 flex-col overflow-y-auto overscroll-contain px-4 pt-4 pb-5 outline-none"
        >
          <CurrentScreen
            screen={screen}
            restoreFocusKey={restoreFocusKey}
            push={push}
          />
        </div>
      </div>
    </>
  );
}
