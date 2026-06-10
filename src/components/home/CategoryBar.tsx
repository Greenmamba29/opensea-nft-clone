import React from 'react';
import { Link } from 'react-router-dom';
import { AISLES } from '@/lib/mallData';

// Quick aisle navigation across the top of the Atrium.
const CategoryBar = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2">
          <Link
            to="/mall/aisles"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap bg-white text-black"
          >
            All Aisles
          </Link>
          {AISLES.map((aisle) => (
            <Link
              key={aisle.slug}
              to={`/mall/aisles/${aisle.slug}`}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap bg-[var(--os-surface-2)] text-[var(--os-text)] hover:bg-[var(--os-surface-3)] flex items-center gap-1.5"
            >
              <span>{aisle.icon}</span>
              <span>{aisle.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
