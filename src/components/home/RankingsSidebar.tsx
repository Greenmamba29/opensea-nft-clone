import React from 'react';
import { collections } from '@/data/mock';

const RankingsSidebar = () => {
  return (
    <div className="sticky top-24 h-fit bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Collection</h2>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Floor</span>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar pr-2">
        {collections.map((item, index) => (
          <div 
            key={item.name} 
            className="flex items-center justify-between group cursor-pointer hover:bg-[var(--os-surface-2)] p-2 -m-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[var(--os-text-secondary)] font-medium w-4">{index + 1}</span>
              <div className="w-10 h-10 rounded-lg bg-[var(--os-surface-2)] flex items-center justify-center text-xl">
                {item.image}
              </div>
              <div>
                <div className="font-bold flex items-center gap-1 group-hover:text-[var(--os-blue)] transition-colors">
                  {item.name}
                  {item.verified && (
                    <span className="text-[var(--os-blue)] text-sm">✓</span>
                  )}
                </div>
                <div 
                  className={`text-sm font-medium ${
                    item.change.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'
                  }`}
                >
                  {item.change}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold">{item.floor}</div>
              <div className="text-[var(--os-text-secondary)] text-xs">Floor price</div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 border border-[var(--os-border)] rounded-xl font-bold hover:bg-[var(--os-surface-2)] transition-colors">
        View All Rankings
      </button>
    </div>
  );
};

export default RankingsSidebar;
