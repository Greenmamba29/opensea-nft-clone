// Thin client for the GrahmOS Netlify Functions API.
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

/** Grandmother persona skin for the single concierge — flavors the prompt. */
export interface ConciergePersona {
  name: string;
  style: string;
}

export function askConcierge(
  messages: { role: "user" | "assistant"; content: string }[],
  surface?: string,
  persona?: ConciergePersona
): Promise<ConciergeReply> {
  return api<ConciergeReply>("/api/concierge", {
    method: "POST",
    body: JSON.stringify({ messages, surface, persona }),
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

/** Free-form RFQ fields from the mall Quotes page (Alibaba-style request). */
export interface QuoteRequestFields {
  description: string;
  quantity: number;
  unit: string;
  aisle?: string;
  deadline?: string;
  notes?: string;
}

export interface QuoteDraft {
  buyer?: string;
  company?: string;
  items?: QuoteItem[];
  request?: QuoteRequestFields;
}

export interface QuoteRecord {
  id: string;
  buyer: string;
  company: string;
  items: QuoteItem[];
  request?: QuoteRequestFields;
  status:
    | "draft"
    | "submitted"
    | "under_agent_review"
    | "priced"
    | "sent_to_buyer"
    | "accepted"
    | "rejected"
    | "converted";
  total: number;
  createdAt: string;
}

export function submitQuote(
  payload: QuoteDraft
): Promise<{ quote: { id: string; total: number; status: string }; message: string }> {
  return api("/api/quotes", { method: "POST", body: JSON.stringify(payload) });
}

export function listQuotes(): Promise<{ quotes: QuoteRecord[] }> {
  return api("/api/quotes");
}

/* ── Shopify catalog (per-tenant commerce engine) ──────────────────── */

export interface ShopifyCatalogProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: null;
  imageUrl?: string;
  url?: string;
  source: "shopify" | "demo";
}

export interface ShopifyCatalog {
  source: "shopify" | "demo";
  products: ShopifyCatalogProduct[];
}

/** Live (or demo-fallback) product catalog for a storefront's Shopify store. */
export function getShopifyCatalog(domain: string): Promise<ShopifyCatalog> {
  return api(`/api/shopify/catalog?domain=${encodeURIComponent(domain)}`);
}
