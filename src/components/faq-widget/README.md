# Widget «Dudas frecuentes» — documentación técnica

Para editar textos, preguntas o contactos no hace falta leer esto: ver
[`docs/guia-de-contenido.md`](../../../docs/guia-de-contenido.md).

## Arquitectura

```
src/content/faq/        Contenido (datos puros, sin lógica)
src/config/             faq-widget.config.ts: comportamiento, tema y proveedor
src/lib/faq/            TypeScript puro, sin React (ejecutable con Node)
  types.ts              Tipos del dominio y de los textos
  provider.ts           Contrato FAQProvider
  local-provider.ts     Implementación con los archivos de contenido
  validate.ts           Reglas de publicación y validación del contenido
  navigation.ts         Historial de pantallas
  route-context.ts      Ruta → contexto (weddings, companies, shows, theatre)
  contact-links.ts      Validación de canales y enlaces de contacto
src/components/faq-widget/
  FAQWidget.tsx         Composición: estado abierto/cerrado, contexto, disponibilidad
  FAQPanel.tsx          Armazón del diálogo y gestión del foco
  PanelHeader.tsx       Cabecera (volver, título, menú, cerrar)
  FloatingButton.tsx    Botón de la esquina
  screens/              Una pantalla por archivo + CurrentScreen (elige la actual)
  ui/                   Piezas visuales reutilizables (listas, encabezados, contacto…)
  hooks/                Datos, navegación, foco, modalidad, cierre
  theme.ts              Tokens del tema → variables CSS
  faq-widget.css        Valores por defecto de los tokens y colocación del panel
```

Flujo de datos: los componentes nunca importan el contenido. Leen datos a
través de un `FAQProvider` y los textos de interfaz a través del contexto del
widget; ambos se conectan en `faq-widget.config.ts`.

## Publicación

- Preguntas: `status: "draft" | "published"`. Fuera de la vista previa solo
  se muestran las publicadas y sin `[PENDIENTE` (`isPublishable`).
- Contacto: solo se publican canales con un dato válido. Sin canales, el
  proveedor omite la categoría de contacto y la interfaz oculta sus accesos.
- Si `getCategories` no devuelve nada, el widget no se renderiza.
- Vista previa (`faqWidgetConfig.preview`): en desarrollo o con
  `NEXT_PUBLIC_FAQ_PREVIEW=true`.
- `npm test` valida el contenido real: ids duplicados, referencias rotas,
  `order` repetido, canales mal formados y `[PENDIENTE` en cualquier texto
  visible (preguntas publicadas, categorías, contacto, interfaz, site y home).

Limitación conocida: los borradores no se muestran en producción, pero viajan
en el JavaScript del cliente. No incluyas en un borrador nada que no pueda ser
público.

## Integración en Next.js

Una sola instancia en el layout raíz (`src/app/layout.tsx`): `<FAQWidget />`.
En desarrollo se avisa si hay más de una.

Contexto por sección: decláralo en `contextRoutes` de la configuración (el
prefijo más específico gana, sin coincidencias parciales) o fuérzalo con
`<FAQWidget context="weddings" />`. Al cambiar de contexto, el panel vuelve al
menú. El widget va dentro de `<Suspense>` porque usa `usePathname`, que con
Cache Components puede suspender en rutas dinámicas, y dentro de un
`FAQErrorBoundary` para que un fallo no tumbe la página.

## Proveedor personalizado (API o IA)

Implementa `FAQProvider` respetando sus reglas (solo contenido publicable;
omitir categorías vacías y el contacto sin canales). Una instancia de clase no
puede pasarse desde un Server Component, así que:

1. Cámbiala en `createProvider` de la configuración (se evalúa en el cliente):
   `createProvider: () => new ApiFAQProvider("/api/faq")`, o
2. Crea un envoltorio `"use client"` que la instancie con
   `useState(() => new ApiFAQProvider(...))` y renderice
   `<FAQWidget provider={provider} />`, y usa ese envoltorio en el layout.

Los componentes ya gestionan datos asíncronos: esqueleto si la carga tarda más
de 200 ms, error con «Reintentar» y preguntas relacionadas que no bloquean la
respuesta.

## Tema y posición

Tokens (`faq-widget.css`, en `@layer base`, así que cualquier regla de la web
los sobrescribe): `--faq-primary`, `--faq-primary-contrast`,
`--faq-background`, `--faq-surface`, `--faq-text`, `--faq-muted`,
`--faq-border`, `--faq-radius`, `--faq-shadow`, `--faq-font`,
`--faq-font-heading`, `--faq-z-index` y `--faq-pending`.

También por configuración (`theme`) o por instancia
(`<FAQWidget theme={{ primary: "#b48cff" }} />`). Posición: `position:
"bottom-right" | "bottom-left"`.

## Comportamiento y accesibilidad

- **Escritorio:** panel flotante no modal. Se puede seguir navegando la web;
  Escape cierra si el foco está en el widget.
- **Móvil (vertical u horizontal, según `sheetMediaQuery`):** hoja modal. El
  resto de la página queda `inert`, el documento no se desplaza y el foco no
  sale del panel. Cambia de modo en vivo al girar o redimensionar.
- Pulsar fuera (o el fondo en móvil) cierra solo si `closeOnOutsideClick`.
- Al cerrar, el foco vuelve al botón (salvo al pulsar fuera). Al cambiar de
  pantalla va al encabezado; durante una carga, al contenedor. Al volver atrás
  regresa a la opción de origen.
- Flechas ↑/↓, Inicio y Fin recorren las listas.
- Al seguir un enlace interno de una respuesta, el panel se cierra.
- Respeta `prefers-reduced-motion`.

## Pruebas

`npm test` (Node 22.18+): publicación, contacto, contextos, validación del
contenido real y navegación. `npm run check` encadena lint, tipos, pruebas y
compilación.
