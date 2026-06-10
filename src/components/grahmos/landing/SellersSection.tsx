import { useState } from "react";
import { Bot, Check, MapPin, Rocket, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Reveal from "@/components/grahmos/Reveal";

export type Tier = "rent" | "lease" | "own";

const PLAN_TIER: Record<string, Tier> = {
  "Pop-Up Booth": "rent",
  "Starter Storefront": "rent",
  "Premium Storefront": "lease",
  "Anchor Tenant": "own",
};

const STEPS = [
  { icon: Search, title: "Choose Store Type", body: "Pick the right storefront format and aisle for your business." },
  { icon: Bot, title: "Build with the Concierge", body: "Our AI + human team helps you set up, brand, and prepare to go live." },
  { icon: MapPin, title: "Rent, Lease, or Own", body: "Secure your spot in the mall with flexible terms that grow with you." },
  { icon: Rocket, title: "Launch and Grow", body: "Go live, reach buyers walking the aisles, and scale with support." },
];

const PLANS = [
  {
    name: "Pop-Up Booth",
    icon: "🎪",
    monthly: 59,
    tierLabel: "Rent",
    blurb: "Perfect for short-term campaigns.",
    features: ["7 days duration", "Basic branding", "Shared aisle placement"],
    popular: false,
  },
  {
    name: "Starter Storefront",
    icon: "🏪",
    monthly: 179,
    tierLabel: "Rent",
    blurb: "Great for growing businesses.",
    features: ["Custom storefront", "Standard placement", "Leads & chat access"],
    popular: false,
  },
  {
    name: "Premium Storefront",
    icon: "💼",
    monthly: 359,
    tierLabel: "Lease",
    blurb: "High visibility. More buyers.",
    features: ["Premium placement", "Featured listing", "Concierge-assisted setup"],
    popular: true,
  },
  {
    name: "Anchor Tenant",
    icon: "🏛️",
    monthly: 899,
    tierLabel: "Own",
    blurb: "Maximum exposure. Exclusive spaces.",
    features: ["Exclusive placement", "Dedicated concierge", "Custom integrations"],
    popular: false,
    cta: "Talk to Sales",
  },
];

/** "For sellers" — how it works + Rent / Lease / Own storefront plans. */
export default function SellersSection({ onApply }: { onApply: (tier: Tier) => void }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-grahmos-gold">
          For Sellers
        </div>
        <h2 className="mb-10 max-w-2xl font-display text-3xl font-bold tracking-tight">
          Open a storefront where buyers already know what they need.
        </h2>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div>
            <div className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-grahmos-gold">
              How It Works
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
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-grahmos-gold">
                Storefront Plans · Rent / Lease / Own
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
                        ? "relative border-grahmos-gold shadow-[0_18px_50px_-14px_rgba(201,162,39,0.45)]"
                        : "transition-shadow hover:shadow-md"
                    }
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="gold" className="bg-grahmos-gold text-grahmos-ink">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="text-3xl">{p.icon}</div>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          {p.tierLabel}
                        </span>
                      </div>
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
                        onClick={() => onApply(PLAN_TIER[p.name] ?? "rent")}
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
      </div>
    </section>
  );
}
