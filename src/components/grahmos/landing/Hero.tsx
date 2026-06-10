import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, LayoutGrid, ShieldCheck, Sparkles, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import DirectionsShowcase from "./DirectionsShowcase";
import { openConcierge, usePrefersReducedMotion } from "./use-motion";

const SUGGESTIONS = [
  "500 branded shipping boxes",
  "CNC shop for a small run",
  "Catering for 40, weekly",
];

/** Buyer-first hero: intent input → Concierge, plus the Directions Mode
 *  Route Card as the signature visual. Subtle drifting spotlight gradient. */
export default function Hero({ onApply }: { onApply: () => void }) {
  const [intent, setIntent] = useState("");
  const reduced = usePrefersReducedMotion();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    openConcierge(intent || undefined);
  };

  return (
    <section className="relative overflow-hidden">
      {!reduced && (
        <style>{`
          @keyframes grahmos-spotlight {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(6%, 4%) scale(1.08); }
            66% { transform: translate(-4%, -3%) scale(0.96); }
          }
        `}</style>
      )}
      {/* Spotlight / gradient wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0) 70%)",
            animation: reduced ? undefined : "grahmos-spotlight 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0) 70%)",
            animation: reduced ? undefined : "grahmos-spotlight 18s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_1fr]">
        <div className={reduced ? undefined : "animate-fade-up"}>
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-grahmos-gold">
            <Sparkles className="h-3.5 w-3.5" /> The BNY Digital Mall
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Walk into the mall.
            <br />
            Tell GrahmOS what you need.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            GrahmOS is an AI-guided virtual mall for buying, sourcing, and selling
            through digital storefronts — launching with the makers of the
            Brooklyn Navy Yard. State your need, and GrahmOS routes you to the
            right aisle, storefronts, quotes, or a sourcing agent.
          </p>

          {/* Intent input — primary CTA */}
          <form
            onSubmit={submit}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-grahmos-purple/25 bg-card p-2 shadow-[0_18px_50px_-18px_rgba(91,33,182,0.35)] transition-shadow focus-within:shadow-[0_18px_50px_-12px_rgba(91,33,182,0.5)]"
          >
            <Sparkles className="ml-2.5 h-5 w-5 shrink-0 text-grahmos-purple-light" />
            <input
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="I need 500 branded shipping boxes by Friday…"
              aria-label="Tell GrahmOS what you need"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Tell GrahmOS what you need <ArrowRight />
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => openConcierge(s)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary transition-colors hover:border-grahmos-purple/40 hover:bg-secondary"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Secondary CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/mall/aisles">
              <Button variant="outline">
                <LayoutGrid /> Browse Aisles
              </Button>
            </Link>
            <Link to="/mall/quotes">
              <Button variant="outline">
                <FileText /> Request a Quote
              </Button>
            </Link>
            <Button variant="ghost" onClick={onApply}>
              <Store /> Open a Storefront
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-grahmos-gold" />
            Curated Brooklyn Navy Yard businesses · One concierge, end to end
          </div>
        </div>

        <div
          className={reduced ? undefined : "animate-fade-up"}
          style={reduced ? undefined : { animationDelay: "150ms" }}
        >
          <DirectionsShowcase />
        </div>
      </div>
    </section>
  );
}
