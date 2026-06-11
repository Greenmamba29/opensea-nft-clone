import type { Config, Context } from "@netlify/functions";

import { authenticate, requireRole, json, unauthorized } from "./_auth";
import {
  getEscrow,
  listEscrows,
  transitionEscrow,
  STRIPE_KEY,
  type EscrowStatus,
} from "./_escrow";

/**
 * The Escrow Desk — the agent's instruction surface (PRD §11.3).
 *
 *  GET  /api/escrow            → list escrows (operator/agent)
 *  POST /api/escrow            → { id, action: "release" | "refund" | "simulate_hold" }
 *
 * INVARIANT (agents.md §4 "money gates on humans"): release/refund are
 * money-moving actions and require a human operator/agent — enforced HERE, in
 * the function, never in a prompt. GrahmOS only sends the instruction; the
 * licensed partner (Stripe / Escrow.com) actually moves the money.
 */
export default async (req: Request, _context: Context) => {
  const user = await authenticate(req);
  if (!requireRole(user, ["operator", "agent"])) return unauthorized();

  if (req.method === "GET") {
    return json({ escrows: await listEscrows() });
  }

  if (req.method === "POST") {
    let body: { id?: string; action?: string; note?: string } = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    const { id, action } = body;
    if (!id || !action) return json({ error: "id and action required" }, 422);

    const escrow = await getEscrow(id);
    if (!escrow) return json({ error: "not_found" }, 404);

    const actor = user!.email ?? user!.id; // a real human is on the hook for this
    const at = new Date().toISOString();

    // simulate_hold: demo/local only — advance pending → held without a webhook.
    if (action === "simulate_hold") {
      const r = await transitionEscrow(id, "held", {
        at, actor, action: "funds_held_simulated", note: "Operator simulated the partner hold (demo).",
      });
      return finish(r);
    }

    if (action !== "release" && action !== "refund") {
      return json({ error: "action must be release | refund | simulate_hold" }, 422);
    }
    const to: EscrowStatus = action === "release" ? "released" : "refunded";

    // Issue the instruction to the partner, then record the outcome.
    let providerNote = `${escrow.provider}: ${action} instruction issued by ${actor}`;
    if (escrow.provider === "stripe" && STRIPE_KEY && escrow.providerRef) {
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(STRIPE_KEY);
        const session = await stripe.checkout.sessions.retrieve(escrow.providerRef);
        const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
        if (action === "refund" && pi) {
          await stripe.refunds.create({ payment_intent: pi });
          providerNote = `Stripe refund issued for ${pi}`;
        } else if (action === "release") {
          // Funds already captured on the platform balance; release = mark
          // payable to the tenant. Connect transfer wired when tenants onboard.
          providerNote = `Stripe funds marked released to ${escrow.tenant} (Connect transfer pending onboarding)`;
        }
      } catch (err) {
        return json({ error: "partner_error", detail: String(err) }, 502);
      }
    }

    const result = await transitionEscrow(id, to, { at, actor, action, note: body.note ?? providerNote });
    return finish(result);
  }

  return json({ error: "method_not_allowed" }, 405);
};

function finish(r: Awaited<ReturnType<typeof transitionEscrow>>) {
  if ("error" in r) {
    const code = r.error === "not_found" ? 404 : 409;
    return json({ error: r.error }, code);
  }
  return json({ escrow: r });
}

export const config: Config = { path: "/api/escrow" };
