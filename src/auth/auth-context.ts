import { createContext, useContext } from "react";

export type AccioRole = "buyer" | "seller" | "channel_partner" | "agent" | "operator";

export interface AccioUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
  /** Role drives which experiences/dashboards are unlocked. */
  role: AccioRole;
}

export interface AccioAuthValue {
  user: AccioUser | null;
  isLoading: boolean;
  /** True when running without WorkOS keys (local demo mode). */
  demoMode: boolean;
  signIn: (opts?: { state?: Record<string, unknown> }) => void | Promise<void>;
  signUp: (opts?: { state?: Record<string, unknown> }) => void | Promise<void>;
  signOut: () => void | Promise<void>;
  /** Returns a bearer token for calling Netlify Functions, or null in demo mode. */
  getAccessToken: () => Promise<string | null>;
}

export const AccioAuthContext = createContext<AccioAuthValue | null>(null);

export function useAccioAuth(): AccioAuthValue {
  const ctx = useContext(AccioAuthContext);
  if (!ctx) {
    throw new Error("useAccioAuth must be used within <AuthProvider>");
  }
  return ctx;
}

export const WORKOS_CLIENT_ID: string | undefined = import.meta.env.VITE_WORKOS_CLIENT_ID;
export const AUTH_ENABLED = Boolean(WORKOS_CLIENT_ID);

/** Map a WorkOS user → an Accio role. In production this would come from
 *  WorkOS Organization membership / role metadata; here we derive a sensible
 *  default and allow an email-domain override for the operator console. */
export function deriveRole(email: string | undefined | null): AccioRole {
  if (!email) return "buyer";
  if (email.endsWith("@accio.market") || email.includes("+operator")) return "operator";
  if (email.includes("+seller")) return "seller";
  if (email.includes("+partner")) return "channel_partner";
  if (email.includes("+agent")) return "agent";
  return "buyer";
}
