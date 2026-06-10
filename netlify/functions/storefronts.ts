import type { Config, Context } from "@netlify/functions";

import { authenticate, json, unauthorized } from "./_auth";
import { STOREFRONTS, type Storefront } from "./_data";

/**
 * GET  /api/storefronts            → list storefronts (operator/agent see all)
 * POST /api/storefronts            → submit a storefront application (any authed user)
 */
export default async (req: Request, _context: Context) => {
  const user = await authenticate(req);
  if (!user) return unauthorized();

  if (req.method === "GET") {
    return json({ storefronts: STOREFRONTS });
  }

  if (req.method === "POST") {
    let body: Partial<Storefront> = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    if (!body.merchant || !body.category) {
      return json({ error: "merchant and category are required" }, 422);
    }
    const created: Storefront = {
      id: "sf_" + Math.random().toString(36).slice(2, 8),
      merchant: body.merchant,
      storeType: body.storeType ?? "Retail Store",
      category: body.category,
      tier: body.tier ?? "rent",
      status: "new",
      assignedAgent: "Unassigned",
      monthlyLease: body.monthlyLease ?? 59,
    };
    // In production: INSERT into Postgres storefronts + mirror to Airtable +
    // create an Agent Task for white-glove onboarding.
    return json({ storefront: created, message: "Application received. An Accio agent will reach out." }, 201);
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config: Config = { path: "/api/storefronts" };
