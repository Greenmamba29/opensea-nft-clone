import React from 'react';
import { Link } from 'react-router-dom';
import { MALL_STOREFRONTS, aisleBySlug } from '@/lib/mallData';

const FeaturedCollections = () => {
  const featured = MALL_STOREFRONTS.slice(0, 4);

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Storefronts</h2>
          <p className="text-[var(--os-text-secondary)]">This week's curated stores across the aisles</p>
        </div>
        <Link to="/mall/stores" className="text-[var(--os-blue)] font-bold hover:opacity-80 transition-opacity flex items-center gap-1">
          Explore all <span className="text-lg">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 overflow-x-auto no-scrollbar pb-4">
        {featured.map((store) => {
          const aisle = aisleBySlug(store.aisle);
          return (
            <Link
              key={store.id}
              to="/mall/collection"
              className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-[var(--os-blue)] transition-all cursor-pointer shadow-lg"
            >
              {/* Storefront image (gradient placeholder) */}
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[var(--os-surface-2)] to-[var(--os-surface-3)] flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${aisle?.color ?? 'var(--os-blue)'}, var(--os-blue))`,
                    filter: 'blur(30px)',
                  }}
                />
                <span className="relative z-10">{store.icon}</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 font-bold text-lg mb-1 truncate group-hover:text-[var(--os-blue)] transition-colors">
                  {store.merchant}
                  <span className="text-[var(--os-blue)] text-sm">✓</span>
                </div>
                <div className="text-xs font-bold text-[var(--os-text-tertiary)] uppercase tracking-wider mb-4">
                  {aisle?.icon} {aisle?.name}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">From</div>
                    <div className="font-bold">{store.fromPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">Monthly Sales</div>
                    <div className="font-bold text-[var(--os-green)]">{store.monthlySales}</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCollections;
