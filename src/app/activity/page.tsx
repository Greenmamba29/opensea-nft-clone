"use client";

import React from 'react';

export default function ActivityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-4">Activity</h1>
        
        <div className="flex items-center space-x-4 border-b border-[var(--os-border)]">
          <button className="px-6 py-4 text-sm font-bold border-b-2 border-[var(--os-text)]">Feed</button>
          <button className="px-6 py-4 text-sm font-bold text-[var(--os-text-secondary)] hover:text-white transition-colors">Alerts</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 bg-[var(--os-surface-2)] rounded-3xl flex items-center justify-center text-4xl mb-8 border border-[var(--os-border)]">
          🔔
        </div>
        <h2 className="text-2xl font-black mb-4">No activity yet</h2>
        <p className="text-[var(--os-text-secondary)] font-medium max-w-sm">
          Keep track of your trades, listings, and offers across all collections and chains in one place.
        </p>
        <button className="mt-8 px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-black hover:bg-blue-600 transition-all">
          Explore collections
        </button>
      </div>
    </div>
  );
}
