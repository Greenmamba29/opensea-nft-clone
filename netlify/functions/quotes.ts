import type { Config, Context } from "@netlify/functions";

import { authenticate, json, unauthorized } from "./_auth";
import { QUOTES, type Quote } from "./_data";

/**
 * GET  /api/quotes      → list quotes
 * POST /api/quotes      → create a B2B quote request (buyer) → enters agent review
 */
export default async (req: Request, _context: Context) => {
  const user = await authenticate(req);
  if (!user) return unauthorized();

  if (req.method === "GET") {
    return json({ quotes: QUOTES });
  }

  if (req.method === "POST") {
    let body: Partial<Quote> = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    const items = body.items ?? [];
    if (items.length === 0) return json({ error: "items required" }, 422);
    const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
    const created: Quote = {
      id: "q_" + Math.floor(1000 + Math.random() * 9000),
      buyer: body.buyer ?? user.email ?? "Unknown buyer",
      company: body.company ?? "—",
      items,
      status: "submitted",
      total,
      createdAt: new Date().toISOString(),
    };
    // Production: persist + create Agent Task "Quote Review" + notify sourcing agent.
    return json({ quote: created, message: "Quote submitted for white-glove review." }, 201);
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config: Config = { path: "/api/quotes" };
