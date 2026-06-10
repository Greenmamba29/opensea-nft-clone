import React from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import {
  MALL_ORDERS,
  MALL_PRODUCTS,
  ORDER_STATUS_STYLES,
  SAMPLE_QUOTES,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
} from "@/lib/mallData";

const TRAFFIC = [
  { d: "Mon", visits: 320 },
  { d: "Tue", visits: 410 },
  { d: "Wed", visits: 380 },
  { d: "Thu", visits: 520 },
  { d: "Fri", visits: 610 },
  { d: "Sat", visits: 480 },
  { d: "Sun", visits: 350 },
];

// Tenant Studio — "How is my storefront performing?"
export default function StudioPage() {
  const catalog = MALL_PRODUCTS.filter((p) => p.storefrontId === "sf_05");
  const orders = MALL_ORDERS.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Tenant Studio</h1>
          <p className="text-[var(--os-text-secondary)] font-medium">
            SupplyHub Co. · 📦 Packaging aisle · How is my storefront performing?
          </p>
        </div>
        <Link to="/mall/collection" className="px-5 py-2.5 border border-[var(--os-border)] rounded-xl font-bold text-sm hover:bg-[var(--os-surface-2)] transition-all whitespace-nowrap">
          View my storefront →
        </Link>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {/* Lease status + upgrade path banner */}
        <div className="mb-6 bg-gradient-to-r from-[var(--os-blue)]/15 via-[var(--os-surface)] to-[var(--os-gold)]/10 border border-[var(--os-blue)]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--os-text-secondary)] mb-2">Lease Status</div>
            <div className="flex items-center gap-3 font-black text-lg">
              <span className="text-[var(--os-text-tertiary)]">Rent</span>
              <span className="text-[var(--os-text-tertiary)]">→</span>
              <span className="text-[var(--os-blue)] px-3 py-1 bg-[var(--os-blue)]/15 border border-[var(--os-blue)]/30 rounded-full text-sm uppercase tracking-wider">Lease</span>
              <span className="text-[var(--os-text-tertiary)]">→</span>
              <span className="text-[var(--os-text-tertiary)]">Own</span>
            </div>
            <p className="text-sm text-[var(--os-text-secondary)] font-medium mt-2">
              You're on an annual lease at $359/mo. Upgrade to Own to lower your take-rate and hold your storefront outright.
            </p>
          </div>
          <button className="px-6 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap">
            Explore ownership
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storefront Traffic */}
          <StudioCard title="Storefront Traffic" className="lg:col-span-2">
            <div className="flex items-end gap-8 mb-4">
              <div>
                <div className="text-3xl font-black">3,070</div>
                <div className="text-xs font-bold text-[var(--os-text-secondary)] uppercase tracking-wider">Visits this week</div>
              </div>
              <div className="text-[var(--os-green)] font-bold text-sm pb-1">↑ 14% vs last week</div>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: "#8a919e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#1a1d21", border: "1px solid #2a2d33", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "#8a919e" }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#7C3AED" strokeWidth={2} fill="url(#trafficFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </StudioCard>

          {/* Payouts */}
          <StudioCard title="Payouts">
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-black">$8,420</div>
                <div className="text-xs font-bold text-[var(--os-text-secondary)] uppercase tracking-wider">Next payout · Jun 15</div>
              </div>
              <div className="flex justify-between text-sm font-semibold bg-[var(--os-surface-2)] rounded-xl px-4 py-3">
                <span className="text-[var(--os-text-secondary)]">May payout</span>
                <span>$11,260</span>
              </div>
              <div className="flex justify-between text-sm font-semibold bg-[var(--os-surface-2)] rounded-xl px-4 py-3">
                <span className="text-[var(--os-text-secondary)]">Take-rate (Lease)</span>
                <span>6.5%</span>
              </div>
            </div>
          </StudioCard>

          {/* Product Catalog */}
          <StudioCard title="Product Catalog" action={{ label: "Add product", onClickHint: true }}>
            <div className="space-y-2">
              {catalog.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 bg-[var(--os-surface-2)] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg">{product.icon}</span>
                    <span className="font-bold text-sm truncate">{product.name}</span>
                  </div>
                  <span className="font-black text-sm shrink-0">${product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </StudioCard>

          {/* Orders */}
          <StudioCard title="Orders">
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 bg-[var(--os-surface-2)] rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-bold text-sm">{order.id}</div>
                    <div className="text-xs text-[var(--os-text-secondary)] font-medium truncate">{order.summary}</div>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${ORDER_STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </StudioCard>

          {/* Quote Requests */}
          <StudioCard title="Quote Requests">
            <div className="space-y-2">
              {SAMPLE_QUOTES.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between gap-3 bg-[var(--os-surface-2)] rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{quote.description}</div>
                    <div className="text-xs text-[var(--os-text-secondary)] font-medium">
                      {quote.quantity.toLocaleString()} {quote.unit}
                    </div>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${QUOTE_STATUS_STYLES[quote.status]}`}>
                    {QUOTE_STATUS_LABELS[quote.status]}
                  </span>
                </div>
              ))}
            </div>
          </StudioCard>

          {/* Agent-Assisted Sales */}
          <StudioCard title="Agent-Assisted Sales" className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--os-surface-2)] rounded-xl p-5">
                <div className="text-2xl font-black mb-1">$2,140</div>
                <div className="text-xs font-bold text-[var(--os-text-secondary)] uppercase tracking-wider">Closed by GrahmOS agents this month</div>
              </div>
              <div className="bg-[var(--os-surface-2)] rounded-xl p-5">
                <div className="text-2xl font-black mb-1">6</div>
                <div className="text-xs font-bold text-[var(--os-text-secondary)] uppercase tracking-wider">Active sourcing conversations</div>
              </div>
              <div className="bg-[var(--os-surface-2)] rounded-xl p-5">
                <div className="text-2xl font-black mb-1">Ava Reynolds</div>
                <div className="text-xs font-bold text-[var(--os-text-secondary)] uppercase tracking-wider">Your assigned mall agent</div>
              </div>
            </div>
          </StudioCard>
        </div>
      </div>
    </div>
  );
}

function StudioCard({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: { label: string; onClickHint?: boolean };
}) {
  return (
    <section className={`bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-lg">{title}</h2>
        {action && (
          <button className="text-xs font-bold text-[var(--os-blue)] hover:underline">{action.label} +</button>
        )}
      </div>
      {children}
    </section>
  );
}
