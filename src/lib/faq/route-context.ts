import type { FAQContext } from "./types";

export interface FAQContextRoute {
  /** Prefijo de ruta, p. ej. "/bodas" (aplica también a "/bodas/..."). */
  pathPrefix: string;
  context: FAQContext;
}

/** Devuelve el contexto de la ruta más específica que coincide. */
export function resolveContextFromPath(
  routes: readonly FAQContextRoute[],
  pathname: string | null,
): FAQContext | undefined {
  if (!pathname) return undefined;
  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
  const path = normalize(pathname);

  let match: FAQContextRoute | undefined;
  for (const route of routes) {
    const prefix = normalize(route.pathPrefix);
    const matches =
      path === prefix || path.startsWith(prefix === "/" ? "/" : `${prefix}/`);
    if (matches && (!match || prefix.length > normalize(match.pathPrefix).length)) {
      match = route;
    }
  }
  return match?.context;
}
