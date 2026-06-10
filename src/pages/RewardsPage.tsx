import React from 'react';

export default function RewardsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] overflow-hidden">
      {/* Animated Background Icons */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] text-6xl opacity-20 animate-bounce transition-all delay-0">💎</div>
        <div className="absolute top-40 right-[15%] text-7xl opacity-10 animate-pulse transition-all delay-1000">🏺</div>
        <div className="absolute top-80 left-[30%] text-8xl opacity-15 animate-bounce transition-all delay-500">🗺️</div>
        <div className="absolute bottom-40 right-[10%] text-7xl opacity-20 animate-pulse transition-all delay-300">📦</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10 max-w-4xl mx-auto">
        <div className="w-40 h-40 bg-[var(--os-blue)]/20 rounded-full flex items-center justify-center text-7xl mb-12 shadow-2xl shadow-[var(--os-blue)]/30 border border-[var(--os-blue)]/30 animate-pulse">
          ⚡
        </div>
        
        <h1 className="text-6xl font-black mb-8 tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
          GrahmOS Rewards
        </h1>

        <p className="text-xl text-[var(--os-text-secondary)] font-bold mb-12 max-w-2xl leading-relaxed">
          Earn points every time you shop, source, and explore the mall — and spend them at any storefront.
        </p>

        <button className="px-12 py-5 bg-[var(--os-blue)] text-white rounded-2xl font-black text-2xl hover:brightness-110 shadow-2xl shadow-purple-500/40 hover:-translate-y-1 transition-all">
          Start Earning
        </button>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          <div className="bg-[var(--os-surface-2)]/50 backdrop-blur-md p-8 rounded-3xl border border-[var(--os-border)] hover:border-[var(--os-blue)]/50 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="font-black mb-2 uppercase tracking-widest text-xs">Shop the Aisles</h3>
            <p className="text-sm text-[var(--os-text-secondary)] font-bold">Earn points on every order, in every aisle.</p>
          </div>

          <div className="bg-[var(--os-surface-2)]/50 backdrop-blur-md p-8 rounded-3xl border border-[var(--os-border)] hover:border-yellow-500/50 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🏆</div>
            <h3 className="font-black mb-2 uppercase tracking-widest text-xs">Unlock Perks</h3>
            <p className="text-sm text-[var(--os-text-secondary)] font-bold">Member pricing and early access at top stores.</p>
          </div>

          <div className="bg-[var(--os-surface-2)]/50 backdrop-blur-md p-8 rounded-3xl border border-[var(--os-border)] hover:border-purple-500/50 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">📦</div>
            <h3 className="font-black mb-2 uppercase tracking-widest text-xs">Free Deliveries</h3>
            <p className="text-sm text-[var(--os-text-secondary)] font-bold">Redeem points for shipping on any order.</p>
          </div>

          <div className="bg-[var(--os-surface-2)]/50 backdrop-blur-md p-8 rounded-3xl border border-[var(--os-border)] hover:border-[var(--os-green)]/50 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="font-black mb-2 uppercase tracking-widest text-xs">White-Glove Care</h3>
            <p className="text-sm text-[var(--os-text-secondary)] font-bold">Top members get a dedicated GrahmOS agent.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
