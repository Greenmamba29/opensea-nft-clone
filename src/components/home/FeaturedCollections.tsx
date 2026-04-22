import React from 'react';
import { featuredCollections } from '@/data/mock';

const FeaturedCollections = () => {
  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Collections</h2>
          <p className="text-[var(--os-text-secondary)]">This week's curated collections</p>
        </div>
        <button className="text-[var(--os-blue)] font-bold hover:opacity-80 transition-opacity flex items-center gap-1">
          Explore all <span className="text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 overflow-x-auto no-scrollbar pb-4">
        {featuredCollections.map((item) => (
          <div 
            key={item.name}
            className="group bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-[var(--os-blue)] transition-all cursor-pointer shadow-lg"
          >
            {/* Collection Image (Gradient Placeholder) */}
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[var(--os-surface-2)] to-[var(--os-surface-3)] flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  background: `linear-gradient(${Math.random() * 360}deg, var(--os-blue), var(--os-green), var(--os-red))`,
                  filter: 'blur(30px)'
                }}
              />
              <span className="relative z-10">{item.image}</span>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-1 font-bold text-lg mb-4 truncate group-hover:text-[var(--os-blue)] transition-colors">
                {item.name}
                {item.verified && (
                  <span className="text-[var(--os-blue)] text-sm">✓</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">Floor</div>
                  <div className="font-bold">{item.floor}</div>
                </div>
                <div className="text-right">
                  <div className="text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">Change</div>
                  <div 
                    className={`font-bold ${
                      item.change.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'
                    }`}
                  >
                    {item.change}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollections;
