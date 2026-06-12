import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { aisleBySlug, storefrontsByAisle, MALL_PRODUCTS } from '@/lib/mallData';
import { bnyByAisle } from '@/lib/bnyRoster';
import { UnclaimedBadge } from '@/components/grahmos/UnclaimedBadge';
import { getShopifyCatalog, ShopifyCatalog } from '@/lib/api';

const TIER_LABELS: Record<string, string> = { rent: 'Renting', lease: 'Leasing', own: 'Owner' };

/** Live catalog strip for an integrated Shopify storefront in this aisle. */
function ShopifyCatalogStrip({ merchant, domain }: { merchant: string; domain: string }) {
  const [catalog, setCatalog] = useState<ShopifyCatalog | null>(null);

  useEffect(() => {
    let alive = true;
    getShopifyCatalog(domain)
      .then((c) => { if (alive) setCatalog(c); })
      .catch(() => { /* strip simply doesn't render */ });
    return () => { alive = false; };
  }, [domain]);

  if (!catalog || catalog.source === 'demo' || catalog.products.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-black">Live from {merchant}</h2>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--os-green)]/30 bg-[var(--os-green)]/15 text-[var(--os-green)]">
          🛍 Shopify {catalog.source === 'shopify' ? '· live' : '· synced'}
        </span>
      </div>
      <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 mb-12">
        {catalog.products.map((product) => (
          <a
            key={product.id}
            href={product.url ?? '#'}
            target="_blank"
            rel="noreferrer"
            className="group flex-shrink-0 w-56 bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden hover:border-[var(--os-blue)] transition-all"
          >
            <div className="h-32 bg-[var(--os-surface-2)] flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              ) : (
                <span className="text-5xl">🛍</span>
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-sm mb-1 truncate group-hover:text-[var(--os-blue)] transition-colors">{product.name}</div>
              <div className="text-xs text-[var(--os-text-secondary)] font-medium mb-2">{merchant}</div>
              <div className="font-black text-sm">
                ${product.price.toLocaleString()} <span className="text-[10px] text-[var(--os-text-tertiary)] font-bold">{product.unit}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

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
  const bnyTenants = bnyByAisle(aisle.slug);
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
              to={`/mall/collection/${store.id}`}
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

        {/* Brooklyn Navy Yard tenants — unclaimed, display-only profiles */}
        {bnyTenants.length > 0 && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-black">Navy Yard tenants in this aisle</h2>
              <UnclaimedBadge compact />
            </div>
            <p className="text-xs text-[var(--os-text-tertiary)] font-medium mb-6">
              Real Brooklyn Navy Yard businesses with move-in-ready storefronts waiting to be
              claimed. Profiles are informational only — nothing is for sale until the business
              claims its store.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {bnyTenants.map((tenant) => (
                <Link
                  key={tenant.id}
                  to={`/mall/bny/${tenant.slug}`}
                  className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 hover:border-[var(--os-gold)] hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--os-surface-2)] flex items-center justify-center text-2xl">
                      {tenant.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black truncate group-hover:text-[var(--os-gold)] transition-colors">
                        {tenant.name}
                      </div>
                      <div className="text-xs font-bold text-[var(--os-text-tertiary)] uppercase tracking-wider">
                        BNY roster #{tenant.rank}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--os-text-secondary)] font-medium mb-4 line-clamp-2">
                    {tenant.description}
                  </p>
                  <UnclaimedBadge compact />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Live Shopify catalogs for integrated storefronts in this aisle */}
        {stores
          .filter((s) => s.platform === 'shopify' && s.shopifyDomain)
          .map((s) => (
            <ShopifyCatalogStrip key={s.id} merchant={s.merchant} domain={s.shopifyDomain!} />
          ))}

        {/* Products strip */}
        {products.length > 0 && (
          <>
            <h2 className="text-xl font-black mb-6">Popular in {aisle.name}</h2>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 mb-12">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/mall/product/${product.id}`}
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
