// Route state for Directions Mode — context + localStorage persistence so the
// active route survives navigation and reloads across all /mall pages.

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { MallRoute } from "./routeEngine";

const STORAGE_KEY = "grahmos.route";

interface RouteContextValue {
  route: MallRoute | null;
  startRoute: (route: MallRoute) => void;
  /** Mark a stop done (and thereby advance the current stop). */
  completeStop: (stopId: string) => void;
  clearRoute: () => void;
}

const RouteContext = createContext<RouteContextValue | null>(null);

function loadRoute(): MallRoute | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MallRoute;
    if (!parsed || !Array.isArray(parsed.stops)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<MallRoute | null>(loadRoute);

  // Persist every change; clear the key when the route ends.
  useEffect(() => {
    try {
      if (route) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(route));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable (private mode etc.) — route still works in memory.
    }
  }, [route]);

  const startRoute = useCallback((next: MallRoute) => setRoute(next), []);

  const completeStop = useCallback((stopId: string) => {
    setRoute((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stops: prev.stops.map((s) => (s.id === stopId ? { ...s, done: true } : s)),
      };
    });
  }, []);

  const clearRoute = useCallback(() => setRoute(null), []);

  return (
    <RouteContext.Provider value={{ route, startRoute, completeStop, clearRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute(): RouteContextValue {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error("useRoute must be used within a RouteProvider");
  return ctx;
}
