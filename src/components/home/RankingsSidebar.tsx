import React from 'react';
import { Link } from 'react-router-dom';
import { MALL_STOREFRONTS } from '@/lib/mallData';

// Mall Directory preview — top storefronts by monthly sales.
const RankingsSidebar = () => {
  return (
    <div className="sticky top-24 h-fit bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Mall Directory</h2>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Sales</span>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar pr-2">
        {MALL_STOREFRONTS.map((store, index) => (
          <Link
            key={store.id}
            to="/mall/collection"
            className="flex items-center justify-between group cursor-pointer hover:bg-[var(--os-surface-2)] p-2 -m-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[var(--os-text-secondary)] font-medium w-4">{index + 1}</span>
              <div className="w-10 h-10 rounded-lg bg-[var(--os-surface-2)] flex items-center justify-center text-xl">
                {store.icon}
              </div>
              <div>
                <div className="font-bold flex items-center gap-1 group-hover:text-[var(--os-blue)] transition-colors">
                  {store.merchant}
                  <span className="text-[var(--os-blue)] text-sm">✓</span>
                </div>
                <div className="text-sm font-medium text-[var(--os-text-secondary)]">
                  {store.customers.toLocaleString()} customers
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold">{store.monthlySales}</div>
              <div className="text-[var(--os-text-secondary)] text-xs">Monthly sales</div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/mall/stores"
        className="block text-center w-full mt-6 py-3 border border-[var(--os-border)] rounded-xl font-bold hover:bg-[var(--os-surface-2)] transition-colors"
      >
        View Full Directory
      </Link>
    </div>
  );
};

export default RankingsSidebar;
