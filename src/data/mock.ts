export const collections = [
  { name: "MRODirect", floor: "$2.4K AOV", change: "+15%", volume: "$48M", items: 125000, owners: 4500, image: "🔧", verified: true },
  { name: "ChemOS", floor: "$8.1K AOV", change: "+8.2%", volume: "$85M", items: 45000, owners: 1200, image: "🧪", verified: true },
  { name: "MedSupplyOS", floor: "$5.5K AOV", change: "+12%", volume: "$62M", items: 85000, owners: 3200, image: "🏥", verified: true },
  { name: "LabSource", floor: "$3.2K AOV", change: "+5.5%", volume: "$51M", items: 92000, owners: 2800, image: "🔬", verified: true },
  { name: "FoodOps", floor: "$12.4K AOV", change: "+2.1%", volume: "$74M", items: 35000, owners: 850, image: "🍎", verified: true },
  { name: "CareOps", floor: "$4.8K AOV", change: "+9.4%", volume: "$38M", items: 25000, owners: 1500, image: "👵", verified: true },
  { name: "GovSource", floor: "$25K AOV", change: "+1.6%", volume: "$92M", items: 150000, owners: 500, image: "⚖️", verified: true },
  { name: "LithiumBuy", floor: "$150K AOV", change: "+24%", volume: "$115M", items: 1200, owners: 85, image: "🔋", verified: true },
  { name: "PrintHub", floor: "$1.2K AOV", change: "-2.1%", volume: "$22M", items: 55000, owners: 6400, image: "🖨️", verified: true },
  { name: "ConstruxOS", floor: "$45K AOV", change: "+6.7%", volume: "$128M", items: 18000, owners: 1200, image: "🏗️", verified: true },
];

export const featuredCollections = [
  { name: "Lithium Supply Chain 2026", floor: "$150K", change: "+24%", image: "🔋", verified: true },
  { name: "Global Chemical Arbitrage", floor: "$8.1K", change: "+8.2%", image: "🧪", verified: true },
  { name: "Federal MRO Contracts", floor: "$2.4K", change: "+15%", image: "🔧", verified: true },
  { name: "Pharma Bulk Sourcing", floor: "$120K", change: "+4.5%", image: "💊", verified: true },
];

export const trendingTokens = [
  { name: "Lithium Carbonate", symbol: "Li2CO3", price: "$14,200/t", change1h: "-0.5%", change1d: "+1.2%", change30d: "+8.2%", volume: "$450M", mcap: "N/A" },
  { name: "Sulfuric Acid", symbol: "H2SO4", price: "$125/t", change1h: "+0.2%", change1d: "+0.5%", change30d: "-2.1%", volume: "$850M", mcap: "N/A" },
  { name: "Nitrile Gloves (Bulk)", symbol: "GLV", price: "$0.04/unit", change1h: "—", change1d: "-1.2%", change30d: "-15.5%", volume: "$2.1B", mcap: "N/A" },
  { name: "Industrial Steel", symbol: "STEEL", price: "$780/t", change1h: "-0.1%", change1d: "-0.4%", change30d: "+3.2%", volume: "$12B", mcap: "N/A" },
];

export const nftItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Industrial Pump Model #${1000 + i}`,
  price: `$${(2.5 + Math.random() * 5).toFixed(1)}K`,
  lastSale: `$${(2.0 + Math.random() * 3).toFixed(1)}K`,
  rarity: Math.floor(Math.random() * 500) + 1,
  image: ["⚙️","🛠️","📦","🚜","🏭","🔌","🚿","🔧"][i % 8],
}));

export const traits = [
  { category: "Certification", count: 8 },
  { category: "Lead Time", count: 5 },
  { category: "Origin", count: 12 },
  { category: "Compliance", count: 15 },
  { category: "Material", count: 22 },
];

export const traitItems = [
  { category: "CERT", name: "ISO 9001", rarity: "85%", floor: "N/A", topOffer: "N/A" },
  { category: "LEAD", name: "< 48 Hours", rarity: "12%", floor: "N/A", topOffer: "N/A" },
  { category: "ORIGIN", name: "United States", rarity: "45%", floor: "N/A", topOffer: "N/A" },
  { category: "COMPLIANCE", name: "OSHA Approved", rarity: "92%", floor: "N/A", topOffer: "N/A" },
];

export const chains = [
  { name: "North America", icon: "🇺🇸", color: "#3c5a99" },
  { name: "Europe", icon: "🇪🇺", color: "#003399" },
  { name: "APAC", icon: "🌏", color: "#ffcc00" },
  { name: "Global Hub", icon: "🌐", color: "#2081e2" },
];

export const categories = ["All", "MRO", "Chemicals", "Medical", "Logistics", "Energy", "Gov"];

export const sidebarLinks = [
  { icon: "◎", label: "Market Hub", href: "/" },
  { icon: "⊞", label: "Marketplaces", href: "/rankings" },
  { icon: "◐", label: "Price Index", href: "/tokens" },
  { icon: "≡", label: "Order Activity", href: "/activity" },
  { icon: "↓", label: "New Drops", href: "/drops" },
  { icon: "⚡", label: "Rewards", href: "/rewards" },
  { icon: "👤", label: "Buyer Dash", href: "/profile" },
  { icon: "📋", label: "Supplier Portal", href: "/studio" },
  { icon: "⚙", label: "Settings", href: "/settings" },
];

export const walletOptions = [
  { name: "Corporate Login", icon: "🏢" },
  { name: "SSO / Okta", icon: "🔐" },
  { name: "Supplier Portal", icon: "🚚" },
];
