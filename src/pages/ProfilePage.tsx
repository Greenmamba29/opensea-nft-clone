import React from 'react';
import { Link } from 'react-router-dom';
import {
  AISLES,
  MALL_ORDERS,
  MALL_STOREFRONTS,
  ORDER_STATUS_STYLES,
  SAMPLE_QUOTES,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
  aisleBySlug,
} from '@/lib/mallData';

// Buyer Dashboard — "What am I buying, sourcing, tracking, or saving?"
export default function ProfilePage() {
  const activeOrders = MALL_ORDERS.filter((o) => o.status === 'processing' || o.status === 'shipped');
  const savedStores = MALL_STOREFRONTS.slice(0, 4);
  const recommendedAisles = AISLES.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-[var(--os-blue)] via-purple-800 to-[var(--os-gold)] w-full" />

      <div className="px-8 -mt-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[var(--os-border)] gap-6">
        <div className="flex items-end gap-6">
          <div className="w-24 h-24 rounded-3xl border-4 border-[var(--os-bg)] bg-[var(--os-surface-2)] shadow-xl flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="pb-1">
            <h1 className="text-2xl font-black tracking-tight">Your Buyer Dashboard</h1>
            <p className="text-sm text-[var(--os-text-secondary)] font-medium">
              Everything you're buying, sourcing, tracking, or saving — in one place.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pb-1">
          <Link to="/mall/quotes" className="px-5 py-2.5 bg-[var(--os-blue)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
            New quote request
          </Link>
          <Link to="/mall/products" className="px-5 py-2.5 border border-[var(--os-border)] rounded-xl font-bold text-sm hover:bg-[var(--os-surface-2)] transition-all">
            Browse products
          </Link>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders */}
        <DashboardCard title="Active Orders" linkLabel="All orders" linkTo="/mall/orders" className="lg:col-span-2">
          {activeOrders.length === 0 ? (
            <EmptyHint text="No active orders — browse the aisles to get started." />
          ) : (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 bg-[var(--os-surface-2)] rounded-xl p-4">
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{order.summary}</div>
                    <div className="text-xs text-[var(--os-text-secondary)] font-medium">{order.storefront} · {order.date}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-sm">${order.total.toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${ORDER_STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* GrahmOS Rewards */}
        <DashboardCard title="GrahmOS Rewards" linkLabel="Rewards" linkTo="/mall/rewards">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--os-gold)]/15 border border-[var(--os-gold)]/30 flex items-center justify-center text-3xl mb-4">
              ⚡
            </div>
            <div className="text-3xl font-black mb-1">1,240 <span className="text-sm font-bold text-[var(--os-text-secondary)]">pts</span></div>
            <p className="text-xs text-[var(--os-text-secondary)] font-medium">
              120 points earned on your last order. Redeem against any storefront.
            </p>
          </div>
        </DashboardCard>

        {/* Quote Requests */}
        <DashboardCard title="Quote Requests" linkLabel="All quotes" linkTo="/mall/quotes" className="lg:col-span-2">
          <div className="space-y-3">
            {SAMPLE_QUOTES.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between gap-4 bg-[var(--os-surface-2)] rounded-xl p-4">
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{quote.description}</div>
                  <div className="text-xs text-[var(--os-text-secondary)] font-medium">
                    {quote.quantity.toLocaleString()} {quote.unit} · {quote.createdAt}
                  </div>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${QUOTE_STATUS_STYLES[quote.status]}`}>
                  {QUOTE_STATUS_LABELS[quote.status]}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Concierge History (placeholder) */}
        <DashboardCard title="Concierge History">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-3xl mb-3">✦</div>
            <p className="text-sm text-[var(--os-text-secondary)] font-medium mb-4">
              Your conversations with GrahmOS will appear here.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('grahmos:open-concierge'))}
              className="px-5 py-2.5 bg-[var(--os-blue)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              Ask GrahmOS
            </button>
          </div>
        </DashboardCard>

        {/* Saved Storefronts */}
        <DashboardCard title="Saved Storefronts" linkLabel="Directory" linkTo="/mall/stores" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {savedStores.map((store) => (
              <Link
                key={store.id}
                to="/mall/collection"
                className="group bg-[var(--os-surface-2)] rounded-xl p-4 hover:bg-[var(--os-surface-3)] transition-colors text-center"
              >
                <div className="text-3xl mb-2">{store.icon}</div>
                <div className="font-bold text-xs truncate group-hover:text-[var(--os-blue)] transition-colors">{store.merchant}</div>
                <div className="text-[10px] text-[var(--os-text-tertiary)] font-bold uppercase tracking-wider mt-1">
                  From {store.fromPrice}
                </div>
              </Link>
            ))}
          </div>
        </DashboardCard>

        {/* Recommended Aisles */}
        <DashboardCard title="Recommended Aisles" linkLabel="All aisles" linkTo="/mall/aisles">
          <div className="space-y-2">
            {recommendedAisles.map((aisle) => (
              <Link
                key={aisle.slug}
                to={`/mall/aisles/${aisle.slug}`}
                className="flex items-center gap-3 bg-[var(--os-surface-2)] rounded-xl px-4 py-3 hover:bg-[var(--os-surface-3)] transition-colors"
              >
                <span className="text-xl">{aisle.icon}</span>
                <span className="font-bold text-sm">{aisle.name}</span>
                <span className="ml-auto text-[var(--os-text-tertiary)]">→</span>
              </Link>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  children,
  linkLabel,
  linkTo,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  linkLabel?: string;
  linkTo?: string;
  className?: string;
}) {
  return (
    <section className={`bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-lg">{title}</h2>
        {linkLabel && linkTo && (
          <Link to={linkTo} className="text-xs font-bold text-[var(--os-blue)] hover:underline">
            {linkLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-sm text-[var(--os-text-secondary)] font-medium py-6 text-center">{text}</p>;
}
