import { home } from "@/content/home";
import { site } from "@/content/site";

/** Portada provisional para probar el widget. Textos en `src/content/home.ts`. */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-6 py-24">
      <header className="flex flex-col gap-3">
        <p className="text-sm tracking-widest text-zinc-500 uppercase">
          {home.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-400">
          {home.intro}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {home.sections.map((section) => (
          <li
            key={section}
            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <p className="font-medium">{section}</p>
            <p className="text-sm text-zinc-500">{home.sectionStatus}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
