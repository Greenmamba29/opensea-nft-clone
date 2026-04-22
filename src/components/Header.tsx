import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 bg-os-bg/80 backdrop-blur-md flex items-center px-4 border-b border-[var(--os-border)]">
      {/* Search Bar */}
      <div className="flex-1 max-w-[600px] relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--os-text-tertiary)]">
          <span className="text-sm">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search Products, Marketplaces, or CAS #"
          className="w-full h-10 pl-10 pr-10 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl focus:border-[var(--os-blue)] transition-colors text-sm"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <kbd className="h-5 px-1.5 flex items-center justify-center bg-[var(--os-surface-3)] border border-[var(--os-border-light)] rounded text-[10px] text-[var(--os-text-secondary)] font-sans">
            K
          </kbd>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center ml-auto gap-3 text-sm font-semibold">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--os-surface-2)] cursor-pointer">
          <span className="text-lg">📈</span>
          <span>GMV: $680M</span>
        </div>
        
        <button className="p-2 rounded-lg hover:bg-[var(--os-surface-2)] text-xl">
          🔔
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--os-blue)] hover:bg-opacity-90 transition-colors">
          <span>Company Login</span>
        </button>
      </div>
    </header>
  );
}
