// Exchange-partner escrow orchestration (PRD §11.3).
//
// THE ORGANIZING RULE: the licensed partner always holds the funds; GrahmOS
// only sends hold / release / refund INSTRUCTIONS and keeps the audit ledger.
//   v1  fiat rail  — Stripe (Checkout payment held as a charge on the platform
//                    balance; "release" = mark releasable / transfer when
//                    Connect accounts are onboarded; "refund" = Stripe refund).
//   v1  usdc rail  — Stripe Stablecoin Payments: buyer pays USDC, Stripe
//                    settles USD. Same instruction surface; GrahmOS never
//                    touches the crypto.
//   high-value     — Escrow.com adapter (deed / storefront-unit sales).
//   demo           — no keys: a simulated partner so every flow stays testable.
//
// State machine: pending → held → released | refunded   (failed from any state)

import { getDatabase } from "@netlify/database";

export type EscrowStatus = "pending" | "held" | "released" | "refunded" | "failed";
export type EscrowProvider = "stripe" | "escrow_com" | "demo";
export type EscrowRail = "fiat" | "usdc";

export interface TimelineEntry {
  at: string;
  actor: string; // "buyer" | "system" | agent email
  action: string;
  note?: string;
}

export interface Escrow {
  id: string;
  provider: EscrowProvider;
  rail: EscrowRail;
  status: EscrowStatus;
  amountCents: number;
  currency: string;
  buyerEmail?: string | null;
  tenant: string;
  productId?: string | null;
  productName?: string | null;
  quoteId?: string | null;
  providerRef?: string | null;
  timeline: TimelineEntry[];
  createdAt: string;
}

const VALID_NEXT: Record<EscrowStatus, EscrowStatus[]> = {
  pending: ["held", "failed"],
  held: ["released", "refunded", "failed"],
  released: [],
  refunded: [],
  failed: [],
};

export function canTransition(from: EscrowStatus, to: EscrowStatus): boolean {
  return VALID_NEXT[from]?.includes(to) ?? false;
}

export function newEscrowId(): string {
  return "esc_" + Math.random().toString(36).slice(2, 10);
}

/* ── DB (graceful no-op without a database, matching _db.ts) ─────────── */

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

// In-memory fallback so demo mode (no DB) still exercises the full flow
// within a single function instance.
const memory: Map<string, Escrow> = new Map();

function rowToEscrow(r: Record<string, unknown>): Escrow {
  return {
    id: String(r.id),
    provider: r.provider as EscrowProvider,
    rail: r.rail as EscrowRail,
    status: r.status as EscrowStatus,
    amountCents: Number(r.amount_cents),
    currency: String(r.currency),
    buyerEmail: (r.buyer_email as string | null) ?? null,
    tenant: String(r.tenant),
    productId: (r.product_id as string | null) ?? null,
    productName: (r.product_name as string | null) ?? null,
    quoteId: (r.quote_id as string | null) ?? null,
    providerRef: (r.provider_ref as string | null) ?? null,
    timeline: (r.timeline as TimelineEntry[]) ?? [],
    createdAt: new Date(r.created_at as string).toISOString(),
  };
}

export async function insertEscrow(e: Escrow): Promise<void> {
  const d = db();
  if (!d) {
    memory.set(e.id, e);
    return;
  }
  await d.sql`
    INSERT INTO escrows
      (id, provider, rail, status, amount_cents, currency, buyer_email, tenant,
       product_id, product_name, quote_id, provider_ref, timeline, created_at, updated_at)
    VALUES
      (${e.id}, ${e.provider}, ${e.rail}, ${e.status}, ${e.amountCents}, ${e.currency},
       ${e.buyerEmail ?? null}, ${e.tenant}, ${e.productId ?? null}, ${e.productName ?? null},
       ${e.quoteId ?? null}, ${e.providerRef ?? null},
       ${JSON.stringify(e.timeline)}::jsonb, ${e.createdAt}, ${e.createdAt})
  `;
}

