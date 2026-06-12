// Directions Mode route engine — deterministic, client-side.
// Turns a plain-language intent ("200 branded boxes for my business") into a
// MallRoute: aisle → storefronts → compare → quote → cart. No network calls.

import { bnyByAisle } from "./bnyRoster";
import { AISLES, MALL_STOREFRONTS, type Aisle } from "./mallData";

/* ── Types ─────────────────────────────────────────────────────────── */

export type RouteStopKind = "aisle" | "storefront" | "compare" | "quote" | "cart";

export interface RouteStop {
  id: string;
  kind: RouteStopKind;
  title: string;
  subtitle: string;
  /** react-router path for "Go to stop" */
  link: string;
  done: boolean;
}

export interface MallRoute {
  id: string;
  intent: string;
  aisleSlug: string;
  stops: RouteStop[];
  createdAt: string; // ISO timestamp, set once when the route is generated
}

export interface RouteOptions {
  /** Force a specific aisle slug instead of keyword matching. */
  aisle?: string;
  /** Quantity range label, e.g. "100–1,000" — flavors the quote stop. */
  quantity?: string;
}

/* ── Intent → aisle keyword map ────────────────────────────────────── */

const AISLE_KEYWORDS: Array<{ slug: string; keywords: string[] }> = [
  { slug: "packaging", keywords: ["box", "boxes", "packaging", "mailer", "label", "labels", "kraft", "pouch", "wrap", "carton"] },
  { slug: "fabrication", keywords: ["cnc", "metal", "weld", "fabricat", "machin", "laser", "bracket", "steel", "aluminum", "prototype", "wood"] },
  { slug: "electronics", keywords: ["pcb", "sensor", "circuit", "electronic", "cable", "led", "component", "assembly", "repair"] },
  { slug: "apparel-merch", keywords: ["shirt", "merch", "embroid", "apparel", "tote", "hoodie", "crewneck", "swag", "branded gift", "print on", "screen print"] },
  { slug: "food-beverage", keywords: ["coffee", "food", "catering", "cater", "pastry", "bakery", "snack", "beverage", "lunch", "roaster"] },
  { slug: "office-services", keywords: ["office", "printing", "print shop", "cleaning", "paper", "supplies", "stationery", "back-office"] },
  { slug: "logistics", keywords: ["shipping", "courier", "freight", "delivery", "warehouse", "logistics", "pallet", "same-day"] },
];

const DEFAULT_AISLE_SLUG = "local-brands";

/** Match a plain-language intent to the best aisle. Deterministic: the aisle
 *  with the most keyword hits wins; ties resolve in AISLE_KEYWORDS order. */
export function matchAisle(intent: string): Aisle {
  const text = intent.toLowerCase();
  let best: { slug: string; hits: number } = { slug: DEFAULT_AISLE_SLUG, hits: 0 };
  for (const entry of AISLE_KEYWORDS) {
    const hits = entry.keywords.reduce((n, kw) => (text.includes(kw) ? n + 1 : n), 0);
    if (hits > best.hits) best = { slug: entry.slug, hits };
  }
  const aisle = AISLES.find((a) => a.slug === best.slug);
  // AISLES always contains every slug above; fall back defensively anyway.
  return aisle ?? AISLES[AISLES.length - 1];
}

/* ── Route generation ──────────────────────────────────────────────── */

/** Build a guided route through the mall for the given intent.
 *  Fine to call from event handlers (uses Date.now for ids). */
export function generateRoute(intent: string, opts?: RouteOptions): MallRoute {
  const aisle = (opts?.aisle && AISLES.find((a) => a.slug === opts.aisle)) || matchAisle(intent);
  const storefronts = MALL_STOREFRONTS.filter((s) => s.aisle === aisle.slug).slice(0, 3);
  // Unclaimed BNY tenant profiles in this aisle — browse-only stops (consent
  // gate, PLAN-50-STORES.md): no quotes or carts route through them.
  const bnyTenants = bnyByAisle(aisle.slug).slice(0, 2);
  const routeId = `route_${Date.now().toString(36)}`;

  const stops: RouteStop[] = [
    {
      id: `${routeId}_aisle`,
      kind: "aisle",
      title: `Start at the ${aisle.name} Aisle`,
      subtitle: aisle.description,
      link: `/mall/aisles/${aisle.slug}`,
      done: false,
    },
    ...storefronts.map((s, i) => ({
      id: `${routeId}_store_${i}`,
      kind: "storefront" as const,
      title: `Visit ${s.merchant}`,
      subtitle: s.tagline,
      link: "/mall/collection",
      done: false,
    })),
    ...bnyTenants.map((t, i) => ({
      id: `${routeId}_bny_${i}`,
      kind: "storefront" as const,
      title: `Browse ${t.name}`,
      subtitle: "Navy Yard tenant — unclaimed profile, browse only.",
      link: `/mall/bny/${t.slug}`,
      done: false,
    })),
    {
      id: `${routeId}_compare`,
      kind: "compare",
      title: "Compare your picks",
      subtitle: "Prices, minimums, and lead times side by side.",
      link: `/mall/products?aisle=${aisle.slug}`,
      done: false,
    },
    {
      id: `${routeId}_quote`,
      kind: "quote",
      title: "Request a quote",
      subtitle: opts?.quantity
        ? `Tell the storefronts what you need — around ${opts.quantity} units.`
        : "Tell the storefronts what you need. They price it for you.",
      link: `/mall/quotes?aisle=${aisle.slug}`,
      done: false,
    },
    {
      id: `${routeId}_cart`,
      kind: "cart",
      title: "Cart & delivery",
      subtitle: "Place the order. GrahmOS tracks it to your door.",
      link: "/mall/orders",
      done: false,
    },
  ];

  return {
    id: routeId,
    intent: intent.trim(),
    aisleSlug: aisle.slug,
    stops,
    createdAt: new Date().toISOString(),
  };
}

/* ── Helpers ───────────────────────────────────────────────────────── */

/** First stop that isn't done — the buyer's current position on the route. */
export function currentStop(route: MallRoute): RouteStop | undefined {
  return route.stops.find((s) => !s.done);
}

export function routeProgress(route: MallRoute): { done: number; total: number } {
  return {
    done: route.stops.filter((s) => s.done).length,
    total: route.stops.length,
  };
}
