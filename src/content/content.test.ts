/**
 * Ningún texto de la web puede publicarse con una marca [PENDIENTE].
 * (El contenido del widget se revisa con más detalle en src/lib/faq/faq.test.ts.)
 */
import assert from "node:assert/strict";
import { it } from "node:test";
import { home } from "./home.ts";
import { site } from "./site.ts";

it("los textos generales de la web no contienen [PENDIENTE]", () => {
  for (const [name, content] of Object.entries({ site, home })) {
    assert.ok(
      !JSON.stringify(content).includes("[PENDIENTE"),
      `src/content/${name}.ts contiene [PENDIENTE]`,
    );
  }
});
