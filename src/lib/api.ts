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

/* ── Mall OS dashboard ─────────────────────────────────────────────── */

export interface MallOverview {
  kpis: { key: string; label: string; value: string; delta: string }[];
  occupancy: {
    totalSlots: number;
    occupied: number;
    vacant: number;
    pending: number;
    rate: number;
    slices: { name: string; value: number; color: string }[];
  };
  trends: { m: string; revenue: number; gmv: number }[];
  categories: { icon: string; name: string; gmv: string; share: string; delta: string }[];
  placements: { key: string; name: string; note: string; count: string }[];
  agentQueue: { key: string; name: string; note: string; count: number }[];
  agentQueueTotal: number;
  zones: { name: string; slots: number; color: string }[];
}

export function getMallOverview(): Promise<{ overview: MallOverview; generatedAt: string; demo?: boolean }> {
  return api("/api/mall/overview");
}

/* ── Storefronts ───────────────────────────────────────────────────── */

export interface Storefront {
  id: string;
  merchant: string;
  storeType: "Retail Store" | "Brand Store" | "B2B Store" | "Pop-Up";
  category: string;
  tier: "rent" | "lease" | "own";
  status: "new" | "under_review" | "documents_pending" | "shortlisted" | "active";
  assignedAgent: string;
  monthlyLease: number;
}

export function listStorefronts(): Promise<{ storefronts: Storefront[] }> {
  return api("/api/storefronts");
}

export interface StorefrontApplication {
  merchant: string;
  category: string;
  storeType?: Storefront["storeType"];
  tier?: Storefront["tier"];
  contactEmail?: string;
  notes?: string;
}

export function submitStorefront(
  payload: StorefrontApplication
): Promise<{ storefront: Storefront; message: string }> {
  return api("/api/storefronts", { method: "POST", body: JSON.stringify(payload) });
}

/* ── Quotes ────────────────────────────────────────────────────────── */

export interface QuoteItem {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface QuoteDraft {
  buyer?: string;
  company?: string;
  items: QuoteItem[];
}

export function submitQuote(
  payload: QuoteDraft
): Promise<{ quote: { id: string; total: number; status: string }; message: string }> {
  return api("/api/quotes", { method: "POST", body: JSON.stringify(payload) });
}
