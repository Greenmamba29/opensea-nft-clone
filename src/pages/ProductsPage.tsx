import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AISLES, MALL_PRODUCTS, aisleBySlug } from '@/lib/mallData';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  // Seed search from ?q= so the global header search lands pre-filtered.
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [activeAisle, setActiveAisle] = useState<string | null>(
    () => aisleBySlug(searchParams.get('aisle') ?? undefined)?.slug ?? null
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MALL_PRODUCTS.filter((p) => {
      if (activeAisle && p.aisle !== activeAisle) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.storefront.toLowerCase().includes(q) ||
        (aisleBySlug(p.aisle)?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, activeAisle]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">Products</h1>
        <p className="text-[var(--os-text-secondary)] font-medium">
          Everything on the shelves, across every aisle.
        </p>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {/* Search */}
        <div className="relative max-w-lg mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or storefronts"
            className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-2 px-4 pl-10 text-sm focus:outline-none focus:border-[var(--os-blue)]"
          />
          <span className="absolute left-4 top-2.5 text-[var(--os-text-tertiary)]">🔍</span>
        </div>

        {/* Aisle filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveAisle(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              activeAisle === null
                ? 'bg-[var(--os-blue)] text-white border-[var(--os-blue)]'
                : 'bg-[var(--os-surface-2)] border-[var(--os-border)] text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'
            }`}
          >
            All aisles
          </button>
          {AISLES.map((aisle) => (
            <button
              key={aisle.slug}
              onClick={() => setActiveAisle(activeAisle === aisle.slug ? null : aisle.slug)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                activeAisle === aisle.slug
                  ? 'bg-[var(--os-blue)] text-white border-[var(--os-blue)]'
                  : 'bg-[var(--os-surface-2)] border-[var(--os-border)] text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'
              }`}
            >
              <span>{aisle.icon}</span>
              <span>{aisle.name}</span>
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-black mb-2">No products match</h2>
            <p className="text-[var(--os-text-secondary)] font-medium max-w-sm">
              Try a different search — or ask GrahmOS to source it for you via a quote request.
            </p>
            <Link to="/mall/quotes" className="mt-6 px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all">
              Request a quote
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const aisle = aisleBySlug(product.aisle);
              return (
                <Link
                  key={product.id}
                  to={`/mall/product/${product.id}`}
                  className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden hover:border-[var(--os-blue)] hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-[4/3] flex items-center justify-center text-6xl" style={{ background: product.gradient }}>
                    {product.icon}
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-tertiary)] mb-1">
                      {aisle?.icon} {aisle?.name}
                    </div>
                    <div className="font-bold text-sm mb-1 truncate group-hover:text-[var(--os-blue)] transition-colors">
                      {product.name}
                    </div>
                    <div className="text-xs text-[var(--os-text-secondary)] font-medium mb-3">{product.storefront}</div>
                    <div className="flex items-end justify-between">
                      <div className="font-black">
                        ${product.price.toLocaleString()}{' '}
                        <span className="text-[10px] text-[var(--os-text-tertiary)] font-bold">{product.unit}</span>
                      </div>
                      <div className="text-[10px] font-bold text-[var(--os-text-tertiary)] uppercase">
                        Min {product.minOrder}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
