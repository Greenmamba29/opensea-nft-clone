// Shared mock domain data for Accio Mall OS functions.
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

export interface Storefront {
  id: string;
  merchant: string;
  storeType: "Retail Store" | "Brand Store" | "B2B Store" | "Pop-Up";
  category: string;
  tier: "rent" | "lease" | "own";
  status: "new" | "under_review" | "documents_pending" | "shortlisted" | "active";
  assignedAgent: string;
  monthlyLease: number;
}

export interface Quote {
  id: string;
  buyer: string;
  company: string;
  items: { sku: string; name: string; qty: number; unitPrice: number }[];
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

export const STOREFRONTS: Storefront[] = [
  { id: "sf_01", merchant: "Brewed Awakenings", storeType: "Retail Store", category: "Food & Beverage", tier: "lease", status: "under_review", assignedAgent: "Ava Reynolds", monthlyLease: 359 },
  { id: "sf_02", merchant: "Stationery House", storeType: "Retail Store", category: "Office Supplies", tier: "rent", status: "documents_pending", assignedAgent: "Liam Chen", monthlyLease: 179 },
  { id: "sf_03", merchant: "Giftease Corp", storeType: "Brand Store", category: "Corporate Gifting", tier: "own", status: "shortlisted", assignedAgent: "Maya Kapoor", monthlyLease: 899 },
  { id: "sf_04", merchant: "Artisan Lane", storeType: "Retail Store", category: "Local Makers", tier: "rent", status: "new", assignedAgent: "Noah Williams", monthlyLease: 59 },
  { id: "sf_05", merchant: "SupplyHub Co.", storeType: "B2B Store", category: "B2B Sourcing", tier: "lease", status: "under_review", assignedAgent: "Ava Reynolds", monthlyLease: 359 },
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
