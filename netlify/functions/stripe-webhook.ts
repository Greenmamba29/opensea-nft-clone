import type { Config, Context } from "@netlify/functions";

import { getEscrowByProviderRef, transitionEscrow, STRIPE_KEY } from "./_escrow";

/**
 * POST /api/webhooks/stripe — Stripe → "funds held".
 *
 * On checkout.session.completed we move the escrow pending → held: the money is
 * now sitting with the partner (Stripe), waiting for the GrahmOS agent to
 * instruct release or refund. Signature-verified when STRIPE_WEBHOOK_SECRET is set.
 */
export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return new Response("method_not_allowed", { status: 405 });

  const raw = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: { type?: string; data?: { object?: Record<string, unknown> } } = {};
  try {
    if (STRIPE_KEY && secret) {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(STRIPE_KEY);
      const sig = req.headers.get("stripe-signature") || "";
      event = stripe.webhooks.constructEvent(raw, sig, secret) as unknown as typeof event;
    } else {
      // No secret configured (demo/local) — parse without verifying.
      event = JSON.parse(raw);
    }
  } catch (err) {
    return new Response(`signature_verification_failed: ${String(err)}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object ?? {};
    const sessionId = String(session.id ?? "");
    const escrow = await getEscrowByProviderRef(sessionId);
    if (escrow && escrow.status === "pending") {
      await transitionEscrow(escrow.id, "held", {
        at: new Date().toISOString(),
        actor: "system",
        action: "funds_held",
        note: "Stripe checkout completed — funds held with partner.",
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = { path: "/api/webhooks/stripe" };
