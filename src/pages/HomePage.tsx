import React from 'react';
import { Link } from 'react-router-dom';
import CategoryBar from '@/components/home/CategoryBar';
import HeroCarousel from '@/components/home/HeroCarousel';
import RankingsSidebar from '@/components/home/RankingsSidebar';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import TrendingTokens from '@/components/home/TrendingTokens';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] p-8 max-w-[1600px] mx-auto">
      {/* "Tell GrahmOS what you need" banner */}
      <div className="mb-8 bg-gradient-to-r from-[var(--os-blue)]/20 via-[var(--os-surface)] to-[var(--os-gold)]/10 border border-[var(--os-blue)]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--os-blue)]/20 border border-[var(--os-blue)]/40 flex items-center justify-center text-2xl shrink-0">
            ✦
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Welcome to the Atrium</h2>
            <p className="text-sm text-[var(--os-text-secondary)] font-medium">
              Your AI concierge knows every aisle. Tell GrahmOS what you need and it finds the store, the product, and the price.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('grahmos:open-concierge'))}
            className="px-6 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap"
          >
            Tell GrahmOS what you need
          </button>
          <Link
            to="/mall/aisles"
            className="px-5 py-3 border border-[var(--os-border)] rounded-xl font-bold text-sm hover:bg-[var(--os-surface-2)] transition-all whitespace-nowrap"
          >
            Browse Aisles
          </Link>
          <Link
            to="/mall/quotes"
            className="px-5 py-3 border border-[var(--os-border)] rounded-xl font-bold text-sm hover:bg-[var(--os-surface-2)] transition-all whitespace-nowrap"
          >
            Request a Quote
          </Link>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <CategoryBar />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area (Left ~70%) */}
        <div className="flex-1 lg:w-[70%] overflow-hidden">
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* Featured Storefronts */}
          <FeaturedCollections />

          {/* New Openings */}
          <TrendingTokens />
        </div>

        {/* Mall Directory preview (Right ~30%) */}
        <div className="lg:w-[30%]">
          <RankingsSidebar />
        </div>
      </div>
    </main>
  );
}
