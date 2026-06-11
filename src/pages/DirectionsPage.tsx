import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AISLES, aisleBySlug } from "@/lib/mallData";
import { generateRoute, currentStop, routeProgress } from "@/lib/routeEngine";
import { useRoute } from "@/lib/routeContext";
import {
  loadChosenGrandma,
  narrate,
  openGrandmaPicker,
  pickGrandmotherForIntent,
  useGrandma,
  type Grandmother,
} from "@/lib/grandmothers";
import { usePrefersReducedMotion } from "@/components/grahmos/landing/use-motion";

const EXAMPLE_INTENTS = [
  "200 branded boxes for my business",
  "Custom merch for a launch event",
  "A local coffee supplier",
  "CNC fabrication for a prototype",
  "Same-day delivery for my shop",
  "PCB assembly for a small run",
];

const QUANTITY_OPTIONS = ["Sample", "<100", "100–1,000", "1,000+"];
const AUDIENCE_OPTIONS = ["For my business", "Personal"];

/* ── Stylized mall map (SVG) ───────────────────────────────────────── */

// 4 × 2 grid of aisle blocks; entrance at bottom center.
const BLOCK_W = 170;
const BLOCK_H = 84;
function blockPos(index: number) {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return { x: 20 + col * 190, y: row === 0 ? 24 : 128 };
}

/** Point a fraction `t` (0..1) of the way along a polyline, by arc length. */
function pointAlong(pts: Array<{ x: number; y: number }>, t: number): { x: number; y: number } {
  if (pts.length === 0) return { x: 400, y: 306 };
  const lengths = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = lengths.reduce((a, b) => a + b, 0);
  let dist = Math.min(1, Math.max(0, t)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (dist <= lengths[i] || i === lengths.length - 1) {
      const f = lengths[i] === 0 ? 0 : Math.min(1, dist / lengths[i]);
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * f,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * f,
      };
    }
    dist -= lengths[i];
  }
  return pts[pts.length - 1];
}

