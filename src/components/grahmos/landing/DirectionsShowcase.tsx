import { useEffect, useState } from "react";
import {
  Check,
  FileText,
  LayoutGrid,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Store,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useInView, usePrefersReducedMotion } from "./use-motion";

const STEPS = [
  {
    icon: MessageCircle,
    label: "You tell GrahmOS",
    title: "“I need 500 branded shipping boxes by Friday.”",
    detail: "Plain language. No catalogs, no filters.",
    chips: [] as string[],
  },
  {
    icon: LayoutGrid,
    label: "Aisle matched",
    title: "Packaging Aisle",
    detail: "GrahmOS routes you to the right corner of the mall.",
    chips: ["Brooklyn Navy Yard"],
  },
  {
    icon: Store,
    label: "Storefronts shortlisted",
    title: "3 storefronts can do this",
    detail: "Capacity, lead time, and minimums checked for you.",
    chips: ["BoxWorks BNY", "Navy Yard Print Co.", "PackRight"],
  },
  {
    icon: FileText,
    label: "Quotes compared",
    title: "Quotes side by side",
    detail: "$2.10 / unit · 3-day lead — best match flagged.",
    chips: [],
  },
  {
    icon: ShoppingCart,
    label: "Cart & delivery",
    title: "Order placed, local delivery booked",
    detail: "From the Yard to your door. Concierge tracks it.",
    chips: [],
  },
];

/** Directions Mode — the signature visual. A vertical Route Card stepper:
 *  intent → aisle → storefronts → quote → cart, joined by an animated beam.
 *  Pure CSS/SVG animation (draw-in beam, staggered reveals, cycling pulse);
 *  all motion is disabled under prefers-reduced-motion. */
export default function DirectionsShowcase() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = usePrefersReducedMotion();
  const animate = inView && !reduced;
  const show = inView || reduced;
  const [active, setActive] = useState(0);

  // Cycle the "current step" glow once the card has drawn in.
  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % STEPS.length),
      2200
    );
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <div ref={ref} className="relative">
      {!reduced && (
        <style>{`
          @keyframes grahmos-beam-dot {
            0% { top: 0%; opacity: 0; }
            8% { opacity: 1; }
            92% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_90px_-24px_rgba(59,22,128,0.35)]">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-grahmos-purple-deep to-grahmos-purple px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <MapPin className="h-4 w-4 text-grahmos-gold-light" />
            </span>
            <div>
              <div className="text-sm font-bold leading-tight">Directions Mode</div>
              <div className="text-[11px] text-white/70">Your route through the mall</div>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-grahmos-gold-light">
            Live route
          </span>
        </div>

        {/* Stepper */}
        <div className="relative px-5 py-6 sm:px-7">
          {/* Beam track + draw-in beam */}
          <div className="absolute bottom-8 left-[2.45rem] top-8 w-px bg-border sm:left-[2.95rem]" />
          <div
            className="absolute bottom-8 left-[2.45rem] top-8 w-px origin-top bg-gradient-to-b from-grahmos-purple via-grahmos-purple-light to-grahmos-gold transition-transform duration-[1600ms] ease-out sm:left-[2.95rem]"
            style={{ transform: show ? "scaleY(1)" : "scaleY(0)" }}
          />
          {/* Traveling pulse dot */}
          {animate && (
            <div className="absolute bottom-8 left-[2.45rem] top-8 w-px sm:left-[2.95rem]">
              <span
                className="absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-grahmos-gold shadow-[0_0_10px_2px_rgba(201,162,39,0.6)]"
                style={{ animation: "grahmos-beam-dot 4.5s ease-in-out 1.4s infinite" }}
              />
            </div>
          )}

          <ol className="relative space-y-5">
            {STEPS.map((s, i) => {
              const isActive = animate && active === i;
              return (
                <li
                  key={s.label}
                  className={cn(
                    "flex items-start gap-4 transition-all duration-700 ease-out",
                    show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: reduced ? "0ms" : `${200 + i * 260}ms` }}
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                      isActive
                        ? "border-grahmos-gold bg-grahmos-purple text-white shadow-[0_0_0_5px_rgba(91,33,182,0.14)]"
                        : "border-border bg-secondary text-primary"
                    )}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-grahmos-gold">
                      {s.label}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 text-sm font-semibold leading-snug",
                        i === 0 && "font-display text-[15px] italic"
                      )}
                    >
                      {s.title}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{s.detail}</div>
                    {s.chips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.chips.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-border bg-grahmos-cream px-2.5 py-0.5 text-[11px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {i === STEPS.length - 1 && (
                    <span
                      className={cn(
                        "ml-auto mt-1 hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-opacity duration-700 sm:flex",
                        show ? "opacity-100" : "opacity-0"
                      )}
                      style={{ transitionDelay: reduced ? "0ms" : "1700ms" }}
                    >
                      <Check className="h-3 w-3" /> Done
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
