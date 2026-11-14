import type { ComponentType, SVGProps } from "react";
import { buildContactHref, isExternalHref } from "@/lib/faq/contact-links";
import type {
  ContactChannel,
  ContactChannelType,
  FAQContactInfo,
} from "@/lib/faq/types";
import { ChatIcon, InstagramIcon, MailIcon, PhoneIcon } from "./icons";

const CHANNEL_ICONS: Record<
  ContactChannelType,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  whatsapp: ChatIcon,
  phone: PhoneIcon,
  email: MailIcon,
  instagram: InstagramIcon,
};

interface ContactCTAProps {
  info: FAQContactInfo;
  /**
   * Muestra los canales sin dato válido como placeholders señalados.
   * Úsalo solo en vista previa: por defecto se ocultan.
   */
  showPlaceholders?: boolean;
  placeholderLabel?: string;
}

/**
 * Botones de contacto. No depende del widget: puede reutilizarse en
 * cualquier parte de la web pasándole los datos de contacto.
 * No renderiza nada si no hay canales que mostrar.
 */
export function ContactCTA({
  info,
  showPlaceholders = false,
  placeholderLabel = "[PENDIENTE]",
}: ContactCTAProps) {
  const channels = info.channels
    .map((channel) => ({ channel, href: buildContactHref(channel) }))
    .filter(({ href }) => href !== null || showPlaceholders);

  if (channels.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
      {channels.map(({ channel, href }, index) => (
        <li key={`${index}-${channel.type}`}>
          <ChannelButton
            channel={channel}
            href={href}
            placeholderLabel={placeholderLabel}
          />
        </li>
      ))}
    </ul>
  );
}

function ChannelButton({
  channel,
  href,
  placeholderLabel,
}: {
  channel: ContactChannel;
  href: string | null;
  placeholderLabel: string;
}) {
  const Icon = CHANNEL_ICONS[channel.type];
  const content = (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{channel.label}</span>
    </>
  );
  const base =
    "flex min-h-11 w-full items-center justify-center gap-2 rounded-[calc(var(--faq-radius)*0.6)] px-3 text-sm";

  if (!href) {
    return (
      <span
        className={`${base} cursor-not-allowed border border-dashed border-(--faq-border) text-(--faq-muted)`}
        title={placeholderLabel}
      >
        {content}
        <span className="sr-only">{placeholderLabel}</span>
      </span>
    );
  }

  const external = isExternalHref(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${base} bg-(--faq-primary) font-medium text-(--faq-primary-contrast) transition-opacity hover:opacity-90`}
    >
      {content}
    </a>
  );
}
