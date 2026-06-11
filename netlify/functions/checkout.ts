import type { Config, Context } from "@netlify/functions";

import { authenticate, json } from "./_auth";
import {
  activeProvider,
  escrowComCreate,
  insertEscrow,
  newEscrowId,
  STRIPE_KEY,
  type Escrow,
} from "./_escrow";

/**
 * POST /api/checkout — start an escrowed purchase.
 * Body: { tenant, amountCents, productId?, productName?, quoteId?, rail?, highValue?, buyerEmail? }
 *
 * Creates the escrow ledger row (status=pending) and returns a checkout URL.
 *  · Stripe configured  → Stripe Checkout Session (card; USDC when rail="usdc").
 *    Funds are HELD on the platform balance; the agent releases later.
 *  · Escrow.com (highValue + configured) → a licensed-escrow transaction.
 *  · No keys            → demo checkout URL that simulates payment.
 * GrahmOS never holds the money — the partner does. We hold the instruction ledger.
 */
export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const user = await authenticate(req); // buyer may be a guest

  let body: {
    tenant?: string;
    amountCents?: number;
    productId?: string;
    productName?: string;
    quoteId?: string;
    rail?: "fiat" | "usdc";
    highValue?: boolean;
    buyerEmail?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const amountCents = Math.round(Number(body.amountCents) || 0);
  if (!body.tenant || amountCents < 50) {
    return json({ error: "tenant and amountCents (>= 50) required" }, 422);
  }

  const provider = activeProvider(Boolean(body.highValue));
  const rail = body.rail === "usdc" ? "usdc" : "fiat";
  const origin = new URL(req.url).origin;

  const escrow: Escrow = {
    id: newEscrowId(),
    provider,
    rail,
    status: "pending",
    amountCents,
    currency: "usd",
    buyerEmail: body.buyerEmail ?? user?.email ?? null,
    tenant: body.tenant,
    productId: body.productId ?? null,
    productName: body.productName ?? null,
    quoteId: body.quoteId ?? null,
    providerRef: null,
    timeline: [
      { at: new Date().toISOString(), actor: user?.email ?? "buyer", action: "checkout_started", note: `${provider}/${rail}` },
    ],
    createdAt: new Date().toISOString(),
  };

  // ── Stripe rail ──────────────────────────────────────────────────
  if (provider === "stripe" && STRIPE_KEY) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(STRIPE_KEY);
      const paymentMethodTypes = rail === "usdc" ? ["crypto"] : ["card"];
      // Cast the params via the method signature so we don't depend on the
      // Stripe namespace (dynamic import) or pin "crypto" to a specific SDK union.
      type CreateParams = Parameters<typeof stripe.checkout.sessions.create>[0];
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethodTypes,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amountCents,
              product_data: { name: escrow.productName ?? `Purchase from ${escrow.tenant}` },
            },
          },
        ],
        // The charge lands on the platform balance and is HELD there until the
        // GrahmOS agent releases it (Connect transfer wired when tenants onboard).
        payment_intent_data: { capture_method: "automatic" },
        metadata: { escrow_id: escrow.id, tenant: escrow.tenant, rail },
        success_url: `${origin}/mall/orders?escrow=${escrow.id}&status=success`,
        cancel_url: `${origin}/mall/orders?escrow=${escrow.id}&status=cancelled`,
      } as CreateParams);
      escrow.providerRef = session.id;
      await insertEscrow(escrow);
      return json({ escrowId: escrow.id, provider, rail, checkoutUrl: session.url }, 201);
    } catch (err) {
      return json({ error: "stripe_error", detail: String(err) }, 502);
    }
  }

  // ── Escrow.com rail (high-value) ─────────────────────────────────
  if (provider === "escrow_com") {
    const created = await escrowComCreate(escrow);
    if ("error" in created) return json({ error: created.error }, 502);
    escrow.providerRef = created.ref;
    await insertEscrow(escrow);
    return json(
      { escrowId: escrow.id, provider, rail, checkoutUrl: `https://www.escrow.com/transaction/${created.ref}` },
      201
    );
  }

  // ── Demo rail (no keys) ──────────────────────────────────────────
  await insertEscrow(escrow);
  return json(
    {
      escrowId: escrow.id,
      provider: "demo",
      rail,
      demo: true,
      // The demo checkout page is the orders view with a simulate flag.
      checkoutUrl: `${origin}/mall/orders?escrow=${escrow.id}&status=demo`,
      message: "Demo checkout — no payment partner configured. The escrow is recorded and can be simulated.",
    },
    201
  );
};

export const config: Config = { path: "/api/checkout" };
