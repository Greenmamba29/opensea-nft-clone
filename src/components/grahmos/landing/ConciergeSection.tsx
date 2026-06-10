import { ArrowRight, BadgeCheck, Handshake, Headset, Rocket, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import Reveal from "@/components/grahmos/Reveal";
import { openConcierge } from "./use-motion";

const SPECIALISTS = [
  { icon: Search, name: "Sourcing", role: "Finds the right matches" },
  { icon: BadgeCheck, name: "Leasing", role: "Places storefronts" },
  { icon: Handshake, name: "Deals", role: "Negotiates & closes" },
  { icon: Rocket, name: "Success", role: "Tracks every order" },
];

/** One GrahmOS Concierge — the user talks to a single agent; a team of
 *  specialists works behind it. */
export default function ConciergeSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-grahmos-gold">
              White-Glove Service
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              One concierge. A whole team behind it.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              You never juggle vendors or chase quotes. You talk to the GrahmOS
              Concierge — one agent, in plain language — and behind it, sourcing,
              leasing, deal, and success specialists do the legwork. Human experts
              step in whenever a requirement gets complicated.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => openConcierge()}>
                <Headset /> Ask the Concierge <ArrowRight />
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto max-w-sm">
            {/* The one agent */}
            <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-grahmos-purple/25 bg-gradient-to-r from-grahmos-purple-deep to-grahmos-purple p-4 text-white shadow-xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Sparkles className="h-5 w-5 text-grahmos-gold-light" />
              </span>
              <div>
                <div className="text-sm font-bold">GrahmOS Concierge</div>
                <div className="text-[11px] text-white/70">
                  <span className="text-emerald-300">●</span> The only agent you talk to
                </div>
              </div>
            </div>
            {/* Specialists behind */}
            <div className="relative -mt-2 rounded-2xl border border-border bg-grahmos-cream px-4 pb-4 pt-6">
              <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Specialists working behind it
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALISTS.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold leading-tight">{s.name}</span>
                      <span className="block text-[10px] text-muted-foreground">{s.role}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-border pt-2.5 text-center text-[10px] font-semibold text-muted-foreground">
                <Headset className="mr-1 inline h-3 w-3" /> 24/7 Human + AI support
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
