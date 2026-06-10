import React from "react";

export default function DropsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">New Openings</h1>
        <p className="text-[var(--os-text-secondary)] font-medium">Storefronts opening soon across the mall</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 bg-[var(--os-surface-2)] rounded-3xl flex items-center justify-center text-4xl mb-8 border border-[var(--os-border)]">
          ↓
        </div>
        <h2 className="text-2xl font-black mb-4">No openings announced yet</h2>
        <p className="text-[var(--os-text-secondary)] font-medium max-w-sm">
          Check back soon — new storefronts and pop-ups open in the mall every month.
        </p>
      </div>
    </div>
  );
}
