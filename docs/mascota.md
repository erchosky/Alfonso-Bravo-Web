# Mascota con chistera para el widget FAQ

El personaje morado lleva una chistera negra clásica con cinta dorada. Sustituye al lanzador de ayuda y conserva su función de botón. También aparece en pequeño en la cabecera del panel, para acompañar la navegación cuando el lanzador queda oculto en móvil.

## Movimiento con intención

| Situación real | Comportamiento |
| --- | --- |
| Esperando | Respiración muy suave y parpadeos cada 4,5–6,2 segundos. El ciclo continúa mientras la pestaña está visible. |
| Acercar el cursor o enfocar con el teclado | Saludo de 700 ms una sola vez al entrar; después vuelve al reposo. |
| Consultar preguntas | Permanece atento, con el mismo reposo tranquilo. |
| Entrar en contacto | Un saludo breve al entrar, sin repetirse en bucle. |
| Consulta que realmente tarda más de 200 ms | Expresión pensativa y tres puntos discretos; termina al resolverse la consulta. |
| Error de consulta | Expresión pensativa quieta; el mensaje y el botón de reintentar explican qué hacer. |
| Pestaña oculta, personaje oculto o movimiento reducido | Sin animaciones ni temporizadores activos. |

El widget sigue usando datos locales. No se añade una IA, una API, una demora artificial, un aviso intrusivo ni un campo de texto. Los estados de carga y error se conectan a las consultas del proveedor existente.

## Dónde cambiar cada cosa

- **Dibujo:** `public/images/faq-familiar-top-hat.png`. Atlas transparente de 1536 × 1024 px, con seis celdas de 512 × 512. Orden: neutral, parpadeo, mirada izquierda, mirada derecha, saludo, pensativo. Las miradas quedan disponibles en el arte, pero no se disparan al azar.
- **Ritmo y comportamientos:** `src/config/faq-mascot.config.ts`. Cada modo tiene una introducción puntual y un ciclo de reposo. Los tiempos se expresan en milisegundos.
- **Reproducción y pausa:** `src/components/faq-widget/hooks/use-mascot-animation.ts`. Cancela los temporizadores al ocultarse o desmontarse; no vuelve a saludar por cada vuelta del ciclo.
- **Componente visual:** `src/components/faq-widget/ui/FAQMascot.tsx`.
- **Respiración, saludo, tamaños y etiqueta:** `src/components/faq-widget/ui/faq-mascot.css`.
- **Interacción del botón:** `src/components/faq-widget/FloatingButton.tsx`.
- **Actividad de las consultas:** `src/components/faq-widget/ui/QueryView.tsx`.
- **Textos que ve el visitante:** `src/content/faq/ui.ts`. La etiqueta del lanzador está en `launcher`. Las preguntas, respuestas y contacto siguen en sus archivos de contenido.

No se añaden dependencias. Next Image optimiza el atlas desde el propio proyecto. Una sola imagen contiene las expresiones y evita cambiar de archivo en cada parpadeo. El tamaño del lanzador es de 104 px en escritorio y 88 px en móvil; en escritorio se ajusta con `--faq-mascot-size`.

## Accesibilidad y publicación

El personaje decorativo no se anuncia por separado. El botón conserva su nombre accesible, foco visible, apertura con Enter/Espacio y cierre con Escape. La animación respeta `prefers-reduced-motion`. Las expresiones acompañan al contenido, sin sustituir los mensajes de carga y error.

Se conserva la regla editorial del proyecto: con los datos recibidos, aún en borrador, el widget no aparece en producción. Para verlo localmente: `npm run dev`. Para una compilación de vista previa: `NEXT_PUBLIC_FAQ_PREVIEW=true npm run build`, seguida de `npm run start`. No activar esa variable en una publicación pública con contenido pendiente.

## Verificación de esta entrega

- `npm run check`: análisis de código, TypeScript, 15 pruebas existentes y compilación de producción correctos.
- Comprobación en navegador del ciclo repetido, saludo puntual, navegación, Escape, vista móvil y movimiento reducido.
- El ZIP incluye el código fuente y la imagen; excluye dependencias, cachés y compilaciones.

Esta entrega actualiza la mascota. Los demás puntos de la auditoría anterior conservan su estado.

## Origen del arte

Edición mediante la herramienta integrada de generación de imágenes, a partir del atlas del personaje original. No se utilizó una API ni una clave del usuario. Prompt final de la edición con chistera:

> Edit this exact six-cell mascot sprite sheet. Add the SAME elegant classic black magician's top hat (chistera), with a subtle warm gold satin hatband, to the purple creature in ALL SIX cells. The hat must sit naturally on the top of its head between the ear tufts. Keep the character recognizable and friendly, and keep the hat modest in size. Preserve the exact 3 columns by 2 rows layout and the six original facial expressions in their existing positions: neutral, blink, glance left, glance right, small paw greeting, thoughtful. Maintain identical scale, hat placement, body alignment and feet baseline across all six cells. You may reduce the character uniformly in every cell just enough to fit the complete hat and both ears without clipping. Preserve purple velvet fur, amber eyes and gentle gold rim light, 3D illustration quality. Each square cell must include the entire creature, ears, feet and hat with transparent margin. The output must be a 1536 by 1024 transparent PNG atlas with six 512 by 512 cells. Remove any background scene, floor or opaque brown backdrop; background and all space between silhouettes must have alpha zero. No text, labels, borders, grid lines, extra characters or props.
