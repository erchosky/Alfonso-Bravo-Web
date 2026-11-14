import { useCallback, useEffect, useState } from "react";

export type QueryState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown; retry: () => void };

/**
 * Ejecuta una consulta asíncrona al proveedor y la repite cuando cambia `key`.
 * Sirve igual para datos locales que para una API o IA en el futuro.
 */
export function useFAQQuery<T>(
  key: string,
  query: () => Promise<T>,
): QueryState<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    id: string;
    state: QueryState<T>;
  } | null>(null);
  const id = `${key}#${attempt}`;
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    query().then(
      (data) => {
        if (!cancelled) setResult({ id, state: { status: "success", data } });
      },
      (error: unknown) => {
        if (!cancelled) {
          setResult({ id, state: { status: "error", error, retry } });
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // `id` identifica la consulta; `query` cambia en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return result?.id === id ? result.state : { status: "loading" };
}

const instanceIds = new WeakMap<object, number>();
let nextInstanceId = 0;

/** Id estable por instancia, para que cambiar de proveedor repita las consultas. */
export function instanceKey(instance: object) {
  let value = instanceIds.get(instance);
  if (value === undefined) {
    value = ++nextInstanceId;
    instanceIds.set(instance, value);
  }
  return value;
}
