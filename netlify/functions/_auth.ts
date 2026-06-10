import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Server-side WorkOS access-token verification for Netlify Functions.
 *
 * AuthKit issues a JWT access token; we verify its signature against the
 * WorkOS JWKS endpoint (no secret needed for verification). The JWKS URL is
 * derived from the WorkOS Client ID.
 *
 * When no WORKOS_CLIENT_ID is configured the platform runs in demo mode and
 * every request is treated as an anonymous operator so the app is explorable.
 */

const CLIENT_ID = process.env.WORKOS_CLIENT_ID || process.env.VITE_WORKOS_CLIENT_ID;
const WORKOS_API_HOSTNAME = process.env.WORKOS_API_HOSTNAME || "api.workos.com";

export interface AuthedUser {
  id: string;
  email?: string;
  role: string;
  demo: boolean;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
  if (!CLIENT_ID) return null;
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`https://${WORKOS_API_HOSTNAME}/sso/jwks/${CLIENT_ID}`)
    );
  }
  return jwks;
}

function deriveRole(email?: string): string {
  if (!email) return "buyer";
  if (email.endsWith("@accio.market") || email.includes("+operator")) return "operator";
  if (email.includes("+seller")) return "seller";
  if (email.includes("+partner")) return "channel_partner";
  if (email.includes("+agent")) return "agent";
  return "buyer";
}

export async function authenticate(req: Request): Promise<AuthedUser | null> {
  // Demo mode: no WorkOS configured → synthetic operator.
  if (!CLIENT_ID) {
    return { id: "demo_operator", email: "demo+operator@accio.market", role: "operator", demo: true };
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  const keySet = getJwks();
  if (!keySet) return null;

  try {
    const { payload } = await jwtVerify(token, keySet, {
      issuer: `https://${WORKOS_API_HOSTNAME}`,
    });
    const email = (payload.email as string | undefined) ?? undefined;
    return {
      id: String(payload.sub),
      email,
      role: (payload.role as string | undefined) ?? deriveRole(email),
      demo: false,
    };
  } catch {
    return null;
  }
}

export function requireRole(user: AuthedUser | null, roles: string[]): boolean {
  return Boolean(user && roles.includes(user.role));
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function unauthorized(): Response {
  return json({ error: "unauthorized" }, 401);
}
