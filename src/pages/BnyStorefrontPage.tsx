import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import ClaimStoreModal from "@/components/grahmos/ClaimStoreModal";
import { AttributionBlock, UnclaimedBadge } from "@/components/grahmos/UnclaimedBadge";
import { claimRequestFor } from "@/lib/bnyClaims";
import { bnyBySlug } from "@/lib/bnyRoster";
import { showcaseFor } from "@/lib/bnyShowcase";
import { aisleBySlug } from "@/lib/mallData";

/** Unclaimed BNY profile page — display-only by design (consent gate,
 *  PLAN-50-STORES.md). No cart, no checkout, no pricing: just who they are,
 *  what they're known for, attribution, and the claim flow. */
export default function BnyStorefrontPage() {
  const { slug } = useParams();
  const store = bnyBySlug(slug);
  const [claimOpen, setClaimOpen] = useState(false);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] p-12 text-center">
        <h1 className="text-2xl font-black mb-4">Profile not found</h1>
        <p className="text-[var(--os-text-secondary)] font-medium mb-8">
          This Navy Yard business isn't in the program roster.
        </p>
        <Link
          to="/mall/bny"
          className="px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          Browse the Navy Yard roster
        </Link>
      </div>
    );
  }

  const aisle = aisleBySlug(store.aisle);
  const showcase = showcaseFor(store.slug);
  const claim = claimRequestFor(store.slug);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Header */}
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <Link
          to="/mall/bny"
          className="text-sm font-bold text-[var(--os-text-secondary)] hover:text-[var(--os-blue)] transition-colors"
        >
          ← Navy Yard roster
        </Link>
        <div className="flex flex-wrap items-center gap-5 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--os-surface-2)] border border-[var(--os-border)] flex items-center justify-center text-4xl">
            {store.icon}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{store.name}</h1>
              <UnclaimedBadge />
            </div>
            <p className="text-[var(--os-text-secondary)] font-medium mt-1">
              {aisle ? (
                <Link to={`/mall/aisles/${aisle.slug}`} className="hover:text-[var(--os-blue)]">
                  {aisle.icon} {aisle.name} Aisle
                </Link>
              ) : (
                store.aisle
              )}{" "}
              · Brooklyn Navy Yard tenant · Roster #{store.rank}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-[1000px] mx-auto w-full space-y-10">
        {/* About */}
        <section>
          <h2 className="text-xl font-black mb-3">About</h2>
          <p className="text-[var(--os-text-secondary)] font-medium leading-relaxed">
            {store.description}
          </p>
          {store.signals && (
            <p className="mt-3 text-sm text-[var(--os-text-tertiary)] font-medium">
              ✦ {store.signals}
            </p>
          )}
        </section>

        {/* Known for — display-only showcase, never products */}
        {showcase.length > 0 && (
          <section>
            <h2 className="text-xl font-black mb-1">Known for</h2>
            <p className="text-xs text-[var(--os-text-tertiary)] font-medium mb-5">
              From public directory information — not a catalog, nothing for sale here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {showcase.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] p-5"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="font-bold text-sm mb-1">{item.label}</div>
                  <div className="text-xs text-[var(--os-text-secondary)] font-medium">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Claim CTA */}
        <section className="rounded-2xl border border-[var(--os-gold)]/40 bg-[var(--os-gold)]/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black mb-1">Is this your business?</h2>
            <p className="text-[var(--os-text-secondary)] font-medium">
              {claim
                ? "A claim request is in — we're verifying ownership now."
                : "Your storefront is already built. Claim it, pick a tier, and start selling through the mall the same day."}
            </p>
          </div>
          <button
            onClick={() => setClaimOpen(true)}
            className="px-8 py-3 bg-[var(--os-gold)] text-black rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap"
          >
            {claim ? "View claim status" : "Claim this storefront"}
          </button>
        </section>

        {/* Attribution + remove */}
        <AttributionBlock
          name={store.name}
          website={store.website}
          attribution={store.attribution}
        />
      </div>

      <ClaimStoreModal store={store} open={claimOpen} onClose={() => setClaimOpen(false)} />
    </div>
  );
}
