const PENDING_PATTERN = /(\[PENDIENTE:[^\]]*\])/g;

/** Texto con párrafos separados por línea en blanco y marcas de pendiente. */
export function RichText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed break-words text-(--faq-text)/90">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>
          {paragraph.split(PENDING_PATTERN).map((part, j) =>
            part.startsWith("[PENDIENTE:") ? (
              <mark key={j} className="faq-pending">
                {part}
              </mark>
            ) : (
              part
            ),
          )}
        </p>
      ))}
    </div>
  );
}
