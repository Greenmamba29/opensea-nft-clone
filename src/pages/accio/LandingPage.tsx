import { useState } from "react";
import { Link } from "react-router-dom";
import { Player } from "@remotion/player";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  ChartNoAxesCombined,
  Check,
  Coffee,
  Gift,
  Handshake,
  Headset,
  LayoutGrid,
  MapPin,
  Package,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAccioAuth } from "@/auth/auth-context";
import Reveal from "@/components/accio/Reveal";
import Concierge from "@/components/accio/Concierge";
import { MallHero, MALL_HERO_DURATION, MALL_HERO_FPS } from "@/remotion/MallHero";

const STATS = [
  { icon: Store, value: "2,350+", label: "Active Storefronts" },
  { icon: Users, value: "48,620+", label: "Buyer Leads This Month" },
  { icon: Package, value: "12,840+", label: "Quote Requests" },
  { icon: ChartNoAxesCombined, value: "$22.4M+", label: "Agent-Assisted Sales" },
];

const STEPS = [
  { icon: Search, title: "Choose Store Type", body: "Pick the right storefront format and category for your business." },
  { icon: Bot, title: "Build with Agents", body: "Our AI + human agents help you set up, brand, and prepare to go live." },
  { icon: MapPin, title: "Lease Your Placement", body: "Secure your prime spot in the mall with flexible leasing options." },
  { icon: Rocket, title: "Launch and Grow", body: "Go live, reach qualified buyers, and scale with continuous support." },
];

const PLANS = [
  {
    name: "Pop-Up Booth",
    icon: "🎪",
    monthly: 59,
    blurb: "Perfect for short-term campaigns.",
    features: ["7 days duration", "Basic branding", "Shared aisle placement"],
    popular: false,
  },
  {
    name: "Starter Storefront",
    icon: "🏪",
    monthly: 179,
    blurb: "Great for growing businesses.",
    features: ["Custom storefront", "Standard placement", "Leads & chat access"],
    popular: false,
  },
  {
    name: "Premium Storefront",
    icon: "💼",
    monthly: 359,
    blurb: "High visibility. More buyers.",
    features: ["Premium placement", "Featured listing", "Agent-assisted setup"],
    popular: true,
  },
  {
    name: "Anchor Tenant",
    icon: "🏛️",
    monthly: 899,
    blurb: "Maximum exposure. Exclusive spaces.",
    features: ["Exclusive placement", "Dedicated concierge", "Custom integrations"],
    popular: false,
    cta: "Talk to Sales",
  },
];

const ADVANTAGES = [
  { icon: LayoutGrid, title: "Category Placement", body: "Strategic visibility in high-intent aisles." },
  { icon: Search, title: "B2B Sourcing Desk", body: "AI-powered matches and supplier discovery." },
  { icon: Handshake, title: "Channel Partner Access", body: "Connect, collaborate and co-sell." },
  { icon: Headset, title: "Buyer Concierge", body: "Human experts for complex requirements." },
  { icon: ChartNoAxesCombined, title: "Analytics & Insights", body: "Real-time performance and buyer intelligence." },
];

const AISLES = [
  { icon: Sparkles, name: "Local Makers", body: "Handmade. Homegrown. Heartfelt.", tint: "from-rose-900/80 to-rose-700/60" },
  { icon: Package, name: "Office Supplies", body: "Everything your office runs on.", tint: "from-slate-900/80 to-slate-700/60" },
  { icon: Coffee, name: "Food & Beverage", body: "From local flavors to global tastes.", tint: "from-amber-900/80 to-amber-700/60" },
  { icon: Gift, name: "Corporate Gifting", body: "Thoughtful gifts for every occasion.", tint: "from-violet-900/80 to-violet-700/60" },
  { icon: Building2, name: "B2B Sourcing", body: "Source. Compare. Collaborate.", tint: "from-emerald-900/80 to-emerald-700/60" },
];

