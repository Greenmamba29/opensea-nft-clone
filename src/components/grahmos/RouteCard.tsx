import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGrandma } from "@/lib/grandmothers";
import { useRoute } from "@/lib/routeContext";
import { currentStop, routeProgress } from "@/lib/routeEngine";

/** Persistent Route Card — a compact, docked summary of the active Directions
 *  Mode route. Lives on every /mall page except /mall/directions, stacked
 *  above the Concierge launcher (which docks at bottom-5 right-5, z-60). */
export default function RouteCard() {
  const { route, completeStop, clearRoute } = useRoute();
  const grandma = useGrandma();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);

  if (!route || pathname.startsWith("/mall/directions")) return null;

  const current = currentStop(route);
  const { done, total } = routeProgress(route);
  const finished = !current;

  return (
    <div className="fixed z-[55] right-5 bottom-24 w-[21rem] max-md:left-3 max-md:right-3 max-md:w-auto">
      <div className="overflow-hidden rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] text-[var(--os-text)] shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-[var(--os-border)] bg-[var(--os-surface-2)] px-4 py-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--os-blue)]/15 text-sm">
            🧭
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold" title={route.intent}>
              {route.intent}
            </div>
            <div className="text-[11px] font-semibold text-[var(--os-text-tertiary)]">
              <span aria-hidden className="mr-1">
                {grandma.emoji}
              </span>
              {finished ? "Route complete" : `Stop ${done + 1} of ${total}`}
            </div>
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="rounded-md p-1 text-xs text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-3)]"
            aria-label={expanded ? "Collapse route" : "Expand route"}
          >
            {expanded ? "▾" : "▸"}
          </button>
          <button
            onClick={clearRoute}
            className="rounded-md p-1 text-xs text-[var(--os-text-tertiary)] hover:bg-[var(--os-surface-3)] hover:text-[var(--os-text)]"
            aria-label="End route"
          >
            ✕
          </button>
        </div>

        {/* Mini stepper (expanded) */}
        {expanded && (
          <ol className="space-y-1 border-b border-[var(--os-border)] px-4 py-3">
            {route.stops.map((s, i) => {
              const isCurrent = current?.id === s.id;
              return (
                <li key={s.id} className="flex items-center gap-2.5 text-xs">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      s.done
                        ? "border-[var(--os-green)]/40 bg-[var(--os-green)]/15 text-[var(--os-green)]"
                        : isCurrent
                          ? "border-[var(--os-blue)] bg-[var(--os-blue)]/20 text-[var(--os-blue)]"
                          : "border-[var(--os-border)] bg-[var(--os-surface-2)] text-[var(--os-text-tertiary)]"
                    }`}
                  >
                    {s.done ? "✓" : i + 1}
                  </span>
                  <span
                    className={`truncate font-semibold ${
                      isCurrent
                        ? "text-[var(--os-text)]"
                        : s.done
                          ? "text-[var(--os-text-tertiary)] line-through"
                          : "text-[var(--os-text-secondary)]"
                    }`}
                  >
                    {s.title}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {/* Current stop + actions */}
        <div className="px-4 py-3">
          {current ? (
            <>
              <div className="mb-2 text-sm font-bold leading-snug">{current.title}</div>
              <div className="flex items-center gap-2">
                <Link
                  to={current.link}
                  className="flex-1 rounded-lg bg-[var(--os-blue)] px-3 py-1.5 text-center text-xs font-bold text-white transition-all hover:brightness-110"
                >
                  Go to stop →
                </Link>
                <button
                  onClick={() => completeStop(current.id)}
                  className="rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--os-text-secondary)] transition-colors hover:bg-[var(--os-surface-3)] hover:text-[var(--os-text)]"
                >
                  Next stop
                </button>
              </div>
            </>
          ) : (
            <div className="mb-2 text-sm font-bold text-[var(--os-green)]">
              ✓ All stops complete — beautifully done.
            </div>
          )}
          <Link
            to="/mall/directions"
            className="mt-2 block text-center text-[11px] font-bold text-[var(--os-blue)] hover:underline"
          >
            Open Guided Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
