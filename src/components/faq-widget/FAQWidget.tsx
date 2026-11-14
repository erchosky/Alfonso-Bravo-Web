"use client";

import { usePathname } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  faqWidgetConfig,
  type FAQThemeTokens,
  type FAQWidgetPosition,
} from "@/config/faq-widget.config";
import type { FAQProvider } from "@/lib/faq/provider";
import type { MascotActivity, MascotMode } from "@/config/faq-mascot.config";
import { resolveContextFromPath } from "@/lib/faq/route-context";
import type { FAQContext } from "@/lib/faq/types";
import { FAQErrorBoundary } from "./FAQErrorBoundary";
import { FAQPanel } from "./FAQPanel";
import { FAQWidgetContextProvider } from "./FAQWidgetContext";
import { FloatingButton } from "./FloatingButton";
import { useFAQAvailability } from "./hooks/use-faq-availability";
import { useFAQNavigation } from "./hooks/use-faq-navigation";
import { useMediaQuery } from "./hooks/use-media-query";
import { useModalIsolation } from "./hooks/use-modal-isolation";
import { usePanelDismiss } from "./hooks/use-panel-dismiss";
import { useSeenFlag } from "./hooks/use-seen-flag";
import { useSingleInstanceWarning } from "./hooks/use-single-instance-warning";
import { themeToStyle } from "./theme";
import "./faq-widget.css";

export interface FAQWidgetProps {
  /**
   * Sección de la web (prioriza sus preguntas). Si se omite, se deduce de la
   * ruta con `contextRoutes` de la configuración.
   */
  context?: FAQContext;
  /**
   * Fuente de datos. Por defecto, la de la configuración. Solo puede pasarse
   * desde un Client Component (una instancia de clase no es serializable).
   */
  provider?: FAQProvider;
  position?: FAQWidgetPosition;
  theme?: Partial<FAQThemeTokens>;
}

/**
 * Widget flotante de dudas frecuentes. Monta una sola instancia, normalmente
 * en el layout raíz.
 *
 * Está dentro de `Suspense` porque lee la ruta actual: con Cache Components,
 * `usePathname` puede suspender en rutas dinámicas. El widget no aporta nada
 * al HTML inicial, así que el fallback vacío no tiene coste. Un error dentro
 * del widget lo oculta sin afectar al resto de la página.
 */
export function FAQWidget(props: FAQWidgetProps) {
  return (
    <FAQErrorBoundary>
      <Suspense fallback={null}>
        <FAQWidgetInner {...props} />
      </Suspense>
    </FAQErrorBoundary>
  );
}

function FAQWidgetInner({
  context: contextProp,
  provider: providerProp,
  position = faqWidgetConfig.position,
  theme,
}: FAQWidgetProps) {
  const pathname = usePathname();
  const context =
    contextProp ??
    resolveContextFromPath(faqWidgetConfig.contextRoutes, pathname);

  const provider = useMemo(
    () => providerProp ?? faqWidgetConfig.createProvider(),
    [providerProp],
  );
  const style = useMemo(
    () => themeToStyle({ ...faqWidgetConfig.theme, ...theme }),
    [theme],
  );

  const [open, setOpen] = useState(false);
  const [mascotActivity, setMascotActivity] = useState<MascotActivity>("ready");
  const [seen, markSeen] = useSeenFlag(faqWidgetConfig.seenStorageKey);
  const navigation = useFAQNavigation(context ?? "");
  const { visible, hasContact } = useFAQAvailability(provider, context);
  const isSheet = useMediaQuery(faqWidgetConfig.sheetMediaQuery);
  const isOpen = open && visible;
  const mascotMode: MascotMode = mascotActivity !== "ready"
    ? mascotActivity
    : navigation.screen.type === "contact" ? "contact" : "active";

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusOnClose = useRef(false);
  const panelId = useId();

  /** `returnFocus` devuelve el foco al botón flotante tras cerrar. */
  const close = useCallback((returnFocus = true) => {
    returnFocusOnClose.current = returnFocus;
    setOpen(false);
    setMascotActivity("ready");
  }, []);

  const toggle = () => {
    if (open) return close();
    setOpen(true);
    if (!seen) markSeen();
  };

  useEffect(() => {
    if (!isOpen && returnFocusOnClose.current) {
      returnFocusOnClose.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useModalIsolation(rootRef, isOpen && isSheet);
  usePanelDismiss({
    open: isOpen,
    modal: isSheet,
    closeOnOutsideClick: faqWidgetConfig.closeOnOutsideClick,
    rootRef,
    onDismiss: close,
  });
  useSingleInstanceWarning();

  const contextValue = useMemo(
    () => ({
      provider,
      context,
      texts: faqWidgetConfig.texts,
      preview: faqWidgetConfig.preview,
      hasContact,
      closePanel: () => close(false),
      setMascotActivity,
      mascotMode,
    }),
    [provider, context, hasContact, close, mascotMode],
  );

  // Sin preguntas publicables ni contacto, el widget no existe para el visitante.
  if (!visible) return null;

  return (
    <FAQWidgetContextProvider value={contextValue}>
      <div ref={rootRef} className="faq-widget" style={style}>
        {isOpen && (
          <FAQPanel
            id={panelId}
            navigation={navigation}
            position={position}
            layout={isSheet ? "sheet" : "floating"}
            closeOnBackdropClick={faqWidgetConfig.closeOnOutsideClick}
            onClose={() => close()}
          />
        )}
        <FloatingButton
          ref={triggerRef}
          open={isOpen}
          hidden={isOpen && isSheet}
          mode={mascotMode}
          label={faqWidgetConfig.texts.launcher.open}
          closeLabel={faqWidgetConfig.texts.launcher.close}
          controlsId={panelId}
          position={position}
          showIndicator={!seen}
          onClick={toggle}
        />
      </div>
    </FAQWidgetContextProvider>
  );
}
