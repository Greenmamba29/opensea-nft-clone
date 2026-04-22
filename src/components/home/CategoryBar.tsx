import React, { useState } from 'react';
import { categories, chains } from '@/data/mock';

const CategoryBar = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('Trending'); // Top or Trending

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-[var(--os-surface-2)] text-[var(--os-text)] hover:bg-[var(--os-surface-3)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-2 border-l border-[var(--os-border)] pl-4">
            {chains.slice(0, 5).map((chain) => (
              <button
                key={chain.name}
                title={chain.name}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs hover:opacity-80 transition-opacity"
                style={{ backgroundColor: chain.color }}
              >
                {chain.icon}
              </button>
            ))}
            <button className="w-8 h-8 rounded-full bg-[var(--os-surface-2)] flex items-center justify-center text-xs hover:bg-[var(--os-surface-3)]">
              ...
            </button>
          </div>

          <div className="flex bg-[var(--os-surface-2)] rounded-xl p-1">
            <button
              onClick={() => setActiveType('Trending')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                activeType === 'Trending' ? 'bg-[var(--os-surface-3)]' : ''
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setActiveType('Top')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                activeType === 'Top' ? 'bg-[var(--os-surface-3)]' : ''
              }`}
            >
              🏆 Top
            </button>
          </div>

          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-[var(--os-surface-2)] hover:bg-[var(--os-surface-3)]">
              <span className="text-lg">▤</span>
            </button>
            <button className="p-2 rounded-lg bg-[var(--os-surface-2)] hover:bg-[var(--os-surface-3)]">
              <span className="text-lg">⠿</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
