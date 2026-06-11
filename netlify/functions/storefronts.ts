import type { Config, Context } from "@netlify/functions";

import { authenticate, requireRole, json, unauthorized } from "./_auth";
import { STOREFRONTS, type Storefront } from "./_data";
import { insertApplication, listApplications } from "./_db";

/**
 * GET  /api/storefronts   → list storefronts (operator/agent only)
 * POST /api/storefronts   → submit a storefront application (PUBLIC lead form)
 */
export default async (req: Request, _context: Context) => {
  const user = await authenticate(req);

  if (req.method === "GET") {
    // Listing all tenants is operator/agent only.
    if (!requireRole(user, ["operator", "agent"])) return unauthorized();
    // Persisted applications (newest first) + seed storefronts.
    const applied = await listApplications();
    const appliedAsStorefronts: Storefront[] = applied.map((a) => ({
      id: a.id,
      merchant: a.merchant,
      storeType: (a.storeType as Storefront["storeType"]) ?? "Retail Store",
      category: a.category,
      aisle: "",
      tier: (a.tier as Storefront["tier"]) ?? "rent",
      status: (a.status as Storefront["status"]) ?? "new",
      assignedAgent: a.assignedAgent,
      monthlyLease: a.monthlyLease,
      // Every provisioned storefront gets a GrahmOS-managed Shopify store;
      // the domain is assigned during onboarding (not yet for applications).
      platform: "shopify",
    }));
    return json({ storefronts: [...appliedAsStorefronts, ...STOREFRONTS] });
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
    const created = {
      id: "sf_" + Math.random().toString(36).slice(2, 8),
      merchant: body.merchant,
      storeType: body.storeType ?? "Retail Store",
      category: body.category,
      tier: body.tier ?? "rent",
      status: "new",
      assignedAgent: "Unassigned",
      monthlyLease: body.monthlyLease ?? 59,
    };
    // Persist to Netlify Postgres so the application survives (best-effort;
    // no-ops in demo mode without a database). Airtable mirror + onboarding
    // Agent Task land in a later phase. (Public endpoint — add rate limiting.)
    const extra = body as { contactEmail?: string; notes?: string };
    const persisted = await insertApplication({
      ...created,
      contactEmail: extra.contactEmail ?? null,
      notes: extra.notes ?? null,
      createdAt: new Date().toISOString(),
    });
    void user; // applicant may be anonymous; captured if signed in
    return json(
      { storefront: created, persisted, message: "Application received. A GrahmOS agent will reach out." },
      201
    );
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config: Config = { path: "/api/storefronts" };
