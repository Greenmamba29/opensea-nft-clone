import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { UnclaimedBadge } from "@/components/grahmos/UnclaimedBadge";
import { BNY_ROSTER } from "@/lib/bnyRoster";
import { AISLES, aisleBySlug } from "@/lib/mallData";

/** The Navy Yard roster — all 50 move-in-ready storefront profiles
 *  (PLAN-50-STORES.md). Every profile is unclaimed and display-only until
 *  the business claims it through the consent-gated flow. */
export default function BnyProgramPage() {
  const [aisleFilter, setAisleFilter] = useState<string>("all");
  const [cohortFilter, setCohortFilter] = useState<number>(0);

  const filtered = useMemo(
    () =>
      BNY_ROSTER.filter(
        (s) =>
          (aisleFilter === "all" || s.aisle === aisleFilter) &&
          (cohortFilter === 0 || s.cohort === cohortFilter)
      ),
    [aisleFilter, cohortFilter]
  );

  const aislesPresent = AISLES.filter((a) => BNY_ROSTER.some((s) => s.aisle === a.slug));

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Header */}
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <Link
          to="/mall"
          className="text-sm font-bold text-[var(--os-text-secondary)] hover:text-[var(--os-blue)] transition-colors"
        >
          ← Mall home
        </Link>
        <h1 className="text-3xl font-black tracking-tight mt-4">The Navy Yard Roster</h1>
        <p className="text-[var(--os-text-secondary)] font-medium mt-1 max-w-2xl">
          Fifty Brooklyn Navy Yard businesses, each with a move-in-ready GrahmOS
          storefront waiting to be claimed. Profiles are built from public
          directory information, display-only, and removed on request.
        </p>
        <div className="mt-3">
          <UnclaimedBadge compact />
          <span className="ml-2 text-xs text-[var(--os-text-tertiary)] font-medium">
            = not yet claimed by the business — nothing for sale on these profiles
          </span>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setAisleFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              aisleFilter === "all"
                ? "bg-[var(--os-blue)] text-white border-transparent"
                : "border-[var(--os-border)] text-[var(--os-text-secondary)] hover:border-[var(--os-blue)]"
            }`}
          >
            All aisles
          </button>
          {aislesPresent.map((a) => (
            <button
              key={a.slug}
              onClick={() => setAisleFilter(a.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                aisleFilter === a.slug
                  ? "bg-[var(--os-blue)] text-white border-transparent"
                  : "border-[var(--os-border)] text-[var(--os-text-secondary)] hover:border-[var(--os-blue)]"
              }`}
            >
              {a.icon} {a.name}
            </button>
          ))}
          <span className="mx-2 h-5 w-px bg-[var(--os-border)]" aria-hidden />
          {[0, 1, 2, 3].map((c) => (
            <button
              key={c}
              onClick={() => setCohortFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                cohortFilter === c
                  ? "bg-[var(--os-gold)] text-black border-transparent"
                  : "border-[var(--os-border)] text-[var(--os-text-secondary)] hover:border-[var(--os-gold)]"
              }`}
            >
              {c === 0 ? "All cohorts" : `Cohort ${c}`}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-[var(--os-text-tertiary)] mb-4">
          {filtered.length} of {BNY_ROSTER.length} businesses
        </p>

        {/* Roster grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((store) => {
            const aisle = aisleBySlug(store.aisle);
            return (
              <Link
                key={store.id}
                to={`/mall/bny/${store.slug}`}
                className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 hover:border-[var(--os-gold)] hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--os-surface-2)] flex items-center justify-center text-2xl">
                    {store.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black truncate group-hover:text-[var(--os-gold)] transition-colors">
                      {store.name}
                    </div>
                    <div className="text-xs font-bold text-[var(--os-text-tertiary)] uppercase tracking-wider">
                      {aisle?.icon} {aisle?.name ?? store.aisle} · #{store.rank}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--os-text-secondary)] font-medium mb-4 line-clamp-2">
                  {store.description}
                </p>
                <UnclaimedBadge compact />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
