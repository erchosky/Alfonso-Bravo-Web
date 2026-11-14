"use client";

import { useRef, type ReactNode } from "react";
import { useFocusOnMount } from "../hooks/use-focus-on-mount";

type HeadingSize = "md" | "lg";

/**
 * Encabezado de cada pantalla. El panel lo enfoca al cambiar de pantalla;
 * si llega tarde (carga lenta), lo toma él mismo al aparecer.
 */
export function ScreenHeading({
  children,
  size = "md",
}: {
  children: ReactNode;
  size?: HeadingSize;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useFocusOnMount(ref, true);

  return (
    <h2
      ref={ref}
      tabIndex={-1}
      data-faq-heading
      className={`font-medium text-balance break-words text-(--faq-text) ${
        size === "lg" ? "text-[17px] leading-snug" : "text-[15px] leading-snug"
      }`}
    >
      {children}
    </h2>
  );
}

/** Bloque superior de una pantalla: ubicación, título y descripción. */
export function ScreenHeader({
  eyebrow,
  title,
  description,
  size,
}: {
  /** Texto pequeño sobre el título para situar al usuario. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: string;
  size?: HeadingSize;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {eyebrow && (
        <p className="text-xs tracking-wide text-(--faq-muted)">{eyebrow}</p>
      )}
      <ScreenHeading size={size}>{title}</ScreenHeading>
      {description && (
        <p className="text-sm leading-relaxed text-(--faq-muted)">
          {description}
        </p>
      )}
    </div>
  );
}

/** Nombre de una categoría con su icono decorativo. */
export function IconLabel({ icon, label }: { icon?: string; label: string }) {
  return (
    <>
      {icon && (
        <span aria-hidden="true" className="mr-1.5">
          {icon}
        </span>
      )}
      {label}
    </>
  );
}
