// Thin client for the Accio Netlify Functions API.
// Pulls a WorkOS access token from the auth layer and attaches it as a Bearer
// token so functions can verify the caller server-side.

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter = async () => null;

/** Wired once at app start by AuthProvider so api() can authenticate calls. */
export function setTokenGetter(fn: TokenGetter) {
  tokenGetter = fn;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await tokenGetter();
  const headers = new Headers(options.headers);
  headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${detail || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface ConciergeReply {
  reply: string;
  source: "claude" | "canned" | "fallback";
  demo?: boolean;
}

export function askConcierge(
  messages: { role: "user" | "assistant"; content: string }[],
  surface?: string
): Promise<ConciergeReply> {
  return api<ConciergeReply>("/api/concierge", {
    method: "POST",
    body: JSON.stringify({ messages, surface }),
  });
}