function MallMap({
  targetSlug,
  progress,
  grandma,
}: {
  targetSlug: string;
  /** Fraction of stops completed (0..1) — drives the traveling marker. */
  progress: number;
  grandma: Grandmother;
}) {
  const reduced = usePrefersReducedMotion();
  const targetIndex = AISLES.findIndex((a) => a.slug === targetSlug);
  const target = targetIndex >= 0 ? blockPos(targetIndex) : null;
  const targetRow = targetIndex >= 0 ? Math.floor(targetIndex / 4) : 0;
  const cx = target ? target.x + BLOCK_W / 2 : 400;
  // Walk up the central corridor, turn down the row gap, arrive at the block.
  const yMid = targetRow === 0 ? 118 : 222;
  const yEnd = targetRow === 0 ? 110 : 214;
  const walkPoints = target
    ? [
        { x: 400, y: 300 },
        { x: 400, y: yMid },
        { x: cx, y: yMid },
        { x: cx, y: yEnd },
      ]
    : [];
  const path = target ? `M400 300 L400 ${yMid} L${cx} ${yMid} L${cx} ${yEnd}` : "";
  const traveler = pointAlong(walkPoints, progress);

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] p-4">
      <style>{`
        @keyframes gm-route-dash { to { stroke-dashoffset: -36; } }
        .gm-route-path { animation: gm-route-dash 1.2s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .gm-route-path { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 800 340" className="w-full" role="img" aria-label="Mall map with your route highlighted">
        {/* Aisle blocks */}
        {AISLES.map((aisle, i) => {
          const { x, y } = blockPos(i);
          const isTarget = aisle.slug === targetSlug;
          return (
            <g key={aisle.slug}>
              <rect
                x={x}
                y={y}
                width={BLOCK_W}
                height={BLOCK_H}
                rx={12}
                fill={aisle.color}
                fillOpacity={isTarget ? 0.28 : 0.1}
                stroke={aisle.color}
                strokeOpacity={isTarget ? 1 : 0.35}
                strokeWidth={isTarget ? 2.5 : 1}
              />
              <text x={x + 14} y={y + 34} fontSize="20">
                {aisle.icon}
              </text>
              <text
                x={x + 14}
                y={y + 60}
                fontSize="13"
                fontWeight="700"
                fill="var(--os-text)"
                opacity={isTarget ? 1 : 0.7}
              >
                {aisle.name.length > 20 ? `${aisle.name.slice(0, 19)}…` : aisle.name}
              </text>
              {isTarget && (
                <text x={x + BLOCK_W - 16} y={y + 24} fontSize="14" textAnchor="end" fill={aisle.color} fontWeight="800">
                  ★
                </text>
              )}
            </g>
          );
        })}

        {/* Route path: entrance → target aisle */}
        {path && (
          <path
            d={path}
            fill="none"
            stroke="var(--os-blue)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 8"
            className="gm-route-path"
          />
        )}

        {/* Entrance marker */}
        <circle cx={400} cy={306} r={9} fill="var(--os-gold)" />
        <circle cx={400} cy={306} r={4} fill="var(--os-bg)" />
        <text x={416} y={311} fontSize="13" fontWeight="700" fill="var(--os-text-secondary)">
          You are here · Mall entrance
        </text>

        {/* Traveling marker — your grandma walks the route as stops complete.
            Reduced motion: position jumps without the transition. */}
        {walkPoints.length > 0 && (
          <g
            style={{
              transform: `translate(${traveler.x}px, ${traveler.y}px)`,
              transition: reduced ? undefined : "transform 1000ms ease",
            }}
          >
            <circle r={10} fill={grandma.accentColor} stroke="var(--os-bg)" strokeWidth={2.5} />
            <circle r={4} fill="var(--os-bg)" />
            <text y={-16} textAnchor="middle" fontSize="18" aria-hidden>
              {grandma.emoji}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function DirectionsPage() {
  const { route, startRoute, completeStop, clearRoute } = useRoute();
  // Re-renders on grandma change; the narrator prefers her specialty fallback
  // below when the user never explicitly chose a guide.
  const chosenOrAssigned = useGrandma();
  const grandma = route
    ? loadChosenGrandma() ?? pickGrandmotherForIntent(route.aisleSlug)
    : chosenOrAssigned;
  const [intent, setIntent] = useState("");
  const [pendingIntent, setPendingIntent] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);

  function submitIntent(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPendingIntent(trimmed);
    setQuantity(null);
    setAudience(null);
  }

  function buildRoute() {
    if (!pendingIntent) return;
    startRoute(generateRoute(pendingIntent, { quantity: quantity ?? undefined }));
    setPendingIntent(null);
    setIntent("");
    // First run: no stored grandma yet — meet your guide before you walk.
    if (!loadChosenGrandma()) openGrandmaPicker();
  }

  function resetAll() {
    clearRoute();
    setPendingIntent(null);
    setIntent("");
    setQuantity(null);
    setAudience(null);
  }

  function askConcierge() {
    window.dispatchEvent(
      new CustomEvent("grahmos:open-concierge", {
        detail: { intent: route?.intent ?? pendingIntent ?? intent.trim() ?? undefined },
      })
    );
  }

  return (
    <div className="min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--os-blue)]/30 bg-[var(--os-blue)]/15 text-xl">
              🧭
            </span>
            <h1 className="text-3xl font-black tracking-tight">Guided Mode</h1>
          </div>
          <p className="font-medium text-[var(--os-text-secondary)]">
            Tell GrahmOS what you need. Get a route through the mall.
          </p>
        </div>

        {route ? (
          /* ── Active route view ──────────────────────────────────── */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--os-gold)]">
                  Your route
                </div>
                <div className="text-lg font-bold leading-snug">“{route.intent}”</div>
                <div className="mt-1 text-xs font-semibold text-[var(--os-text-tertiary)]">
                  {route.stops.length} stops · ~{Math.max(2, route.stops.length - 1)} min ·{" "}
                  {aisleBySlug(route.aisleSlug)?.name} Aisle
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={askConcierge}
                  className="rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-2)] px-4 py-2 text-sm font-bold text-[var(--os-text-secondary)] transition-colors hover:bg-[var(--os-surface-3)] hover:text-[var(--os-text)]"
                >
                  Ask GrahmOS instead
                </button>
                <button
                  onClick={resetAll}
                  className="rounded-xl border border-[var(--os-red)]/30 bg-[var(--os-red)]/10 px-4 py-2 text-sm font-bold text-[var(--os-red)] transition-colors hover:bg-[var(--os-red)]/20"
                >
                  Clear route
                </button>
              </div>
            </div>

            {/* Grandmother guide — the concierge's persona narrates the walk */}
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] px-4 py-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                style={{
                  backgroundColor: `${grandma.accentColor}26`,
                  boxShadow: `inset 0 0 0 1.5px ${grandma.accentColor}`,
                }}
                aria-hidden
              >
                {grandma.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{grandma.shortName} is guiding you</div>
                <div className="truncate text-xs italic text-[var(--os-text-secondary)]">
                  “{grandma.routeBlessing}”
                </div>
              </div>
              <button
                onClick={openGrandmaPicker}
                className="shrink-0 text-xs font-bold text-[var(--os-text-tertiary)] transition-colors hover:text-[var(--os-text)]"
              >
                Change guide
              </button>
            </div>

            <MallMap
              targetSlug={route.aisleSlug}
              progress={routeProgress(route).done / route.stops.length}
              grandma={grandma}
            />

            {/* Vertical stepper */}
            <div className="relative rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] px-6 py-6">
              <div className="absolute bottom-10 left-[2.6rem] top-10 w-px bg-[var(--os-border)]" />
              <ol className="relative space-y-6">
                {route.stops.map((stop, i) => {
                  const isCurrent = currentStop(route)?.id === stop.id;
                  return (
                    <li key={stop.id} className="flex items-start gap-4">
                      <span
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                          stop.done
                            ? "border-[var(--os-green)]/40 bg-[var(--os-green)]/15 text-[var(--os-green)]"
                            : isCurrent
                              ? "border-[var(--os-blue)] bg-[var(--os-blue)]/20 text-[var(--os-blue)] ring-4 ring-[var(--os-blue)]/20"
                              : "border-[var(--os-border)] bg-[var(--os-surface-2)] text-[var(--os-text-tertiary)]"
                        }`}
                      >
                        {stop.done ? "✓" : i + 1}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div
                          className={`text-sm font-bold leading-snug ${
                            stop.done ? "text-[var(--os-text-tertiary)] line-through" : ""
                          }`}
                        >
                          {stop.title}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--os-text-secondary)]">{stop.subtitle}</div>
                        {!stop.done && (
                          <div className="mt-1 text-xs italic" style={{ color: grandma.accentColor }}>
                            “{narrate(stop, grandma)}”
                          </div>
                        )}
                        {!stop.done && (
                          <div className="mt-2 flex items-center gap-3">
                            <Link
                              to={stop.link}
                              className={`text-xs font-bold hover:underline ${
                                isCurrent ? "text-[var(--os-blue)]" : "text-[var(--os-text-secondary)]"
                              }`}
                            >
                              Go to stop →
                            </Link>
                            <button
                              onClick={() => completeStop(stop.id)}
                              className="text-xs font-bold text-[var(--os-text-tertiary)] hover:text-[var(--os-text)]"
                            >
                              Mark done
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {routeProgress(route).done === route.stops.length && (
                <div className="mt-6 rounded-xl border border-[var(--os-green)]/30 bg-[var(--os-green)]/10 px-4 py-3 text-sm font-bold text-[var(--os-green)]">
                  ✓ Route complete. Beautifully done — your order is in good hands.
                </div>
              )}
            </div>
          </div>
        ) : pendingIntent ? (
          /* ── Clarifying questions ───────────────────────────────── */
          <div className="space-y-6 rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] p-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--os-gold)]">
                Building your route
              </div>
              <div className="mt-1 text-lg font-bold">“{pendingIntent}”</div>
              <p className="mt-1 text-sm text-[var(--os-text-secondary)]">
                Two quick questions so we point you to the right doors. Skip them if you like.
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold text-[var(--os-text-secondary)]">Roughly how many?</div>
              <div className="flex flex-wrap gap-2">
                {QUANTITY_OPTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(quantity === q ? null : q)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                      quantity === q
                        ? "border-[var(--os-blue)] bg-[var(--os-blue)]/20 text-[var(--os-blue)]"
                        : "border-[var(--os-border)] bg-[var(--os-surface-2)] text-[var(--os-text-secondary)] hover:text-[var(--os-text)]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold text-[var(--os-text-secondary)]">Who is it for?</div>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(audience === a ? null : a)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                      audience === a
                        ? "border-[var(--os-blue)] bg-[var(--os-blue)]/20 text-[var(--os-blue)]"
                        : "border-[var(--os-border)] bg-[var(--os-surface-2)] text-[var(--os-text-secondary)] hover:text-[var(--os-text)]"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={buildRoute}
                className="rounded-xl bg-[var(--os-blue)] px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
              >
                Build my route →
              </button>
              <button
                onClick={buildRoute}
                className="text-sm font-bold text-[var(--os-text-secondary)] hover:text-[var(--os-text)]"
              >
                Skip — just route me
              </button>
              <button
                onClick={() => setPendingIntent(null)}
                className="ml-auto text-sm font-semibold text-[var(--os-text-tertiary)] hover:text-[var(--os-text)]"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          /* ── Intent input ───────────────────────────────────────── */
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitIntent(intent);
              }}
              className="flex gap-3"
            >
              <input
                autoFocus
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="What do you need today?"
                className="h-14 flex-1 rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-2)] px-5 text-base font-medium transition-colors placeholder:text-[var(--os-text-tertiary)] focus:border-[var(--os-blue)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!intent.trim()}
                className="rounded-2xl bg-[var(--os-blue)] px-6 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-40"
              >
                Get directions
              </button>
            </form>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--os-text-tertiary)]">
                Or start from one of these
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_INTENTS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => submitIntent(ex)}
                    className="rounded-full border border-[var(--os-border)] bg-[var(--os-surface-2)] px-4 py-2 text-sm font-semibold text-[var(--os-text-secondary)] transition-colors hover:border-[var(--os-blue)]/50 hover:text-[var(--os-text)]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-[var(--os-border)] pt-5 text-sm">
              <span className="text-[var(--os-text-tertiary)]">Prefer to talk it through?</span>
              <button onClick={askConcierge} className="font-bold text-[var(--os-blue)] hover:underline">
                Ask GrahmOS instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
