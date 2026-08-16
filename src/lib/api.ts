const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/**
 * The backend sleeps on Railway's free tier, so a cold start can take several seconds. Anything
 * slower than this and the page stops waiting and renders bundled content instead.
 */
const TIMEOUT_MS = 8000;

export interface FetchResult<T> {
  data: T;
  /** False when the request failed and `data` is the bundled fallback. */
  live: boolean;
  latencyMs: number | null;
  status: number | null;
}

export const apiConfigured = API_BASE.length > 0;

/**
 * Fetches `path`, falling back to bundled content on any failure.
 *
 * The site must stay complete and readable with the API unreachable, so this never throws and
 * never surfaces an error state to the caller. It reports which source was used instead.
 */
export async function fetchWithFallback<T>(path: string, fallback: T): Promise<FetchResult<T>> {
  if (!apiConfigured) {
    return { data: fallback, live: false, latencyMs: null, status: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = performance.now();

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const latencyMs = Math.round(performance.now() - started);

    if (!response.ok) {
      return { data: fallback, live: false, latencyMs, status: response.status };
    }
    return { data: (await response.json()) as T, live: true, latencyMs, status: response.status };
  } catch {
    return { data: fallback, live: false, latencyMs: null, status: null };
  } finally {
    clearTimeout(timeout);
  }
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot. Always submitted empty by real users. */
  website: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; fields?: Record<string, string> };

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  if (!apiConfigured) {
    return { ok: false, message: 'The message service is not configured. Please use email instead.' };
  }

  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    const body = await response.json().catch(() => null);
    return {
      ok: false,
      message: body?.message ?? 'That did not go through. Please try again.',
      fields: body?.fields,
    };
  } catch {
    return { ok: false, message: 'Could not reach the server. Please email me directly.' };
  }
}

/** Fire and forget. Analytics must never delay or break a user interaction. */
export function trackEvent(type: string, target?: string): void {
  if (!apiConfigured) return;

  const body = JSON.stringify({
    type,
    path: window.location.pathname,
    referrer: document.referrer || null,
    target: target ?? null,
  });

  void fetch(`${API_BASE}/api/analytics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
