import React from 'react';
import CategoryBar from '@/components/home/CategoryBar';
import HeroCarousel from '@/components/home/HeroCarousel';
import RankingsSidebar from '@/components/home/RankingsSidebar';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import TrendingTokens from '@/components/home/TrendingTokens';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] p-8 max-w-[1600px] mx-auto">
      {/* Category Tabs Bar */}
      <CategoryBar />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area (Left ~70%) */}
        <div className="flex-1 lg:w-[70%] overflow-hidden">
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* Featured Collections */}
          <FeaturedCollections />

          {/* Trending Tokens */}
          <TrendingTokens />
        </div>

        {/* Rankings Sidebar (Right ~30%) */}
        <div className="lg:w-[30%]">
          <RankingsSidebar />
        </div>
      </div>
    </main>
  );
}
