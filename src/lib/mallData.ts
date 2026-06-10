// Client-side demo data for the GrahmOS Virtual Mall shell.
// Mirrors the typed shapes in netlify/functions/_data.ts so every /mall page
// renders meaningfully without auth or API calls (demo-mode-first).

/* ── Aisles (the BNY vertical) ─────────────────────────────────────── */

export interface Aisle {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const AISLES: Aisle[] = [
  { id: "a_01", slug: "packaging", name: "Packaging", description: "Boxes, mailers, labels, and custom packaging from local converters.", icon: "📦", color: "#C9A227" },
  { id: "a_02", slug: "fabrication", name: "Fabrication", description: "Metal, wood, and CNC shops for custom parts and short runs.", icon: "🔩", color: "#7C3AED" },
  { id: "a_03", slug: "electronics", name: "Electronics", description: "Components, assemblies, and repair from neighborhood techs.", icon: "🔌", color: "#2DA8D8" },
  { id: "a_04", slug: "apparel-merch", name: "Apparel & Merch", description: "Screen printing, embroidery, and branded merch in small batches.", icon: "👕", color: "#E06B8B" },
  { id: "a_05", slug: "food-beverage", name: "Food & Beverage", description: "Roasters, bakers, and caterers for offices and events.", icon: "🍱", color: "#F2A687" },
  { id: "a_06", slug: "office-services", name: "Office & Business Services", description: "Supplies, printing, and back-office services for teams.", icon: "🖇️", color: "#E5C963" },
  { id: "a_07", slug: "logistics", name: "Logistics & Delivery", description: "Same-day courier, freight, and warehousing partners.", icon: "🚚", color: "#34c759" },
  { id: "a_08", slug: "local-brands", name: "Local Brands", description: "Makers and brands born in the neighborhood.", icon: "🧶", color: "#B7D9C9" },
];

export function aisleBySlug(slug?: string): Aisle | undefined {
  return AISLES.find((a) => a.slug === slug);
}

/* ── Storefronts ───────────────────────────────────────────────────── */

export interface MallStorefront {
  id: string;
  merchant: string;
  storeType: "Retail Store" | "Brand Store" | "B2B Store" | "Pop-Up";
  aisle: string; // Aisle slug
  tier: "rent" | "lease" | "own";
  tagline: string;
  icon: string;
  monthlySales: string;
  customers: number;
  fromPrice: string;
}

export const MALL_STOREFRONTS: MallStorefront[] = [
  { id: "sf_01", merchant: "Brewed Awakenings", storeType: "Retail Store", aisle: "food-beverage", tier: "lease", tagline: "Small-batch coffee for offices and events.", icon: "☕", monthlySales: "$42K", customers: 1240, fromPrice: "$14" },
  { id: "sf_02", merchant: "Stationery House", storeType: "Retail Store", aisle: "office-services", tier: "rent", tagline: "Paper, print, and desk supplies delivered next day.", icon: "🖇️", monthlySales: "$28K", customers: 860, fromPrice: "$6" },
  { id: "sf_03", merchant: "Giftease Corp", storeType: "Brand Store", aisle: "apparel-merch", tier: "own", tagline: "Corporate gifting and branded merch, white-glove.", icon: "🎁", monthlySales: "$96K", customers: 410, fromPrice: "$22" },
  { id: "sf_04", merchant: "Artisan Lane", storeType: "Retail Store", aisle: "local-brands", tier: "rent", tagline: "A rotating shelf of neighborhood makers.", icon: "🧶", monthlySales: "$12K", customers: 530, fromPrice: "$18" },
  { id: "sf_05", merchant: "SupplyHub Co.", storeType: "B2B Store", aisle: "packaging", tier: "lease", tagline: "Boxes, mailers, and custom packaging at volume.", icon: "📦", monthlySales: "$117K", customers: 290, fromPrice: "$0.42" },
  { id: "sf_06", merchant: "BNY Metalworks", storeType: "B2B Store", aisle: "fabrication", tier: "lease", tagline: "CNC, laser cutting, and short-run fabrication.", icon: "🔩", monthlySales: "$84K", customers: 150, fromPrice: "$35" },
  { id: "sf_07", merchant: "Circuit & Co.", storeType: "Retail Store", aisle: "electronics", tier: "rent", tagline: "Components, assemblies, and same-week repair.", icon: "🔌", monthlySales: "$51K", customers: 720, fromPrice: "$3.10" },
  { id: "sf_08", merchant: "Harbor Lines", storeType: "B2B Store", aisle: "logistics", tier: "lease", tagline: "Same-day courier and borough-wide freight.", icon: "🚚", monthlySales: "$63K", customers: 340, fromPrice: "$12" },
];

export function storefrontsByAisle(slug: string): MallStorefront[] {
  return MALL_STOREFRONTS.filter((s) => s.aisle === slug);
}

/* ── Products ──────────────────────────────────────────────────────── */

export interface MallProduct {
  id: string;
  name: string;
  storefrontId: string;
  storefront: string;
  aisle: string; // Aisle slug
  price: number;
  unit: string;
  minOrder: number;
  gradient: string; // CSS gradient placeholder image
  icon: string;
}

export const MALL_PRODUCTS: MallProduct[] = [
  { id: "p_01", name: "Kraft Shipping Box 12×9×4", storefrontId: "sf_05", storefront: "SupplyHub Co.", aisle: "packaging", price: 0.42, unit: "per box", minOrder: 250, gradient: "linear-gradient(135deg, #C9A227, #8a6d14)", icon: "📦" },
  { id: "p_02", name: "Custom-Print Mailer (Matte)", storefrontId: "sf_05", storefront: "SupplyHub Co.", aisle: "packaging", price: 1.15, unit: "per mailer", minOrder: 500, gradient: "linear-gradient(135deg, #E5C963, #C9A227)", icon: "✉️" },
  { id: "p_03", name: "Laser-Cut Steel Bracket", storefrontId: "sf_06", storefront: "BNY Metalworks", aisle: "fabrication", price: 4.8, unit: "per piece", minOrder: 100, gradient: "linear-gradient(135deg, #7C3AED, #3B1680)", icon: "🔩" },
  { id: "p_04", name: "CNC Aluminum Faceplate", storefrontId: "sf_06", storefront: "BNY Metalworks", aisle: "fabrication", price: 35, unit: "per piece", minOrder: 25, gradient: "linear-gradient(135deg, #9F7AEA, #5B21B6)", icon: "⚙️" },
  { id: "p_05", name: "USB-C Cable Assembly 1m", storefrontId: "sf_07", storefront: "Circuit & Co.", aisle: "electronics", price: 3.1, unit: "per unit", minOrder: 100, gradient: "linear-gradient(135deg, #2DA8D8, #1a5e7a)", icon: "🔌" },
  { id: "p_06", name: "LED Panel Module 24V", storefrontId: "sf_07", storefront: "Circuit & Co.", aisle: "electronics", price: 18.5, unit: "per module", minOrder: 20, gradient: "linear-gradient(135deg, #58c9f0, #2DA8D8)", icon: "💡" },
  { id: "p_07", name: "Embroidered Crewneck", storefrontId: "sf_03", storefront: "Giftease Corp", aisle: "apparel-merch", price: 28, unit: "per piece", minOrder: 24, gradient: "linear-gradient(135deg, #E06B8B, #8f3450)", icon: "👕" },
  { id: "p_08", name: "Branded Tote (Canvas)", storefrontId: "sf_03", storefront: "Giftease Corp", aisle: "apparel-merch", price: 9.4, unit: "per tote", minOrder: 50, gradient: "linear-gradient(135deg, #f098ad, #E06B8B)", icon: "👜" },
  { id: "p_09", name: "Cold Brew Keg 5L", storefrontId: "sf_01", storefront: "Brewed Awakenings", aisle: "food-beverage", price: 58, unit: "per keg", minOrder: 2, gradient: "linear-gradient(135deg, #F2A687, #a85f3c)", icon: "☕" },
  { id: "p_10", name: "Office Pastry Box (24ct)", storefrontId: "sf_01", storefront: "Brewed Awakenings", aisle: "food-beverage", price: 46, unit: "per box", minOrder: 1, gradient: "linear-gradient(135deg, #f7c4a8, #F2A687)", icon: "🥐" },
  { id: "p_11", name: "Recycled Copy Paper (Case)", storefrontId: "sf_02", storefront: "Stationery House", aisle: "office-services", price: 38, unit: "per case", minOrder: 5, gradient: "linear-gradient(135deg, #E5C963, #ab923a)", icon: "🖇️" },
  { id: "p_12", name: "Same-Day Courier (Zone 1)", storefrontId: "sf_08", storefront: "Harbor Lines", aisle: "logistics", price: 12, unit: "per delivery", minOrder: 1, gradient: "linear-gradient(135deg, #34c759, #1d7a36)", icon: "🚚" },
  { id: "p_13", name: "Pallet Storage (Monthly)", storefrontId: "sf_08", storefront: "Harbor Lines", aisle: "logistics", price: 24, unit: "per pallet", minOrder: 4, gradient: "linear-gradient(135deg, #6fdd8d, #34c759)", icon: "🏬" },
  { id: "p_14", name: "Hand-Poured Candle Trio", storefrontId: "sf_04", storefront: "Artisan Lane", aisle: "local-brands", price: 32, unit: "per set", minOrder: 6, gradient: "linear-gradient(135deg, #B7D9C9, #6fa18a)", icon: "🕯️" },
];

/* ── Orders ────────────────────────────────────────────────────────── */

export type MallOrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface MallOrder {
  id: string;
  storefront: string;
  summary: string;
  total: number;
  status: MallOrderStatus;
  date: string; // ISO date
}

export const MALL_ORDERS: MallOrder[] = [
  { id: "ord_2107", storefront: "SupplyHub Co.", summary: "Kraft Shipping Box 12×9×4 × 500", total: 210, status: "shipped", date: "2026-06-08" },
  { id: "ord_2101", storefront: "Brewed Awakenings", summary: "Cold Brew Keg 5L × 4", total: 232, status: "delivered", date: "2026-06-05" },
  { id: "ord_2096", storefront: "Giftease Corp", summary: "Embroidered Crewneck × 48", total: 1344, status: "processing", date: "2026-06-04" },
  { id: "ord_2090", storefront: "Circuit & Co.", summary: "USB-C Cable Assembly × 200", total: 620, status: "delivered", date: "2026-05-29" },
  { id: "ord_2083", storefront: "Harbor Lines", summary: "Same-Day Courier (Zone 1) × 12", total: 144, status: "delivered", date: "2026-05-26" },
  { id: "ord_2074", storefront: "BNY Metalworks", summary: "Laser-Cut Steel Bracket × 250", total: 1200, status: "cancelled", date: "2026-05-19" },
];

export const ORDER_STATUS_STYLES: Record<MallOrderStatus, string> = {
  processing: "bg-[var(--os-gold)]/15 text-[var(--os-gold)] border-[var(--os-gold)]/30",
  shipped: "bg-[var(--os-blue)]/15 text-[var(--os-blue)] border-[var(--os-blue)]/30",
  delivered: "bg-[var(--os-green)]/15 text-[var(--os-green)] border-[var(--os-green)]/30",
  cancelled: "bg-[var(--os-red)]/15 text-[var(--os-red)] border-[var(--os-red)]/30",
};

/* ── Quote requests (sample list for demo mode) ────────────────────── */

export type QuoteStatus =
  | "draft"
  | "submitted"
  | "under_agent_review"
  | "priced"
  | "sent_to_buyer"
  | "accepted"
  | "rejected"
  | "converted";

export interface SampleQuote {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  aisle: string;
  status: QuoteStatus;
  total?: number;
  createdAt: string;
}

export const SAMPLE_QUOTES: SampleQuote[] = [
  { id: "q_1042", description: "Insulated tumblers + kraft gift pouches", quantity: 500, unit: "sets", aisle: "apparel-merch", status: "under_agent_review", total: 2125, createdAt: "2026-06-08" },
  { id: "q_1037", description: "Custom-print mailers, 2-color logo", quantity: 1000, unit: "mailers", aisle: "packaging", status: "priced", total: 1080, createdAt: "2026-06-03" },
  { id: "q_1029", description: "Weekly office pastry + coffee service", quantity: 12, unit: "weeks", aisle: "food-beverage", status: "accepted", total: 1248, createdAt: "2026-05-27" },
];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_agent_review: "Agent Review",
  priced: "Priced",
  sent_to_buyer: "Sent to You",
  accepted: "Accepted",
  rejected: "Declined",
  converted: "Converted to Order",
};

export const QUOTE_STATUS_STYLES: Record<QuoteStatus, string> = {
  draft: "bg-[var(--os-surface-3)] text-[var(--os-text-secondary)] border-[var(--os-border)]",
  submitted: "bg-[var(--os-blue)]/15 text-[var(--os-blue)] border-[var(--os-blue)]/30",
  under_agent_review: "bg-[var(--os-gold)]/15 text-[var(--os-gold)] border-[var(--os-gold)]/30",
  priced: "bg-[var(--os-blue)]/15 text-[var(--os-blue)] border-[var(--os-blue)]/30",
  sent_to_buyer: "bg-[var(--os-gold)]/15 text-[var(--os-gold)] border-[var(--os-gold)]/30",
  accepted: "bg-[var(--os-green)]/15 text-[var(--os-green)] border-[var(--os-green)]/30",
  rejected: "bg-[var(--os-red)]/15 text-[var(--os-red)] border-[var(--os-red)]/30",
  converted: "bg-[var(--os-green)]/15 text-[var(--os-green)] border-[var(--os-green)]/30",
};
