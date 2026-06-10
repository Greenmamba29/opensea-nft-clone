import React from 'react';
import { Link } from 'react-router-dom';
import { AISLES, storefrontsByAisle } from '@/lib/mallData';

export default function AislesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">Browse the Aisles</h1>
        <p className="text-[var(--os-text-secondary)] font-medium">
          The BNY Digital Mall — local manufacturers, suppliers, makers.
        </p>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AISLES.map((aisle) => {
            const storeCount = storefrontsByAisle(aisle.slug).length;
            return (
              <Link
                key={aisle.slug}
                to={`/mall/aisles/${aisle.slug}`}
                className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 hover:border-[var(--os-blue)] hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
                  style={{ background: `${aisle.color}22`, border: `1px solid ${aisle.color}44` }}
                >
                  {aisle.icon}
                </div>
                <h3 className="font-black text-lg mb-2 group-hover:text-[var(--os-blue)] transition-colors">
                  {aisle.name}
                </h3>
                <p className="text-sm text-[var(--os-text-secondary)] font-medium mb-4 leading-relaxed">
                  {aisle.description}
                </p>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--os-text-tertiary)]">
                  {storeCount} {storeCount === 1 ? 'store' : 'stores'} →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black mb-1">Not sure which aisle you need?</h2>
            <p className="text-[var(--os-text-secondary)] font-medium">
              Tell GrahmOS what you're sourcing and we'll route it to the right stores.
            </p>
          </div>
          <Link
            to="/mall/quotes"
            className="px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
