import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { aisleBySlug, storefrontsByAisle, MALL_PRODUCTS } from '@/lib/mallData';

const TIER_LABELS: Record<string, string> = { rent: 'Renting', lease: 'Leasing', own: 'Owner' };

export default function AisleDetailPage() {
  const { slug } = useParams();
  const aisle = aisleBySlug(slug);

  if (!aisle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] p-12 text-center">
        <h1 className="text-2xl font-black mb-4">Aisle not found</h1>
        <p className="text-[var(--os-text-secondary)] font-medium mb-8">
          This aisle isn't on the mall map yet.
        </p>
        <Link to="/mall/aisles" className="px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all">
          Browse all aisles
        </Link>
      </div>
    );
  }

  const stores = storefrontsByAisle(aisle.slug);
  const products = MALL_PRODUCTS.filter((p) => p.aisle === aisle.slug);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Aisle header */}
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <Link to="/mall/aisles" className="text-sm font-bold text-[var(--os-text-secondary)] hover:text-[var(--os-blue)] transition-colors">
          ← All aisles
        </Link>
        <div className="flex items-center gap-5 mt-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: `${aisle.color}22`, border: `1px solid ${aisle.color}44` }}
          >
            {aisle.icon}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{aisle.name}</h1>
            <p className="text-[var(--os-text-secondary)] font-medium">{aisle.description}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {/* Storefronts in this aisle */}
        <h2 className="text-xl font-black mb-6">Storefronts in this aisle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stores.map((store) => (
            <Link
              key={store.id}
              to="/mall/collection"
              className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 hover:border-[var(--os-blue)] hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--os-surface-2)] flex items-center justify-center text-2xl">
                  {store.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black group-hover:text-[var(--os-blue)] transition-colors">{store.merchant}</span>
                    {store.platform === 'shopify' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--os-green)]/30 bg-[var(--os-green)]/15 text-[var(--os-green)]">
                        🛍 Shopify
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[var(--os-text-tertiary)] uppercase tracking-wider">
                    {store.storeType} · {TIER_LABELS[store.tier]}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--os-text-secondary)] font-medium mb-4">{store.tagline}</p>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--os-text-tertiary)] uppercase">From {store.fromPrice}</span>
                <span className="text-[var(--os-text-tertiary)] uppercase">{store.customers.toLocaleString()} customers</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Products strip */}
        {products.length > 0 && (
          <>
            <h2 className="text-xl font-black mb-6">Popular in {aisle.name}</h2>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 mb-12">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to="/mall/collection"
                  className="group flex-shrink-0 w-56 bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden hover:border-[var(--os-blue)] transition-all"
                >
                  <div className="h-32 flex items-center justify-center text-5xl" style={{ background: product.gradient }}>
                    {product.icon}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-sm mb-1 truncate group-hover:text-[var(--os-blue)] transition-colors">{product.name}</div>
                    <div className="text-xs text-[var(--os-text-secondary)] font-medium mb-2">{product.storefront}</div>
                    <div className="font-black text-sm">
                      ${product.price.toLocaleString()} <span className="text-[10px] text-[var(--os-text-tertiary)] font-bold">{product.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black mb-1">Sourcing something in {aisle.name}?</h2>
            <p className="text-[var(--os-text-secondary)] font-medium">
              Submit a request and an GrahmOS agent will price it across every store in this aisle.
            </p>
          </div>
          <Link
            to={`/mall/quotes?aisle=${aisle.slug}`}
            className="px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap"
          >
            Request a quote for this aisle
          </Link>
        </div>
      </div>
    </div>
  );
}
