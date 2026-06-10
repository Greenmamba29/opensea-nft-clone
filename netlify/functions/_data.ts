// Shared mock domain data for Accio Mall OS functions.
// In production these reads/writes route to Neon Postgres (db/schema.sql) and
// mirror to Airtable for staff workflows. Centralized here so the API surface
// is real and typed while the persistence layer is wired up.

export interface MallOverview {
  kpis: { label: string; value: string; delta: string }[];
  occupancy: { totalSlots: number; occupied: number; vacant: number; pending: number; rate: number };
  categories: { name: string; gmv: number; sharePct: number; deltaPct: number }[];
  agentQueue: { name: string; count: number }[];
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
    { label: "Active Storefronts", value: "428", delta: "+12" },
    { label: "Occupancy Rate", value: "87.3%", delta: "+4.6pp" },
    { label: "Monthly Lease Revenue", value: "$1.28M", delta: "+18.6%" },
    { label: "GMV (This Month)", value: "$24.63M", delta: "+21.3%" },
    { label: "Quote Requests", value: "156", delta: "+9" },
    { label: "Agent-Assisted Sales", value: "$6.74M", delta: "+24.7%" },
  ],
  occupancy: { totalSlots: 600, occupied: 428, vacant: 102, pending: 70, rate: 87.3 },
  categories: [
    { name: "Food & Beverage", gmv: 7_820_000, sharePct: 31.8, deltaPct: 18.2 },
    { name: "Office Supplies", gmv: 5_430_000, sharePct: 22.1, deltaPct: 16.7 },
    { name: "Corporate Gifting", gmv: 4_210_000, sharePct: 17.1, deltaPct: 22.9 },
    { name: "Local Makers", gmv: 3_110_000, sharePct: 12.6, deltaPct: 19.4 },
    { name: "B2B Sourcing", gmv: 4_060_000, sharePct: 16.5, deltaPct: 24.1 },
  ],
  agentQueue: [
    { name: "Sourcing Requests", count: 14 },
    { name: "Quote Reviews", count: 8 },
    { name: "Merchant Onboarding", count: 5 },
    { name: "Cart Assistance", count: 12 },
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
