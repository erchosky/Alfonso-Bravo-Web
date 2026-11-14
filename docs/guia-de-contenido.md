# Guía para editar el contenido

Todo lo que ve el visitante está en `src/content/`. Para cambiar un texto no
hace falta entender el código: abre el archivo, edita lo que hay entre
comillas y guarda.

## 1. Dónde está cada texto

| Quiero cambiar… | Archivo |
| --- | --- |
| Nombre de la web y descripción para buscadores | `src/content/site.ts` |
| Textos de la portada (provisional) | `src/content/home.ts` |
| Preguntas y respuestas del widget | `src/content/faq/questions.ts` |
| Nombres, iconos y descripciones de las categorías | `src/content/faq/categories.ts` |
| Teléfono, WhatsApp, email, Instagram y textos de contacto | `src/content/faq/contact.ts` |
| Saludo, botones y mensajes de carga, error o vacío | `src/content/faq/ui.ts` |

Las futuras secciones seguirán el mismo criterio: un archivo por sección
(por ejemplo `src/content/bodas.ts`) o una carpeta si tiene varias partes.

Reglas al editar:

- Respeta las comillas y la coma final de cada línea.
- Para una respuesta con varios párrafos, usa comillas invertidas (`` ` ``) y
  deja una línea en blanco entre párrafos.
- Si un texto aún no está decidido, escribe `[PENDIENTE: lo que falta]`. Nunca
  se publicará por error: las comprobaciones lo detectan.

## 2. Añadir una pregunta

En `questions.ts`, copia un bloque existente y cambia sus datos:

```ts
{
  id: "payments-when",                  // único, sin espacios
  categoryId: "payments",               // id de una categoría de categories.ts
  question: "¿Cuándo se paga el resto?",
  answer: { text: "Texto de la respuesta." },
  status: "draft",                      // "published" cuando esté aprobada
  order: 40,                            // posición dentro de la categoría
  enabled: true,                        // false = retirarla sin borrarla
},
```

Opcional: `relatedIds` (preguntas sugeridas al final), `contexts` (solo para
bodas, empresas, espectáculos o teatro), `answer.showContact: true` (muestra
el enlace a contacto) y `answer.links` (enlaces a páginas de la web).

Si dos preguntas comparten respuesta (como la señal), la respuesta se escribe
una sola vez como constante al principio del archivo y se reutiliza.

## 3. Añadir una categoría

En `categories.ts`, añade un bloque con `id`, `label`, `icon` (un emoji),
`kind: "faq"`, `order` y `enabled: true`. Después añade preguntas con ese
`categoryId`. Una categoría sin preguntas publicadas no se muestra.

## 4. Actualizar los contactos

En `contact.ts`, rellena `value` de cada canal:

- **WhatsApp:** número con prefijo internacional, p. ej. `"+34 600 000 000"`.
- **Teléfono:** como debe marcarse, p. ej. `"+34 600 000 000"`.
- **Email:** la dirección completa.
- **Instagram:** el nombre de usuario, con o sin `@`.

Un canal con `value: null` o con un formato no válido no se publica. Si no
queda ninguno, el apartado de contacto desaparece de la web.

## 5. Marcar contenido como listo para publicar

1. Sustituye todos los `[PENDIENTE: ...]` de la pregunta por el texto aprobado
   por Alfonso.
2. Cambia su `status` de `"draft"` a `"published"`.

En desarrollo (`npm run dev`) se ven también los borradores, con una franja
«Vista previa» en el panel. En la web publicada solo aparecen las preguntas
`published`. Si no hay ninguna publicada ni ningún contacto, el widget no
aparece.

Para revisar los borradores en un entorno de pruebas antes de publicarlos,
compila ese entorno con la variable `NEXT_PUBLIC_FAQ_PREVIEW=true`.

## 6. Cambiar el diseño sin tocar el contenido

- **Colores, bordes, sombras y tipografía del widget:** variables `--faq-*`
  en `src/components/faq-widget/faq-widget.css`, o redefínelas en
  `src/app/globals.css` (`:root { --faq-primary: …; }`).
- **Posición del botón (derecha o izquierda):** `position` en
  `src/config/faq-widget.config.ts`.
- **Estilos generales de la web:** `src/app/globals.css`.

Ningún cambio de diseño requiere tocar `src/content/`.

## 7. Llevar los cambios a producción

```bash
npm run check
```

Ejecuta lint, comprobación de tipos, pruebas (incluida la revisión del
contenido) y compilación. Si termina sin errores, despliega como habitualmente
con tu proveedor de alojamiento (aún no está configurado en este proyecto).
Al compilar se lee el contenido actual: lo que edites en `src/content/` es lo
que se publica.

Las pruebas necesitan Node 22.18 o superior.
