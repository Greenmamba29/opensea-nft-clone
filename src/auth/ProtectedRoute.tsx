import { type ReactNode } from "react";

import { useAccioAuth, type AccioRole } from "./auth-context";
import { Button } from "@/components/ui/button";

/** Gates a route behind authentication and (optionally) a set of roles.
 *  Renders an inline sign-in prompt rather than redirecting, so deep links
 *  to /os degrade gracefully. */
export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: AccioRole[];
}) {
  const { user, isLoading, demoMode, signIn } = useAccioAuth();

  if (isLoading) {
    return (
      <div className="accio-theme flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="accio-theme flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="font-display text-3xl font-bold">
          Accio<span className="text-accio-gold">✦</span> Mall OS
        </div>
        <p className="max-w-sm text-muted-foreground">
          This is the operator console. Sign in to manage storefronts, leases,
          quotes, and the white-glove agent queue.
        </p>
        <Button size="lg" onClick={() => signIn()}>
          {demoMode ? "Enter Demo (Operator)" : "Sign in with AuthKit"}
        </Button>
        {demoMode && (
          <p className="text-xs text-muted-foreground">
            Running in demo mode — set <code>VITE_WORKOS_CLIENT_ID</code> to enable real auth.
          </p>
        )}
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="accio-theme flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="font-display text-2xl font-bold">Access restricted</div>
        <p className="max-w-sm text-muted-foreground">
          Your account ({user.role.replace("_", " ")}) doesn't have access to this
          console. Contact your Accio success manager to adjust permissions.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