export async function getEscrow(id: string): Promise<Escrow | null> {
  const d = db();
  if (!d) return memory.get(id) ?? null;
  const rows = (await d.sql`SELECT * FROM escrows WHERE id = ${id} LIMIT 1`) as Record<string, unknown>[];
  return rows.length ? rowToEscrow(rows[0]) : null;
}

export async function getEscrowByProviderRef(ref: string): Promise<Escrow | null> {
  const d = db();
  if (!d) {
    for (const e of memory.values()) if (e.providerRef === ref) return e;
    return null;
  }
  const rows = (await d.sql`SELECT * FROM escrows WHERE provider_ref = ${ref} LIMIT 1`) as Record<string, unknown>[];
  return rows.length ? rowToEscrow(rows[0]) : null;
}

export async function listEscrows(): Promise<Escrow[]> {
  const d = db();
  if (!d) return [...memory.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rows = (await d.sql`SELECT * FROM escrows ORDER BY created_at DESC LIMIT 200`) as Record<string, unknown>[];
  return rows.map(rowToEscrow);
}

export async function transitionEscrow(
  id: string,
  to: EscrowStatus,
  entry: TimelineEntry,
  providerRef?: string
): Promise<Escrow | { error: string }> {
  const current = await getEscrow(id);
  if (!current) return { error: "not_found" };
  if (!canTransition(current.status, to)) {
    return { error: `invalid_transition:${current.status}->${to}` };
  }
  const timeline = [...current.timeline, entry];
  const d = db();
  const updated: Escrow = {
    ...current,
    status: to,
    timeline,
    providerRef: providerRef ?? current.providerRef,
  };
  if (!d) {
    memory.set(id, updated);
    return updated;
  }
  await d.sql`
    UPDATE escrows
    SET status = ${to},
        timeline = ${JSON.stringify(timeline)}::jsonb,
        provider_ref = ${updated.providerRef ?? null},
        updated_at = now()
    WHERE id = ${id}
  `;
  return updated;
}

/* ── Partner adapters ───────────────────────────────────────────────── */

export const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
export const ESCROW_COM_KEY = process.env.ESCROW_COM_API_KEY;
export const ESCROW_COM_EMAIL = process.env.ESCROW_COM_EMAIL;

/** Which partner backs a new escrow right now. */
export function activeProvider(highValue: boolean): EscrowProvider {
  if (highValue && ESCROW_COM_KEY) return "escrow_com";
  if (STRIPE_KEY) return "stripe";
  return "demo";
}

/** Escrow.com adapter — create a transaction (high-value deed/unit deals).
 *  https://www.escrow.com/api/docs — basic-auth email:apiKey. */
export async function escrowComCreate(e: Escrow): Promise<{ ref: string } | { error: string }> {
  if (!ESCROW_COM_KEY || !ESCROW_COM_EMAIL) return { error: "escrow_com_not_configured" };
  try {
    const res = await fetch("https://api.escrow.com/2017-09-01/transaction", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${ESCROW_COM_EMAIL}:${ESCROW_COM_KEY}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: e.currency,
        description: `GrahmOS escrow ${e.id}: ${e.productName ?? e.tenant}`,
        items: [
          {
            title: e.productName ?? `GrahmOS purchase from ${e.tenant}`,
            description: `Mall escrow ${e.id}`,
            type: "general_merchandise",
            inspection_period: 259200,
            quantity: 1,
            schedule: [
              {
                amount: (e.amountCents / 100).toFixed(2),
                payer_customer: e.buyerEmail ?? "me",
                beneficiary_customer: ESCROW_COM_EMAIL,
              },
            ],
          },
        ],
        parties: [
          { role: "buyer", customer: e.buyerEmail ?? "me" },
          { role: "seller", customer: ESCROW_COM_EMAIL },
        ],
      }),
    });
    if (!res.ok) return { error: `escrow_com_${res.status}` };
    const data = (await res.json()) as { id?: number };
    return { ref: String(data.id ?? "") };
  } catch {
    return { error: "escrow_com_unreachable" };
  }
}