const AGENT_TEAM = [
  { icon: Search, name: "AI Sourcing Agent", role: "Finds the right matches" },
  { icon: BadgeCheck, name: "Leasing Concierge", role: "Secures your ideal spot" },
  { icon: Handshake, name: "Deal Coordinator", role: "Negotiates & closes" },
  { icon: Rocket, name: "Success Manager", role: "Supports your growth" },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const { user, signIn, signUp, signOut } = useAccioAuth();

  return (
    <div className="accio-theme min-h-screen">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-accio-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            Accio<span className="text-accio-gold">✦</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/mall" className="transition-colors hover:text-foreground">Mall</Link>
            <a href="#how" className="transition-colors hover:text-foreground">Solutions</a>
            <a href="#plans" className="transition-colors hover:text-foreground">For Sellers</a>
            <a href="#aisles" className="transition-colors hover:text-foreground">For Buyers</a>
            <a href="#plans" className="transition-colors hover:text-foreground">Pricing</a>
            <Link to="/os" className="transition-colors hover:text-foreground">Mall OS</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/os">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    {user.firstName ? `Hi, ${user.firstName}` : "Console"}
                  </Button>
                </Link>
                <Button onClick={() => signOut()} variant="outline">Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => signIn()}>
                  Sign In
                </Button>
                <Button onClick={() => signUp()}>
                  Apply for a Storefront <ArrowRight />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="animate-fade-up">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accio-gold">
            The Future of Commerce
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
            Lease a storefront in a virtual mall. Grow with white-glove agent support.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Accio is a premium virtual mall and digital leasing platform where businesses,
            buyers, sellers, and channel partners transact through AI and human-assisted
            commerce agents.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg">
              Apply for a Storefront <ArrowRight />
            </Button>
            <Button size="lg" variant="outline">
              <Store /> Explore the Mall
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accio-gold" />
            Curated businesses. Verified buyers. Human + AI agents.
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="overflow-hidden rounded-2xl shadow-[0_40px_90px_-20px_rgba(59,22,128,0.45)]">
            <Player
              component={MallHero}
              durationInFrames={MALL_HERO_DURATION}
              fps={MALL_HERO_FPS}
              compositionWidth={960}
              compositionHeight={600}
              autoPlay
              loop
              controls={false}
              style={{ width: "100%" }}
            />
          </div>
          {/* Agent team rail */}
          <div className="absolute -right-3 top-6 hidden w-52 rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur xl:block">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-accio-gold">
              Your Agent Team
            </div>
            {AGENT_TEAM.map((a) => (
              <div key={a.name} className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-secondary">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
                  <a.icon className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold leading-tight">{a.name}</span>
                  <span className="block text-[10px] text-muted-foreground">{a.role}</span>
                </span>
              </div>
            ))}
            <div className="mt-2 border-t border-border pt-2 text-center text-[10px] font-semibold text-muted-foreground">
              <Headset className="mr-1 inline h-3 w-3" /> 24/7 Human + AI Support
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 divide-border rounded-2xl border border-border bg-card shadow-sm md:grid-cols-4 md:divide-x">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-7 py-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-2xl font-extrabold tracking-tight">{s.value}</span>
                  <span className="block text-xs text-muted-foreground">{s.label}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── How it works + Plans ────────────────────────── */}
      <section id="how" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div>
            <div className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-accio-gold">
              How Accio Works
            </div>
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <Card key={s.title} className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                      {i + 1}
                    </span>
                    <span>
                      <span className="mb-1 flex items-center gap-2 font-semibold">
                        <s.icon className="h-4 w-4 text-primary" /> {s.title}
                      </span>
                      <span className="block text-sm text-muted-foreground">{s.body}</span>
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div id="plans">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-accio-gold">
                Storefront Plans
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className={!annual ? "text-foreground" : "text-muted-foreground"}>Billed Monthly</span>
                <Switch checked={annual} onCheckedChange={setAnnual} />
                <span className={annual ? "text-foreground" : "text-muted-foreground"}>Billed Annually</span>
                <Badge variant="gold">Save up to 20%</Badge>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {PLANS.map((p) => {
                const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
                return (
                  <Card
                    key={p.name}
                    className={
                      p.popular
                        ? "relative border-accio-gold shadow-[0_18px_50px_-14px_rgba(201,162,39,0.45)]"
                        : "transition-shadow hover:shadow-md"
                    }
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="gold" className="bg-accio-gold text-accio-ink">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="text-3xl">{p.icon}</div>
                      <div className="mt-3 font-semibold">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.blurb}</div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold tracking-tight">${price}</span>
                        <span className="text-sm text-muted-foreground"> /mo</span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-600" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="mt-5 w-full"
                        variant={p.popular ? "default" : "outline"}
                      >
                        {p.cta ?? "Select Plan"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Advantage strip ─────────────────────────────── */}
      <Reveal>
        <section className="border-y border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-6 px-6 py-8">
            <div className="text-sm font-extrabold uppercase tracking-[0.15em]">The Accio Advantage</div>
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="flex min-w-48 flex-1 items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <a.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{a.title}</span>
                  <span className="block text-xs text-muted-foreground">{a.body}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Mall aisles ─────────────────────────────────── */}
      <section id="aisles" className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-accio-gold">
            Explore the Mall Aisles
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {AISLES.map((a, i) => (
            <Reveal key={a.name} delay={i * 80}>
              <Link
                to="/mall"
                className={`group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${a.tint} bg-accio-ink p-5 text-white transition-transform hover:-translate-y-1`}
              >
                <a.icon className="absolute right-4 top-4 h-7 w-7 opacity-50 transition-opacity group-hover:opacity-90" />
                <div className="text-lg font-bold">{a.name}</div>
                <div className="text-xs text-white/70">{a.body}</div>
                <ArrowRight className="mt-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-accio-purple-deep via-accio-purple to-accio-purple-light px-10 py-12 text-white md:flex-row">
            <div>
              <div className="font-display text-2xl font-bold md:text-3xl">
                Your customers are here. Your storefront should be too.
              </div>
              <div className="mt-2 text-white/75">
                Join Accio and grow with the power of AI and human expertise.
              </div>
            </div>
            <div className="flex shrink-0 gap-4">
              <Button size="lg" variant="gold">
                Apply for a Storefront <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Headset /> Talk to an Expert
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-accio-ink text-white/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="font-display text-2xl font-bold text-white">
              Accio<span className="text-accio-gold">✦</span>
            </div>
            <p className="mt-3 max-w-60 text-sm">
              A premium virtual mall and digital leasing platform powered by AI and human expertise.
            </p>
          </div>
          {[
            { h: "Marketplace", links: ["All Categories", "Top Storefronts", "New Arrivals", "Deals"] },
            { h: "Solutions", links: ["For Sellers", "For Buyers", "For Channel Partners", "For Enterprises"] },
            { h: "Company", links: ["About Us", "Careers", "Press", "Partners"] },
            { h: "Resources", links: ["Help Center", "Guides", "Blog", "Events"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="mb-3 text-sm font-bold text-white">{col.h}</div>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition-colors hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs">
          © 2026 Accio. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </footer>

      <Concierge surface="landing" />
    </div>
  );
}
