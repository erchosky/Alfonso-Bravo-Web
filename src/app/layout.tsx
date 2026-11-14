import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FAQWidget } from "@/components/faq-widget";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  // Sin descripción aprobada no se publica ninguna.
  ...(site.description && { description: site.description }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={site.lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <FAQWidget />
      </body>
    </html>
  );
}
