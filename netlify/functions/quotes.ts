import type { Config, Context } from "@netlify/functions";

import { authenticate, json, unauthorized } from "./_auth";
import { QUOTES, type Quote } from "./_data";
import { insertQuote, listQuotesDb } from "./_db";

/**
 * GET  /api/quotes      → list quotes
 * POST /api/quotes      → create a B2B quote request (buyer) → enters agent review
 */
export default async (req: Request, _context: Context) => {
  const user = await authenticate(req);
  if (!user) return unauthorized();

  if (req.method === "GET") {
    const persisted = await listQuotesDb();
    return json({ quotes: [...persisted, ...QUOTES] });
  }

  if (req.method === "POST") {
    let body: Partial<Quote> = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    const items = body.items ?? [];
    const request = body.request;
    // Accept either itemized quotes (legacy) or a free-form RFQ from /mall/quotes.
    if (items.length === 0 && !(request?.description && request.quantity > 0)) {
      return json({ error: "items or request required" }, 422);
    }
    const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
    const created: Quote = {
      id: "q_" + Math.floor(1000 + Math.random() * 9000),
      buyer: body.buyer ?? user.email ?? "Unknown buyer",
      company: body.company ?? "—",
      items,
      request,
      status: "submitted",
      total,
      createdAt: new Date().toISOString(),
    };
    // Persist to Netlify Postgres so the quote survives (best-effort; no-ops in
    // demo mode). Agent Task "Quote Review" + sourcing notify land in a later phase.
    const persisted = await insertQuote({
      id: created.id,
      buyer: created.buyer,
      company: created.company,
      items: created.items,
      request: created.request,
      status: created.status,
      total: created.total,
      createdAt: created.createdAt,
    });
    return json({ quote: created, persisted, message: "Quote submitted for white-glove review." }, 201);
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config: Config = { path: "/api/quotes" };
