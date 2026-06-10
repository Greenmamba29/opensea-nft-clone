// Netlify Database (Postgres) access for the GrahmOS functions.
//
// Uses the native @netlify/database driver. NETLIFY_DB_URL is injected
// automatically in builds, functions, and local dev (Vite plugin emulation).
// Every call degrades gracefully: if no database is reachable the helpers
// no-op / return [], so the API still works in demo mode without persistence.

import { getDatabase } from "@netlify/database";

type DB = ReturnType<typeof getDatabase>;

let cached: DB | null | undefined;

function db(): DB | null {
  if (cached === undefined) {
    try {
      cached = getDatabase();
    } catch {
      cached = null;
    }
  }
  return cached ?? null;
}

export function hasDatabase(): boolean {
  return db() != null;
}

/* ── Storefront applications ───────────────────────────────────────── */

export interface StoredApplication {
  id: string;
  merchant: string;
  category: string;
  storeType: string;
  tier: string;
  contactEmail?: string | null;
  notes?: string | null;
  status: string;
  assignedAgent: string;
  monthlyLease: number;
  createdAt: string;
}

export async function insertApplication(a: StoredApplication): Promise<boolean> {
  const d = db();
  if (!d) return false;
  try {
    await d.sql`
      INSERT INTO storefront_applications
        (id, merchant, category, store_type, tier, contact_email, notes, status, assigned_agent, monthly_lease, created_at)
      VALUES
        (${a.id}, ${a.merchant}, ${a.category}, ${a.storeType}, ${a.tier},
         ${a.contactEmail ?? null}, ${a.notes ?? null}, ${a.status}, ${a.assignedAgent}, ${a.monthlyLease}, ${a.createdAt})
    `;
    return true;
  } catch {
    return false;
  }
}

export async function listApplications(): Promise<StoredApplication[]> {
  const d = db();
  if (!d) return [];
  try {
    const rows = (await d.sql`
      SELECT id, merchant, category, store_type, tier, contact_email, notes,
             status, assigned_agent, monthly_lease, created_at
      FROM storefront_applications
      ORDER BY created_at DESC
      LIMIT 200
    `) as Record<string, unknown>[];
    return rows.map((r) => ({
      id: String(r.id),
      merchant: String(r.merchant),
      category: String(r.category),
      storeType: String(r.store_type),
      tier: String(r.tier),
      contactEmail: (r.contact_email as string | null) ?? null,
      notes: (r.notes as string | null) ?? null,
      status: String(r.status),
      assignedAgent: String(r.assigned_agent),
      monthlyLease: Number(r.monthly_lease),
      createdAt: new Date(r.created_at as string).toISOString(),
    }));
  } catch {
    return [];
  }
}

/* ── Quotes ────────────────────────────────────────────────────────── */

export interface StoredQuote {
  id: string;
  buyer: string;
  company: string;
  items: unknown[];
  request?: unknown;
  status: string;
  total: number;
  createdAt: string;
}

export async function insertQuote(q: StoredQuote): Promise<boolean> {
  const d = db();
  if (!d) return false;
  try {
    await d.sql`
      INSERT INTO quotes (id, buyer, company, items, request, status, total, created_at)
      VALUES (${q.id}, ${q.buyer}, ${q.company},
              ${JSON.stringify(q.items ?? [])}::jsonb,
              ${q.request != null ? JSON.stringify(q.request) : null}::jsonb,
              ${q.status}, ${q.total}, ${q.createdAt})
    `;
    return true;
  } catch {
    return false;
  }
}

export async function listQuotesDb(): Promise<StoredQuote[]> {
  const d = db();
  if (!d) return [];
  try {
    const rows = (await d.sql`
      SELECT id, buyer, company, items, request, status, total, created_at
      FROM quotes ORDER BY created_at DESC LIMIT 200
    `) as Record<string, unknown>[];
    return rows.map((r) => ({
      id: String(r.id),
      buyer: String(r.buyer),
      company: String(r.company),
      items: (r.items as unknown[]) ?? [],
      request: r.request ?? undefined,
      status: String(r.status),
      total: Number(r.total),
      createdAt: new Date(r.created_at as string).toISOString(),
    }));
  } catch {
    return [];
  }
}
