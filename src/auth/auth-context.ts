import { createContext, useContext } from "react";

export type GrahmOSRole = "buyer" | "seller" | "channel_partner" | "agent" | "operator";

export interface GrahmOSUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
  /** Role drives which experiences/dashboards are unlocked. */
  role: GrahmOSRole;
}

export interface GrahmOSAuthValue {
  user: GrahmOSUser | null;
  isLoading: boolean;
  /** True when running without WorkOS keys (local demo mode). */
  demoMode: boolean;
  signIn: (opts?: { state?: Record<string, unknown> }) => void | Promise<void>;
  signUp: (opts?: { state?: Record<string, unknown> }) => void | Promise<void>;
  signOut: () => void | Promise<void>;
  /** Returns a bearer token for calling Netlify Functions, or null in demo mode. */
  getAccessToken: () => Promise<string | null>;
}

export const GrahmOSAuthContext = createContext<GrahmOSAuthValue | null>(null);

export function useGrahmOSAuth(): GrahmOSAuthValue {
  const ctx = useContext(GrahmOSAuthContext);
  if (!ctx) {
    throw new Error("useGrahmOSAuth must be used within <AuthProvider>");
  }
  return ctx;
}

export const WORKOS_CLIENT_ID: string | undefined = import.meta.env.VITE_WORKOS_CLIENT_ID;
export const AUTH_ENABLED = Boolean(WORKOS_CLIENT_ID);

/** Map a WorkOS user → a GrahmOS role. SECURITY: with real auth, privileged
 *  roles must come from WorkOS Organization membership / role metadata — never
 *  from email text anyone can self-select (attacker+operator@gmail.com). The
 *  +tag heuristic only applies in demo mode (no WorkOS configured); the server
 *  (netlify/functions/_auth.ts) enforces the same rule, so a spoofed client
 *  role unlocks nothing real. */
export function deriveRole(email: string | undefined | null): GrahmOSRole {
  if (!email || AUTH_ENABLED) return "buyer";
  if (email.includes("+operator")) return "operator";
  if (email.includes("+seller")) return "seller";
  if (email.includes("+partner")) return "channel_partner";
  if (email.includes("+agent")) return "agent";
  return "buyer";
}
