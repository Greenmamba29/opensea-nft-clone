import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Bot,
  ChartNoAxesCombined,
  ChevronDown,
  ClipboardList,
  Crown,
  FileText,
  Home,
  Landmark,
  LayoutDashboard,
  MapPin,
  Monitor,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Tent,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAccioAuth } from "@/auth/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ── Data ───────────────────────────────────────────────── */

const KPIS = [
  { icon: Store, label: "Active Storefronts", value: "428", delta: "↑ 12 vs last month" },
  { icon: LayoutDashboard, label: "Occupancy Rate", value: "87.3%", delta: "↑ 4.6pp vs last month" },
  { icon: Wallet, label: "Monthly Lease Revenue", value: "$1.28M", delta: "↑ 18.6% vs last month" },
  { icon: ShoppingBag, label: "GMV (This Month)", value: "$24.63M", delta: "↑ 21.3% vs last month" },
  { icon: FileText, label: "Quote Requests", value: "156", delta: "↑ 9 vs last month" },
  { icon: Bot, label: "Agent-Assisted Sales", value: "$6.74M", delta: "↑ 24.7% vs last month" },
];

const OCCUPANCY = [
  { name: "Occupied", value: 428, color: "#5B21B6" },
  { name: "Vacant", value: 102, color: "#D8CFEA" },
  { name: "Pending Applications", value: 70, color: "#E5C963" },
];

const TRENDS = [
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
];

const CATEGORIES = [
  { icon: "🍱", name: "Food & Beverage", gmv: "$7.82M", share: "31.8%", delta: "↑ 18.2%" },
  { icon: "🖇️", name: "Office Supplies", gmv: "$5.43M", share: "22.1%", delta: "↑ 16.7%" },
  { icon: "🎁", name: "Corporate Gifting", gmv: "$4.21M", share: "17.1%", delta: "↑ 22.9%" },
  { icon: "🧶", name: "Local Makers", gmv: "$3.11M", share: "12.6%", delta: "↑ 19.4%" },
  { icon: "📦", name: "B2B Sourcing", gmv: "$4.06M", share: "16.5%", delta: "↑ 24.1%" },
];

const APPLICATIONS = [
  { merchant: "Brewed Awakenings", type: "Retail Store", category: "Food & Beverage", status: "Under Review", statusVariant: "warning" as const, agent: "Ava Reynolds" },
  { merchant: "Stationery House", type: "Retail Store", category: "Office Supplies", status: "Documents Pending", statusVariant: "info" as const, agent: "Liam Chen" },
  { merchant: "Giftease Corp", type: "Brand Store", category: "Corporate Gifting", status: "Shortlisted", statusVariant: "success" as const, agent: "Maya Kapoor" },
  { merchant: "Artisan Lane", type: "Retail Store", category: "Local Makers", status: "New Application", statusVariant: "secondary" as const, agent: "Noah Williams" },
  { merchant: "SupplyHub Co.", type: "B2B Store", category: "B2B Sourcing", status: "Under Review", statusVariant: "warning" as const, agent: "Ava Reynolds" },
];

const PLACEMENTS = [
  { icon: Monitor, name: "Homepage Hero Slots", note: "8 available", count: "2 / 10" },
  { icon: Store, name: "Premium Aisle Placements", note: "12 available", count: "18 / 30" },
  { icon: Crown, name: "Premium Row (Top Shelf)", note: "6 available", count: "6 / 12" },
  { icon: Tent, name: "Seasonal Pop-Up Spaces", note: "9 available", count: "4 / 15" },
];

const AGENT_QUEUE = [
  { icon: Search, name: "Sourcing Requests", note: "14 new requests", count: 14 },
  { icon: FileText, name: "Quote Reviews", note: "8 quotes pending review", count: 8 },
  { icon: Users, name: "Merchant Onboarding", note: "5 merchants in progress", count: 5 },
  { icon: ShoppingCart, name: "Cart Assistance", note: "12 active buyer carts", count: 12 },
];

const ZONES = [
  { name: "The Grand Atrium", slots: 72, color: "#C8B6E8" },
  { name: "Food Hall", slots: 86, color: "#F2A687" },
  { name: "Office Emporium", slots: 64, color: "#F4D88A" },
  { name: "Gifting Pavilion", slots: 58, color: "#F8E3B0" },
  { name: "Makers' District", slots: 48, color: "#B7D9C9" },
  { name: "B2B Exchange", slots: 72, color: "#A8C8E8" },
];

const NAV = [
  { icon: Home, label: "Overview", active: true },
  { icon: Store, label: "Storefronts" },
  { icon: ClipboardList, label: "Lease Inventory" },
  { icon: MapPin, label: "Mall Placement" },
  { icon: ShoppingBag, label: "Merchants" },
  { icon: Users, label: "Buyers" },
  { icon: FileText, label: "Quotes" },
  { icon: Search, label: "Sourcing" },
  { icon: Bot, label: "Agents" },
  { icon: ChartNoAxesCombined, label: "Analytics" },
];

/* ── Page ───────────────────────────────────────────────── */

