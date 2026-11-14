# Alfonso Bravo — web

Next.js (App Router) + TypeScript + Tailwind CSS. Por ahora contiene una
portada provisional y el widget flotante de dudas frecuentes. Todo funciona en
local, sin APIs ni base de datos.

**¿Vas a cambiar textos, preguntas o contactos?** Lee
[`docs/guia-de-contenido.md`](docs/guia-de-contenido.md).

## Puesta en marcha

Requiere Node.js 20.9 o superior (22.18 o superior para las pruebas).

```bash
npm install
npm run dev      # http://localhost:3000 (con vista previa de borradores)
npm run check    # lint + tipos + pruebas + compilación: antes de publicar
```

## Estructura

```
src/
  app/                  Páginas y layout de Next.js (sin textos dentro)
  content/              TODO el texto visible: se edita aquí
    site.ts             Nombre de la web y metadatos
    home.ts             Portada provisional
    faq/                Widget: categorías, preguntas, contacto y textos de interfaz
  config/
    faq-widget.config.ts  Comportamiento del widget (posición, contexto por ruta…)
  components/
    faq-widget/         Widget (ver su README técnico)
  lib/
    faq/                Lógica pura del widget: tipos, datos, validación, navegación
docs/
  guia-de-contenido.md  Guía para editar contenido y publicar
```

Regla general: **el contenido vive en `src/content/`, el diseño en los CSS y
la configuración en `src/config/`**. Los componentes solo leen de ahí.

Documentación técnica del widget (arquitectura, integración, proveedores de
datos y accesibilidad):
[`src/components/faq-widget/README.md`](src/components/faq-widget/README.md).

## Mascota del widget

El botón de ayuda es ahora una criatura animada. Consulta [`docs/mascota.md`](docs/mascota.md) para cambiar la imagen, los movimientos y el texto accesible.
