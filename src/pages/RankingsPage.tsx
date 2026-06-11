import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AISLES, MALL_STOREFRONTS, aisleBySlug } from '@/lib/mallData';

const TIER_LABELS: Record<string, string> = { rent: 'Renting', lease: 'Leasing', own: 'Owner' };

// Mall Directory — every storefront, ranked by traffic and sales.
export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<'top' | 'new'>('top');
  const [activeAisle, setActiveAisle] = useState<string | null>(null);

  const stores = useMemo(() => {
    const list = MALL_STOREFRONTS.filter((s) => !activeAisle || s.aisle === activeAisle);
    if (activeTab === 'top') {
      return [...list].sort((a, b) => b.customers - a.customers);
    }
    return [...list].reverse();
  }, [activeTab, activeAisle]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-4 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">Mall Directory</h1>
        <p className="text-[var(--os-text-secondary)] font-medium mb-6">
          Every storefront in the mall, ranked by traffic and sales.
        </p>

        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('top')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'top' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
          >
            <span>👑</span>
            <span>Top Stores</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'new' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
          >
            <span>✨</span>
            <span>New Openings</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-[var(--os-border)] overflow-y-auto p-6 hidden lg:block">
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)] mb-4">Aisle</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveAisle(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeAisle === null ? 'bg-[var(--os-surface-2)] font-semibold' : 'text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)] hover:text-[var(--os-text)]'}`}
              >
                All Aisles
              </button>
              {AISLES.map((aisle) => (
                <button
                  key={aisle.slug}
                  onClick={() => setActiveAisle(activeAisle === aisle.slug ? null : aisle.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeAisle === aisle.slug ? 'bg-[var(--os-surface-2)] font-semibold' : 'text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)] hover:text-[var(--os-text)]'}`}
                >
                  <span>{aisle.icon}</span>
                  <span>{aisle.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--os-border)] pt-6">
            <p className="text-sm text-[var(--os-text-secondary)] font-medium mb-4">
              Want a storefront of your own?
            </p>
            <Link
              to="/mall/studio"
              className="block text-center px-4 py-2.5 bg-[var(--os-blue)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              Open in Tenant Studio
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--os-bg)] z-10">
              <tr className="border-b border-[var(--os-border)] text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4">Storefront</th>
                <th className="px-6 py-4">Aisle</th>
                <th className="px-6 py-4 text-right">From Price</th>
                <th className="px-6 py-4 text-right bg-[var(--os-surface)]">Monthly Sales</th>
                <th className="px-6 py-4 text-right">Customers</th>
                <th className="px-6 py-4 text-right">Tenancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {stores.map((store, i) => {
                const aisle = aisleBySlug(store.aisle);
                return (
                  <tr key={store.id} className="hover:bg-[var(--os-surface)] transition-colors cursor-pointer group">
                    <td className="px-6 py-5 text-[var(--os-text-secondary)] font-medium">{i + 1}</td>
                    <td className="px-6 py-5">
                      <Link to="/mall/collection" className="flex items-center space-x-4">
                        <span className="text-[var(--os-text-tertiary)] hover:text-yellow-400 transition-colors">☆</span>
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--os-surface-3)] flex items-center justify-center text-2xl">
                          {store.icon}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-1">
                            <span className="font-bold group-hover:text-[var(--os-blue)] transition-colors">{store.merchant}</span>
                            <span className="text-[var(--os-blue)] text-xs">✓</span>
                            {store.platform === 'shopify' && (
                              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--os-green)]/30 bg-[var(--os-green)]/15 text-[var(--os-green)]">
                                🛍 Shopify
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[var(--os-text-secondary)] font-medium">{store.tagline}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <Link to={`/mall/aisles/${store.aisle}`} className="text-sm font-semibold text-[var(--os-text-secondary)] hover:text-[var(--os-blue)] transition-colors">
                        {aisle?.icon} {aisle?.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-right font-semibold">{store.fromPrice}</td>
                    <td className="px-6 py-5 text-right font-bold bg-[var(--os-surface)] text-[var(--os-green)]">{store.monthlySales}</td>
                    <td className="px-6 py-5 text-right font-semibold">{store.customers.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--os-border)] bg-[var(--os-surface-2)]">
                        {TIER_LABELS[store.tier]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
