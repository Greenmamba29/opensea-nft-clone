import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { icon: "◎", label: "Market Hub", href: "/mall" },
  { icon: "⊞", label: "Marketplaces", href: "/mall/rankings" },
  { icon: "◐", label: "Price Index", href: "/mall/tokens" },
  { icon: "≡", label: "Order Activity", href: "/mall/activity" },
  { icon: "↓", label: "New Drops", href: "/mall/drops" },
  { icon: "⚡", label: "Rewards", href: "/mall/rewards" },
  { icon: "👤", label: "Buyer Dash", href: "/mall/profile" },
  { icon: "📋", label: "Supplier Portal", href: "/mall/studio" },
  { icon: "⚙", label: "Settings", href: "/mall/settings" },
  { icon: "?", label: "Support", href: "/mall/support" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      className="group fixed left-0 top-0 h-full w-[52px] hover:w-[200px] bg-[var(--os-surface)] border-r border-[var(--os-border)] transition-all duration-200 ease-in-out z-50 overflow-hidden flex flex-col"
    >
      <div className="h-14 flex items-center px-4 shrink-0">
        <span className="text-2xl">🏛️</span>
        <span className="ml-3 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          GrahmOS Market
        </span>
      </div>

      <nav className="mt-2 flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center px-[14px] py-3 transition-colors hover:bg-[var(--os-surface-2)] ${
                isActive ? "text-[var(--os-blue)] bg-[var(--os-surface-2)]" : "text-[var(--os-text)]"
              }`}
            >
              <span className="text-xl w-6 flex justify-center shrink-0">
                {link.icon}
              </span>
              <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