export default function MallOSPage() {
  const [trendMode, setTrendMode] = useState<"revenue" | "gmv">("revenue");
  const { user, signOut } = useAccioAuth();
  const displayName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : user?.email ?? "Sophia Carter";

  return (
    <div className="accio-theme flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col bg-accio-ink text-white/70 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accio-gold-light to-accio-gold font-display text-lg font-bold text-accio-ink">
            A
          </span>
          <span className="font-display text-base font-bold leading-tight text-white">
            ACCIO<br />
            <span className="text-[10px] font-semibold tracking-[0.25em] text-accio-gold">MALL OS</span>
          </span>
        </Link>
        <div className="px-5 pb-2 pt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">Main</div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((n) => (
            <a
              key={n.label}
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                n.active ? "bg-accio-purple text-white" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </a>
          ))}
          <div className="px-2 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Configuration</div>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white">
            <Settings className="h-4 w-4" /> Settings
          </a>
        </nav>
        <div className="m-4 rounded-xl bg-gradient-to-br from-accio-purple-deep to-accio-purple p-4">
          <Sparkles className="mb-2 h-5 w-5 text-accio-gold" />
          <div className="text-sm font-bold leading-snug text-white">
            White-Glove.<br />
            <span className="text-accio-gold-light">Premium Results.</span><br />
            Powered by Accio.
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-56">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-lg pl-9 pr-12 text-sm"
              placeholder="Search merchants, leases, quotes, agents..."
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="gold" size="sm">
              <Plus /> New Quote
            </Button>
            <button className="relative rounded-lg bg-transparent p-2 hover:bg-secondary">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                12
              </span>
            </button>
            <div className="group relative flex cursor-pointer items-center gap-2.5">
              <Avatar name={displayName} />
              <div className="hidden text-left sm:block">
                <div className="text-sm font-semibold leading-tight">{displayName}</div>
                <div className="text-xs capitalize text-muted-foreground">
                  {(user?.role ?? "operator").replace("_", " ")}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              <div className="invisible absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <Link to="/" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Back to site
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full rounded-md bg-transparent px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-5 p-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {KPIS.map((k) => (
              <Card key={k.label}>
                <CardContent className="p-4">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <k.icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
                  <div className="mt-1 text-2xl font-extrabold tracking-tight">{k.value}</div>
                  <div className="mt-1 text-xs font-semibold text-emerald-600">{k.delta}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid gap-5 xl:grid-cols-[1fr_1.5fr_1.1fr]">
            {/* Occupancy donut */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Virtual Mall Occupancy</CardTitle>
                <div className="text-xs text-muted-foreground">Real-time overview of your mall performance</div>
              </CardHeader>
              <CardContent>
                <div className="relative mx-auto h-44 w-44">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={OCCUPANCY} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={2} strokeWidth={0}>
                        {OCCUPANCY.map((o) => (
                          <Cell key={o.name} fill={o.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold">87.3%</span>
                    <span className="text-xs text-muted-foreground">Occupied</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Storefront Slots</span><b>600</b></div>
                  {OCCUPANCY.map((o) => (
                    <div key={o.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: o.color }} /> {o.name}
                      </span>
                      <b>{o.value}</b>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 pt-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" /> 4.6 percentage points vs last month
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue & GMV trends */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Revenue &amp; GMV Trends</CardTitle>
                <div className="flex rounded-lg border border-border p-0.5 text-xs font-semibold">
                  {(["revenue", "gmv"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTrendMode(mode)}
                      className={`rounded-md px-3 py-1.5 transition-colors ${
                        trendMode === mode ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode === "revenue" ? "Revenue" : "GMV"}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex gap-5 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-accio-purple" /> Lease Revenue (USD)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-accio-gold" /> GMV (USD)</span>
                </div>
                <div className="h-60">
                  <ResponsiveContainer>
                    <LineChart data={TRENDS} margin={{ top: 5, right: 10, bottom: 0, left: -14 }}>
                      <CartesianGrid stroke="#EEE9F6" vertical={false} />
                      <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8B83A0" }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8B83A0" }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "1px solid #E6E0F0", fontSize: 12 }}
                        formatter={(v, name) => [`$${v}M`, name === "revenue" ? "Lease Revenue" : "GMV"]}
                      />
                      <Line
                        type="monotone"
                        dataKey={trendMode === "revenue" ? "revenue" : "gmv"}
                        stroke="#5B21B6"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#5B21B6" }}
                      />
                      <Line
                        type="monotone"
                        dataKey={trendMode === "revenue" ? "gmv" : "revenue"}
                        stroke="#C9A227"
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="1 0"
                        opacity={0.85}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category performance */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Category Performance</CardTitle>
                <span className="text-xs text-muted-foreground">12 Months</span>
              </CardHeader>
              <CardContent>
                <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  <span>Category</span><span>GMV</span><span>% of Total</span><span>vs Last Mo</span>
                </div>
                <div className="space-y-3">
                  {CATEGORIES.map((c) => (
                    <div key={c.name} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span>{c.icon}</span> {c.name}
                      </span>
                      <b>{c.gmv}</b>
                      <span className="text-muted-foreground">{c.share}</span>
                      <span className="font-semibold text-emerald-600">{c.delta}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables row */}
          <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr_1.1fr]">
            {/* Tenant applications */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Recent Tenant Applications</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Store Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {APPLICATIONS.map((a) => (
                      <TableRow key={a.merchant}>
                        <TableCell className="flex items-center gap-2 font-semibold">
                          <Avatar name={a.merchant} className="h-7 w-7" /> {a.merchant}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{a.type}</TableCell>
                        <TableCell className="text-muted-foreground">{a.category}</TableCell>
                        <TableCell><Badge variant={a.statusVariant}>{a.status}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{a.agent}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Placement inventory */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Featured Placement Inventory</CardTitle>
                <Button variant="ghost" size="sm">View Inventory</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {PLACEMENTS.map((p) => (
                  <div key={p.name} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                        <p.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">{p.note}</span>
                      </span>
                    </div>
                    <span className="text-sm font-bold">{p.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Agent queue */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Agent Queue / White-Glove Concierge</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {AGENT_QUEUE.map((q) => (
                  <div key={q.name} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                        <q.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{q.name}</span>
                        <span className="block text-xs text-muted-foreground">{q.note}</span>
                      </span>
                    </div>
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white">
                      {q.count}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-bold">
                  <span>Total Open Tasks</span>
                  <span className="text-xl">39</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zoning map */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mall Zoning &amp; Placement Strategy</CardTitle>
              <div className="text-xs text-muted-foreground">Visualize your mall sections and optimize placement mix</div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 lg:grid-cols-[200px_1fr_260px]">
                {/* Legend */}
                <div className="space-y-2.5">
                  {ZONES.map((z) => (
                    <div key={z.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm" style={{ background: z.color }} /> {z.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{z.slots} slots</span>
                    </div>
                  ))}
                </div>
                {/* Floor plan */}
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 560 240" className="w-full max-w-2xl">
                    <text x="280" y="12" textAnchor="middle" fontSize="8" fill="#8B83A0" letterSpacing="2">NORTH ENTRANCE</text>
                    <g stroke="#fff" strokeWidth="3">
                      <path d="M60 40 Q60 25 90 25 H230 V100 H60 Z" fill={ZONES[0].color} rx="10" />
                      <path d="M330 25 H470 Q500 25 500 40 V100 H330 Z" fill={ZONES[5].color} />
                      <path d="M60 140 V200 Q60 215 90 215 H230 V140 Z" fill={ZONES[1].color} />
                      <path d="M330 140 H500 V200 Q500 215 470 215 H330 Z" fill={ZONES[2].color} />
                      <rect x="238" y="25" width="84" height="75" fill={ZONES[3].color} />
                      <rect x="238" y="140" width="84" height="75" fill={ZONES[4].color} />
                    </g>
                    <circle cx="280" cy="120" r="34" fill="#fff" stroke="#E6E0F0" />
                    <circle cx="280" cy="120" r="26" fill="#3B1680" />
                    <text x="280" y="124" textAnchor="middle" fontSize="13" fill="#E5C963" fontFamily="serif" fontWeight="bold">A✦</text>
                    <text x="280" y="166" textAnchor="middle" fontSize="7" fill="#8B83A0" letterSpacing="1">THE GRAND ATRIUM</text>
                    <text x="280" y="234" textAnchor="middle" fontSize="8" fill="#8B83A0" letterSpacing="2">SOUTH ENTRANCE</text>
                    <text x="145" y="66" textAnchor="middle" fontSize="14">🛍️</text>
                    <text x="415" y="66" textAnchor="middle" fontSize="14">💼</text>
                    <text x="145" y="182" textAnchor="middle" fontSize="14">🍜</text>
                    <text x="415" y="182" textAnchor="middle" fontSize="14">🖇️</text>
                    <text x="280" y="66" textAnchor="middle" fontSize="14">🎁</text>
                    <text x="280" y="182" textAnchor="middle" fontSize="14">🧶</text>
                  </svg>
                </div>
                {/* Placement intelligence */}
                <div className="rounded-xl bg-secondary/60 p-4">
                  <div className="mb-3 text-sm font-bold">Placement Intelligence</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5">
                      <Crown className="mt-0.5 h-4 w-4 text-accio-gold" />
                      <span><b>High Demand Zones</b><br /><span className="text-xs text-muted-foreground">Gifting Pavilion, Grand Atrium</span></span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Landmark className="mt-0.5 h-4 w-4 text-accio-gold" />
                      <span><b>Low Vacancy Zones</b><br /><span className="text-xs text-muted-foreground">Food Hall, Office Emporium</span></span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="mt-0.5 h-4 w-4 text-accio-gold" />
                      <span><b>Opportunity Areas</b><br /><span className="text-xs text-muted-foreground">Makers' District, B2B Exchange</span></span>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full" size="sm">
                    <ChartNoAxesCombined /> View Heatmap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
