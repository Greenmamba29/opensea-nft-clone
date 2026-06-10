import React, { useState, useEffect } from 'react';
import { MALL_STOREFRONTS, aisleBySlug } from '@/lib/mallData';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = MALL_STOREFRONTS.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const current = featured[currentIndex];
  const aisle = aisleBySlug(current.aisle);

  return (
    <div className="relative group overflow-hidden rounded-2xl mb-12 h-[420px] bg-[var(--os-surface)] border border-[var(--os-border)]">
      {/* Banner Placeholder with Gradient */}
      <div
        className="absolute inset-0 opacity-40 transition-all duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(135deg, #7C3AED, ${aisle?.color ?? '#C9A227'}, #34c759)`,
          filter: 'blur(80px)',
          transform: `scale(1.2) rotate(${currentIndex * 45}deg)`,
        }}
      />

      <div className="relative h-full p-8 flex flex-col justify-end">
        <div className="flex items-start gap-6 mb-4">
          <div className="w-24 h-24 rounded-2xl bg-[var(--os-surface-2)] flex items-center justify-center text-5xl shadow-2xl border-4 border-[var(--os-surface)]">
            {current.icon}
          </div>
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
              {current.merchant}
              <span className="text-[var(--os-blue)] text-2xl">✓</span>
            </h1>
            <p className="text-[var(--os-text-secondary)] text-lg">
              {aisle?.icon} {aisle?.name} <span className="text-[var(--os-text)] font-semibold">· Curated by GrahmOS</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8 max-w-2xl mb-8 p-4 bg-[var(--os-surface-2)]/50 rounded-2xl backdrop-blur-sm">
          <div>
            <div className="text-[var(--os-text-secondary)] text-xs uppercase font-bold tracking-wider mb-1">From Price</div>
            <div className="text-xl font-bold">{current.fromPrice}</div>
          </div>
          <div>
            <div className="text-[var(--os-text-secondary)] text-xs uppercase font-bold tracking-wider mb-1">Monthly Sales</div>
            <div className="text-xl font-bold">{current.monthlySales}</div>
          </div>
          <div>
            <div className="text-[var(--os-text-secondary)] text-xs uppercase font-bold tracking-wider mb-1">Customers</div>
            <div className="text-xl font-bold">{current.customers.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[var(--os-text-secondary)] text-xs uppercase font-bold tracking-wider mb-1">Store Type</div>
            <div className="text-xl font-bold">{current.storeType}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
