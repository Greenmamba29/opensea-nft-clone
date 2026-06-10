import React from 'react';
import { Link } from 'react-router-dom';
import { MALL_STOREFRONTS, aisleBySlug } from '@/lib/mallData';

// "New Openings" — the latest storefronts to open in the mall.
const TrendingTokens = () => {
  const openings = [...MALL_STOREFRONTS].slice(-5).reverse();

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">New Openings</h2>
          <p className="text-[var(--os-text-secondary)]">Just opened their doors in the mall</p>
        </div>
        <Link to="/mall/drops" className="text-[var(--os-blue)] font-bold hover:opacity-80 transition-opacity flex items-center gap-1">
          View all <span className="text-lg">→</span>
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--os-border)]">
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider">#</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider">Storefront</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider">Aisle</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">From</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">Monthly Sales</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">Customers</th>
            </tr>
          </thead>
          <tbody>
            {openings.map((store, index) => {
              const aisle = aisleBySlug(store.aisle);
              return (
                <tr
                  key={store.id}
                  className="border-b border-[var(--os-border)]/50 hover:bg-[var(--os-surface-2)] transition-colors group cursor-pointer"
                >
                  <td className="py-6 text-[var(--os-text-secondary)] font-medium">{index + 1}</td>
                  <td className="py-6">
                    <Link to="/mall/collection" className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--os-surface-3)] flex items-center justify-center text-lg">
                        {store.icon}
                      </div>
                      <div>
                        <div className="font-bold group-hover:text-[var(--os-blue)] transition-colors flex items-center gap-2">
                          {store.merchant}
                          {index === 0 && <span className="bg-[var(--os-blue)] text-white text-[10px] px-1 rounded font-bold">NEW</span>}
                        </div>
                        <div className="text-[var(--os-text-secondary)] text-sm font-medium">{store.tagline}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-6">
                    <Link
                      to={`/mall/aisles/${store.aisle}`}
                      className="text-sm font-semibold text-[var(--os-text-secondary)] hover:text-[var(--os-blue)] transition-colors"
                    >
                      {aisle?.icon} {aisle?.name}
                    </Link>
                  </td>
                  <td className="py-6 text-right font-bold">{store.fromPrice}</td>
                  <td className="py-6 text-right font-bold text-[var(--os-green)]">{store.monthlySales}</td>
                  <td className="py-6 text-right font-bold">{store.customers.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTokens;
