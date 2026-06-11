// Shared mock domain data for GrahmOS Mall OS functions.
// In production these reads/writes route to Neon Postgres (db/schema.sql) and
// mirror to Airtable for staff workflows. Centralized here so the API surface
// is real and typed while the persistence layer is wired up.

// Display-ready shape — the single source of truth the Mall OS dashboard renders.
// `iconKey`/`color` are presentation hints the client maps to lucide icons / fills.
export interface MallOverview {
  kpis: { key: string; label: string; value: string; delta: string }[];
  occupancy: {
    totalSlots: number;
    occupied: number;
    vacant: number;
    pending: number;
    rate: number;
    slices: { name: string; value: number; color: string }[];
  };
  trends: { m: string; revenue: number; gmv: number }[];
  categories: { icon: string; name: string; gmv: string; share: string; delta: string }[];
  placements: { key: string; name: string; note: string; count: string }[];
  agentQueue: { key: string; name: string; note: string; count: number }[];
  agentQueueTotal: number;
  zones: { name: string; slots: number; color: string }[];
}

// An Aisle is the mall's category unit (the BNY vertical). Mirrored client-side
// in src/lib/mallData.ts so /mall pages render without API calls (demo-first).
export interface Aisle {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Storefront {
  id: string;
  merchant: string;
  storeType: "Retail Store" | "Brand Store" | "B2B Store" | "Pop-Up";
  category: string;
  aisle: string; // Aisle slug
  tier: "rent" | "lease" | "own";
  status: "new" | "under_review" | "documents_pending" | "shortlisted" | "active";
  assignedAgent: string;
  monthlyLease: number;
  /** Commerce engine behind this storefront. Every mall unit is a Shopify
   *  store provisioned by GrahmOS; 'native' marks legacy/demo-only units. */
  platform: "shopify" | "native";
  /** myshopify.com domain for platform === 'shopify' storefronts. */
  shopifyDomain?: string;
}

export interface Product {
  id: string;
  name: string;
  storefrontId: string;
  aisle: string; // Aisle slug
  price: number;
  unit: string;
  minOrder: number;
}

export interface Order {
  id: string;
  buyer: string;
  storefrontId: string;
  summary: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Quote {
  id: string;
  buyer: string;
  company: string;
  items: { sku: string; name: string; qty: number; unitPrice: number }[];
  /** Free-form RFQ fields from the mall Quotes page (Alibaba-style request). */
  request?: {
    description: string;
    quantity: number;
    unit: string;
    aisle?: string;
    deadline?: string;
    notes?: string;
  };
  status:
    | "draft"
    | "submitted"
    | "under_agent_review"
    | "priced"
    | "sent_to_buyer"
    | "accepted"
    | "rejected"
    | "converted";
  total: number;
  createdAt: string;
}

export const MALL_OVERVIEW: MallOverview = {
  kpis: [
    { key: "storefronts", label: "Active Storefronts", value: "428", delta: "↑ 12 vs last month" },
    { key: "occupancy", label: "Occupancy Rate", value: "87.3%", delta: "↑ 4.6pp vs last month" },
    { key: "lease", label: "Monthly Lease Revenue", value: "$1.28M", delta: "↑ 18.6% vs last month" },
    { key: "gmv", label: "GMV (This Month)", value: "$24.63M", delta: "↑ 21.3% vs last month" },
    { key: "quotes", label: "Quote Requests", value: "156", delta: "↑ 9 vs last month" },
    { key: "agent", label: "Agent-Assisted Sales", value: "$6.74M", delta: "↑ 24.7% vs last month" },
  ],
  occupancy: {
    totalSlots: 600,
    occupied: 428,
    vacant: 102,
    pending: 70,
    rate: 87.3,
    slices: [
      { name: "Occupied", value: 428, color: "#5B21B6" },
      { name: "Vacant", value: 102, color: "#D8CFEA" },
      { name: "Pending Applications", value: 70, color: "#E5C963" },
    ],
  },
  trends: [
    { m: "May", revenue: 0.62, gmv: 11.2 },
    { m: "Jun", revenue: 0.68, gmv: 12.8 },
    { m: "Jul", revenue: 0.66, gmv: 14.1 },
    { m: "Aug", revenue: 0.75, gmv: 15.6 },
    { m: "Sep", revenue: 0.82, gmv: 17.2 },
    { m: "Oct", revenue: 0.88, gmv: 16.4 },
    { m: "Nov", revenue: 0.95, gmv: 19.8 },
    { m: "Dec", revenue: 1.05, gmv: 23.5 },
    { m: "Jan", revenue: 0.98, gmv: 20.1 },
    { m: "Feb", revenue: 1.08, gmv: 21.9 },
    { m: "Mar", revenue: 1.16, gmv: 23.2 },
    { m: "Apr", revenue: 1.28, gmv: 24.6 },
  ],
  categories: [
    { icon: "🍱", name: "Food & Beverage", gmv: "$7.82M", share: "31.8%", delta: "↑ 18.2%" },
    { icon: "🖇️", name: "Office Supplies", gmv: "$5.43M", share: "22.1%", delta: "↑ 16.7%" },
    { icon: "🎁", name: "Corporate Gifting", gmv: "$4.21M", share: "17.1%", delta: "↑ 22.9%" },
    { icon: "🧶", name: "Local Makers", gmv: "$3.11M", share: "12.6%", delta: "↑ 19.4%" },
    { icon: "📦", name: "B2B Sourcing", gmv: "$4.06M", share: "16.5%", delta: "↑ 24.1%" },
  ],
  placements: [
    { key: "hero", name: "Homepage Hero Slots", note: "8 available", count: "2 / 10" },
    { key: "aisle", name: "Premium Aisle Placements", note: "12 available", count: "18 / 30" },
    { key: "crown", name: "Premium Row (Top Shelf)", note: "6 available", count: "6 / 12" },
    { key: "popup", name: "Seasonal Pop-Up Spaces", note: "9 available", count: "4 / 15" },
  ],
  agentQueue: [
    { key: "sourcing", name: "Sourcing Requests", note: "14 new requests", count: 14 },
    { key: "quotes", name: "Quote Reviews", note: "8 quotes pending review", count: 8 },
    { key: "onboarding", name: "Merchant Onboarding", note: "5 merchants in progress", count: 5 },
    { key: "cart", name: "Cart Assistance", note: "12 active buyer carts", count: 12 },
  ],
  agentQueueTotal: 39,
  zones: [
    { name: "The Grand Atrium", slots: 72, color: "#C8B6E8" },
    { name: "Food Hall", slots: 86, color: "#F2A687" },
    { name: "Office Emporium", slots: 64, color: "#F4D88A" },
    { name: "Gifting Pavilion", slots: 58, color: "#F8E3B0" },
    { name: "Makers' District", slots: 48, color: "#B7D9C9" },
    { name: "B2B Exchange", slots: 72, color: "#A8C8E8" },
  ],
};

// The eight aisles of the BNY Digital Mall. Keep in sync with src/lib/mallData.ts.
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

export const STOREFRONTS: Storefront[] = [
  { id: "sf_01", merchant: "Brewed Awakenings", storeType: "Retail Store", category: "Food & Beverage", aisle: "food-beverage", tier: "lease", status: "under_review", assignedAgent: "Ava Reynolds", monthlyLease: 359, platform: "shopify", shopifyDomain: "brewed-awakenings-bny.myshopify.com" },
  { id: "sf_02", merchant: "Stationery House", storeType: "Retail Store", category: "Office Supplies", aisle: "office-services", tier: "rent", status: "documents_pending", assignedAgent: "Liam Chen", monthlyLease: 179, platform: "native" },
  { id: "sf_03", merchant: "Giftease Corp", storeType: "Brand Store", category: "Corporate Gifting", aisle: "apparel-merch", tier: "own", status: "shortlisted", assignedAgent: "Maya Kapoor", monthlyLease: 899, platform: "shopify", shopifyDomain: "giftease-corp.myshopify.com" },
  { id: "sf_04", merchant: "Artisan Lane", storeType: "Retail Store", category: "Local Makers", aisle: "local-brands", tier: "rent", status: "new", assignedAgent: "Noah Williams", monthlyLease: 59, platform: "native" },
  { id: "sf_05", merchant: "SupplyHub Co.", storeType: "B2B Store", category: "B2B Sourcing", aisle: "packaging", tier: "lease", status: "under_review", assignedAgent: "Ava Reynolds", monthlyLease: 359, platform: "shopify", shopifyDomain: "supplyhub-bny.myshopify.com" },
  { id: "sf_06", merchant: "BNY Metalworks", storeType: "B2B Store", category: "Fabrication", aisle: "fabrication", tier: "lease", status: "active", assignedAgent: "Liam Chen", monthlyLease: 459, platform: "native" },
  { id: "sf_07", merchant: "Circuit & Co.", storeType: "Retail Store", category: "Electronics", aisle: "electronics", tier: "rent", status: "active", assignedAgent: "Maya Kapoor", monthlyLease: 219, platform: "shopify", shopifyDomain: "circuit-and-co-bny.myshopify.com" },
  { id: "sf_08", merchant: "Harbor Lines", storeType: "B2B Store", category: "Logistics & Delivery", aisle: "logistics", tier: "lease", status: "active", assignedAgent: "Noah Williams", monthlyLease: 389, platform: "native" },
];

export const PRODUCTS: Product[] = [
  { id: "p_01", name: "Kraft Shipping Box 12×9×4", storefrontId: "sf_05", aisle: "packaging", price: 0.42, unit: "per box", minOrder: 250 },
  { id: "p_02", name: "Custom-Print Mailer (Matte)", storefrontId: "sf_05", aisle: "packaging", price: 1.15, unit: "per mailer", minOrder: 500 },
  { id: "p_03", name: "Laser-Cut Steel Bracket", storefrontId: "sf_06", aisle: "fabrication", price: 4.8, unit: "per piece", minOrder: 100 },
  { id: "p_04", name: "CNC Aluminum Faceplate", storefrontId: "sf_06", aisle: "fabrication", price: 35, unit: "per piece", minOrder: 25 },
  { id: "p_05", name: "USB-C Cable Assembly 1m", storefrontId: "sf_07", aisle: "electronics", price: 3.1, unit: "per unit", minOrder: 100 },
  { id: "p_06", name: "LED Panel Module 24V", storefrontId: "sf_07", aisle: "electronics", price: 18.5, unit: "per module", minOrder: 20 },
  { id: "p_07", name: "Embroidered Crewneck", storefrontId: "sf_03", aisle: "apparel-merch", price: 28, unit: "per piece", minOrder: 24 },
  { id: "p_08", name: "Branded Tote (Canvas)", storefrontId: "sf_03", aisle: "apparel-merch", price: 9.4, unit: "per tote", minOrder: 50 },
  { id: "p_09", name: "Cold Brew Keg 5L", storefrontId: "sf_01", aisle: "food-beverage", price: 58, unit: "per keg", minOrder: 2 },
  { id: "p_10", name: "Office Pastry Box (24ct)", storefrontId: "sf_01", aisle: "food-beverage", price: 46, unit: "per box", minOrder: 1 },
  { id: "p_11", name: "Recycled Copy Paper (Case)", storefrontId: "sf_02", aisle: "office-services", price: 38, unit: "per case", minOrder: 5 },
  { id: "p_12", name: "Same-Day Courier (Zone 1)", storefrontId: "sf_08", aisle: "logistics", price: 12, unit: "per delivery", minOrder: 1 },
  { id: "p_13", name: "Pallet Storage (Monthly)", storefrontId: "sf_08", aisle: "logistics", price: 24, unit: "per pallet", minOrder: 4 },
  { id: "p_14", name: "Hand-Poured Candle Trio", storefrontId: "sf_04", aisle: "local-brands", price: 32, unit: "per set", minOrder: 6 },
];

export const ORDERS: Order[] = [
  { id: "ord_2107", buyer: "Daniel Osei", storefrontId: "sf_05", summary: "Kraft Shipping Box 12×9×4 × 500", total: 210, status: "shipped", createdAt: "2026-06-08T10:05:00Z" },
  { id: "ord_2101", buyer: "Daniel Osei", storefrontId: "sf_01", summary: "Cold Brew Keg 5L × 4", total: 232, status: "delivered", createdAt: "2026-06-05T16:40:00Z" },
  { id: "ord_2096", buyer: "Priya Raman", storefrontId: "sf_03", summary: "Embroidered Crewneck × 48", total: 1344, status: "processing", createdAt: "2026-06-04T09:12:00Z" },
  { id: "ord_2090", buyer: "Daniel Osei", storefrontId: "sf_07", summary: "USB-C Cable Assembly × 200", total: 620, status: "delivered", createdAt: "2026-05-29T13:25:00Z" },
  { id: "ord_2083", buyer: "Priya Raman", storefrontId: "sf_08", summary: "Same-Day Courier (Zone 1) × 12", total: 144, status: "delivered", createdAt: "2026-05-26T11:00:00Z" },
  { id: "ord_2074", buyer: "Daniel Osei", storefrontId: "sf_06", summary: "Laser-Cut Steel Bracket × 250", total: 1200, status: "cancelled", createdAt: "2026-05-19T15:30:00Z" },
];

export const QUOTES: Quote[] = [
  {
    id: "q_1042",
    buyer: "Daniel Osei",
    company: "Northwind Logistics",
    items: [
      { sku: "IT-500", name: "Insulated Tumbler 500ml", qty: 500, unitPrice: 3.45 },
      { sku: "GP-220", name: "Gift Pouch (kraft)", qty: 500, unitPrice: 0.8 },
    ],
    status: "under_agent_review",
    total: 2125,
    createdAt: "2026-06-08T14:20:00Z",
  },
];
