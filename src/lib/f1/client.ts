import { JOLPICA_BASE_URL, REQUEST_TIMEOUT_MS, REVALIDATE_SECONDS } from "./config";

/**
 * Server-side GET against Jolpica. Returns the parsed body as `unknown` — the
 * caller validates it — and throws on a network error, timeout or non-2xx
 * status. Responses go through the Next.js Data Cache, so visitors never
 * trigger a request of their own.
 */
export async function fetchJolpica(path: string): Promise<unknown> {
  const response = await fetch(`${JOLPICA_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS, tags: ["f1"] },
  });

  if (!response.ok) {
    throw new Error(`Jolpica responded ${response.status} for ${path}`);
  }

  return response.json();
}
