import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-[52px] right-0 h-9 bg-[var(--os-surface)] border-t border-[var(--os-border)] px-4 flex items-center justify-between text-[11px] font-mono text-[var(--os-text-secondary)] z-40">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--os-green)]"></span>
          <span>Live</span>
        </div>
        <div className="flex items-center gap-1">
          <span>✦</span>
          <span>Concierge online</span>
        </div>
        <Link to="/mall/directions" className="hover:text-[var(--os-text)]">Mall Map</Link>
      </div>

      {/* Center */}
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-[var(--os-text)]">Terms of Service</a>
        <a href="#" className="hover:text-[var(--os-text)]">Privacy Policy</a>
        <span className="text-sm">👾</span>
        <span className="text-sm">𝕏</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span>🏗️</span>
          <span>Launch cohort: Brooklyn Navy Yard</span>
        </div>
        <Link to="/mall/support" className="hover:text-[var(--os-text)]">Support</Link>
        <div className="flex items-center gap-3 border-l border-[var(--os-border)] pl-4 h-full">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--os-text)]">
            <span>USD</span>
            <span>▼</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
