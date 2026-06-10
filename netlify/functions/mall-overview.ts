import type { Config, Context } from "@netlify/functions";

import { authenticate, requireRole, json, unauthorized } from "./_auth";
import { MALL_OVERVIEW } from "./_data";

/** Operator dashboard data. Gated to operator/agent roles. */
export default async (req: Request, _context: Context) => {
  const user = await authenticate(req);
  if (!requireRole(user, ["operator", "agent"])) return unauthorized();
  return json({ overview: MALL_OVERVIEW, generatedAt: new Date().toISOString(), demo: user?.demo });
};

export const config: Config = { path: "/api/mall/overview" };
