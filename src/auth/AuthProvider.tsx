import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";

import {
  GrahmOSAuthContext,
  AUTH_ENABLED,
  WORKOS_CLIENT_ID,
  deriveRole,
  type GrahmOSAuthValue,
  type GrahmOSRole,
  type GrahmOSUser,
} from "./auth-context";
import { setTokenGetter } from "@/lib/api";

/* ── Real WorkOS bridge ──────────────────────────────────────────────
   Lives inside <AuthKitProvider>; republishes WorkOS state into our
   unified context so the rest of the app never imports authkit directly. */
function WorkOSBridge({ children }: { children: ReactNode }) {
  const { user, isLoading, signIn, signUp, signOut, getAccessToken } = useAuth();

  // Let the API client mint a fresh bearer token per request.
  useEffect(() => {
    setTokenGetter(async () => {
      try {
        return (await getAccessToken()) ?? null;
      } catch {
        return null;
      }
    });
  }, [getAccessToken]);

  const value = useMemo<GrahmOSAuthValue>(() => {
    const grahmosUser: GrahmOSUser | null = user
      ? {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePictureUrl: user.profilePictureUrl,
          role: deriveRole(user.email),
        }
      : null;

    return {
      user: grahmosUser,
      isLoading,
      demoMode: false,
      signIn: (opts) => signIn(opts),
      signUp: (opts) => signUp(opts),
      signOut: () => signOut(),
      getAccessToken: async () => {
        try {
          return (await getAccessToken()) ?? null;
        } catch {
          return null;
        }
      },
    };
  }, [user, isLoading, signIn, signUp, signOut, getAccessToken]);

  return <GrahmOSAuthContext.Provider value={value}>{children}</GrahmOSAuthContext.Provider>;
}

/* ── Demo fallback ───────────────────────────────────────────────────
   No WorkOS keys configured → simulate a session locally so the full
   product is explorable. Persists the chosen demo role in localStorage. */
const DEMO_KEY = "grahmos.demo.user";

function readDemoUser(): GrahmOSUser | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? (JSON.parse(raw) as GrahmOSUser) : null;
  } catch {
    return null;
  }
}

function DemoProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GrahmOSUser | null>(readDemoUser);

  const login = useCallback((role: GrahmOSRole) => {
    const demo: GrahmOSUser = {
      id: "demo_" + role,
      email: `demo+${role}@grahmos.market`,
      firstName: "Sophia",
      lastName: "Carter",
      profilePictureUrl: null,
      role,
    };
    localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
    setUser(demo);
  }, []);

  const value = useMemo<GrahmOSAuthValue>(
    () => ({
      user,
      isLoading: false,
      demoMode: true,
      // In demo mode, default to the operator role so /os is reachable.
      signIn: () => login("operator"),
      signUp: () => login("buyer"),
      signOut: () => {
        localStorage.removeItem(DEMO_KEY);
        setUser(null);
      },
      getAccessToken: async () => null,
    }),
    [user, login]
  );

  return <GrahmOSAuthContext.Provider value={value}>{children}</GrahmOSAuthContext.Provider>;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (AUTH_ENABLED && WORKOS_CLIENT_ID) {
    return (
      <AuthKitProvider clientId={WORKOS_CLIENT_ID}>
        <WorkOSBridge>{children}</WorkOSBridge>
      </AuthKitProvider>
    );
  }
  return <DemoProvider>{children}</DemoProvider>;
}
