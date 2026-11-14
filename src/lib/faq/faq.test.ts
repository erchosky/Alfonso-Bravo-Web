/**
 * Comprobaciones de la lógica del widget (sin React ni navegador).
 * Ejecutar con `npm test` (Node 22.18 o superior).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { categories as realCategories } from "../../content/faq/categories.ts";
import { contact as realContact } from "../../content/faq/contact.ts";
import { questions as realQuestions } from "../../content/faq/questions.ts";
import { faqUi as realUi } from "../../content/faq/ui.ts";
import { buildContactHref } from "./contact-links.ts";
import { resolveContextFromPath } from "./route-context.ts";
import { LocalFAQProvider } from "./local-provider.ts";
import { INITIAL_HISTORY, popScreen, pushScreen } from "./navigation.ts";
import type {
  ContactChannel,
  FAQCategory,
  FAQContactInfo,
  FAQQuestion,
} from "./types.ts";
import { validateFAQContent } from "./validate.ts";

const category = (id: string, kind: FAQCategory["kind"] = "faq"): FAQCategory => ({
  id,
  label: id,
  kind,
  order: 0,
  enabled: true,
});

const question = (
  id: string,
  overrides: Partial<FAQQuestion> = {},
): FAQQuestion => ({
  id,
  categoryId: "booking",
  question: `¿${id}?`,
  answer: { text: `Respuesta ${id}` },
  status: "published",
  order: 0,
  enabled: true,
  ...overrides,
});

const channel = (
  type: ContactChannel["type"],
  value: string | null,
): ContactChannel => ({ type, label: type, value, order: 0 });

const contactWith = (...channels: ContactChannel[]): FAQContactInfo => ({
  title: "Contacto",
  description: "",
  channels,
});

const ids = (items: { id: string }[]) => items.map((item) => item.id);

describe("publicación", () => {
  const data = {
    categories: [category("booking"), category("travel"), category("contact", "contact")],
    questions: [
      question("approved"),
      question("draft", { status: "draft" }),
      question("travel-draft", { categoryId: "travel", status: "draft" }),
      question("leaked", { answer: { text: "[PENDIENTE: dato]" } }),
      question("disabled", { enabled: false }),
    ],
    contact: contactWith(channel("email", null)),
  };

  it("en producción solo muestra preguntas publicadas y sin marcas pendientes", async () => {
    const provider = new LocalFAQProvider(data);
    assert.deepEqual(ids(await provider.getQuestions("booking")), ["approved"]);
    assert.equal(await provider.getQuestion("draft"), null);
    assert.equal(await provider.getQuestion("leaked"), null);
  });

  it("en producción oculta categorías vacías y la de contacto sin canales", async () => {
    const provider = new LocalFAQProvider(data);
    assert.deepEqual(ids(await provider.getCategories()), ["booking"]);
  });

  it("sin nada publicable no devuelve categorías (el widget se oculta)", async () => {
    const provider = new LocalFAQProvider({
      ...data,
      questions: [question("only-draft", { status: "draft" })],
    });
    assert.deepEqual(await provider.getCategories(), []);
  });

  it("en vista previa muestra borradores y el contacto pendiente", async () => {
    const provider = new LocalFAQProvider(data, { preview: true });
    assert.deepEqual(ids(await provider.getCategories()), ["booking", "travel", "contact"]);
    assert.deepEqual(ids(await provider.getQuestions("booking")), [
      "approved",
      "draft",
      "leaked",
    ]);
    assert.equal((await provider.getContact()).channels.length, 1);
  });
});

describe("contacto", () => {
  const base = { categories: [category("contact", "contact")], questions: [] };

  it("publica solo canales con un dato válido", async () => {
    const provider = new LocalFAQProvider({
      ...base,
      contact: contactWith(
        channel("whatsapp", "34 600 000 000"),
        channel("email", "no-es-un-email"),
        channel("phone", null),
      ),
    });
    const { channels } = await provider.getContact();
    assert.deepEqual(channels.map((c) => c.type), ["whatsapp"]);
    assert.deepEqual(ids(await provider.getCategories()), ["contact"]);
  });

  it("construye enlaces correctos", () => {
    assert.equal(buildContactHref(channel("whatsapp", "+34 600 000 000")), "https://wa.me/34600000000");
    assert.equal(buildContactHref(channel("instagram", "@usuario")), "https://instagram.com/usuario");
    assert.equal(buildContactHref(channel("phone", "+34 600-000-000")), "tel:+34600000000");
    assert.equal(buildContactHref(channel("email", "")), null);
    // Sin dígitos o sin prefijo internacional no hay enlace válido.
    assert.equal(buildContactHref(channel("phone", "------")), null);
    assert.equal(buildContactHref(channel("whatsapp", "600 000 000")), null);
  });
});

describe("contextos", () => {
  const provider = new LocalFAQProvider({
    categories: [category("booking")],
    questions: [
      question("general", { order: 1 }),
      question("weddings-only", { order: 2, contexts: ["weddings"] }),
      question("theatre-only", { order: 3, contexts: ["theatre"] }),
    ],
    contact: contactWith(),
  });

  it("sin contexto muestra todas en su orden", async () => {
    assert.deepEqual(ids(await provider.getQuestions("booking")), [
      "general",
      "weddings-only",
      "theatre-only",
    ]);
  });

  it("con contexto prioriza las suyas y oculta las de otros contextos", async () => {
    assert.deepEqual(ids(await provider.getQuestions("booking", { context: "theatre" })), [
      "theatre-only",
      "general",
    ]);
    assert.equal(await provider.getQuestion("weddings-only", { context: "theatre" }), null);
  });

  it("resuelve el contexto por ruta sin coincidencias parciales", () => {
    const routes = [
      { pathPrefix: "/bodas", context: "weddings" as const },
      { pathPrefix: "/espectaculos/teatro", context: "theatre" as const },
      { pathPrefix: "/espectaculos", context: "shows" as const },
    ];
    assert.equal(resolveContextFromPath(routes, "/bodas"), "weddings");
    assert.equal(resolveContextFromPath(routes, "/bodas/galeria/"), "weddings");
    assert.equal(resolveContextFromPath(routes, "/bodasx"), undefined);
    assert.equal(resolveContextFromPath(routes, "/espectaculos/teatro/x"), "theatre");
    assert.equal(resolveContextFromPath(routes, "/"), undefined);
    assert.equal(resolveContextFromPath(routes, null), undefined);
  });
});

describe("validación del contenido", () => {
  it("el contenido real no tiene errores", () => {
    const issues = validateFAQContent(
      {
        categories: realCategories,
        questions: realQuestions,
        contact: realContact,
      },
      realUi,
    );
    assert.deepEqual(issues, []);
  });

  it("detecta [PENDIENTE] en textos visibles fuera de las preguntas", () => {
    const issues = validateFAQContent(
      {
        categories: [{ ...category("booking"), description: "[PENDIENTE: x]" }],
        questions: [],
        contact: { ...contactWith(), title: "[PENDIENTE: título]" },
      },
      {
        ...realUi,
        welcome: { ...realUi.welcome, body: "[PENDIENTE: saludo]" },
      },
    );
    assert.ok(issues.some((i) => i.includes('categoría "booking".description')));
    assert.ok(issues.some((i) => i.includes("contacto.title")));
    assert.ok(issues.some((i) => i.includes("interfaz.welcome.body")));
    // Los textos de vista previa pueden contener [PENDIENTE]: nunca se publican.
    assert.ok(!issues.some((i) => i.includes("interfaz.preview")));
  });

  it("detecta los errores habituales al editar", () => {
    const issues = validateFAQContent({
      categories: [category("booking"), category("booking")],
      questions: [
        question("a", { relatedIds: ["a", "missing", "b"] }),
        question("a"),
        question("b", { status: "draft" }),
        question("c", { categoryId: "nope" }),
        question("d", { order: 7, answer: { text: "[PENDIENTE: x]" } }),
        question("e", { order: 7 }),
      ],
      contact: contactWith(channel("email", "mal")),
    });
    const expected = [
      'categoría duplicado: "booking"',
      'pregunta duplicado: "a"',
      'categoría inexistente: "nope"',
      '"d" está publicada pero contiene',
      '"a" se relaciona consigo misma',
      'id inexistente: "missing"',
      'relaciona "b", que no lo está',
      'Canal "email" con formato no válido',
      'comparten order 7',
    ];
    for (const fragment of expected) {
      assert.ok(
        issues.some((issue) => issue.includes(fragment)),
        `Falta el aviso: ${fragment}\n${issues.join("\n")}`,
      );
    }
  });
});

describe("navegación", () => {
  it("al volver recuerda desde qué elemento se salió", () => {
    let history = pushScreen(INITIAL_HISTORY, { type: "category", categoryId: "travel" }, "travel");
    history = pushScreen(history, { type: "answer", questionId: "q1" }, "q1");
    assert.equal(history.length, 3);

    history = popScreen(history);
    assert.deepEqual(history.at(-1), {
      screen: { type: "category", categoryId: "travel" },
      focusKey: "q1",
    });

    history = popScreen(history);
    assert.deepEqual(history.at(-1), { screen: { type: "home" }, focusKey: "travel" });
  });

  it("no retrocede más allá del inicio", () => {
    assert.equal(popScreen(INITIAL_HISTORY), INITIAL_HISTORY);
  });
});
