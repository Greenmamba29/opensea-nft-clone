import React from 'react';
import { Link, useLocation } from "react-router-dom";

type NavLink = { icon: string; label: string; href: string };

const mainLinks: NavLink[] = [
  { icon: "◎", label: "Atrium", href: "/mall" },
  { icon: "⊞", label: "Aisles", href: "/mall/aisles" },
  { icon: "🏪", label: "Stores", href: "/mall/stores" },
  { icon: "🛒", label: "Products", href: "/mall/products" },
  { icon: "💬", label: "Quotes", href: "/mall/quotes" },
  { icon: "≡", label: "Orders", href: "/mall/orders" },
  { icon: "⚡", label: "Rewards", href: "/mall/rewards" },
];

const accountLinks: NavLink[] = [
  { icon: "👤", label: "Buyer Dashboard", href: "/mall/profile" },
  { icon: "📋", label: "Tenant Studio", href: "/mall/studio" },
  { icon: "?", label: "Support", href: "/mall/support" },
  { icon: "⚙", label: "Settings", href: "/mall/settings" },
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
          GrahmOS Virtual Mall
        </span>
      </div>

      <nav className="mt-2 flex-1 space-y-1">
        {mainLinks.map((link) => (
          <SidebarLink key={link.label} link={link} active={isActive(pathname, link.href)} />
        ))}
        <div className="mx-3 my-3 border-t border-[var(--os-border)]" />
        {accountLinks.map((link) => (
          <SidebarLink key={link.label} link={link} active={isActive(pathname, link.href)} />
        ))}
      </nav>
    </aside>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/mall" ? pathname === "/mall" : pathname.startsWith(href);
}

function SidebarLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link
      to={link.href}
      className={`flex items-center px-[14px] py-3 transition-colors hover:bg-[var(--os-surface-2)] ${
        active ? "text-[var(--os-blue)] bg-[var(--os-surface-2)]" : "text-[var(--os-text)]"
      }`}
    >
      <span className="text-xl w-6 flex justify-center shrink-0">{link.icon}</span>
      <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {link.label}
      </span>
    </Link>
  );
}
