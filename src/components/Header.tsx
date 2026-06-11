import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRoute } from "@/lib/routeContext";
import { useGrahmOSAuth } from "@/auth/auth-context";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { route } = useRoute();
  const { user, signIn, signOut } = useGrahmOSAuth();
  const guided = pathname.startsWith("/mall/directions");
  const routeActive = Boolean(route);

  // Search routes to the Products page with the query applied. "K" focuses it.
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (!typing && e.key.toLowerCase() === "k" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      navigate(`/mall/products?q=${encodeURIComponent(term)}`);
      setQ("");
      searchRef.current?.blur();
    }
  }

  return (
    <header className="sticky top-0 z-40 h-14 bg-os-bg/80 backdrop-blur-md flex items-center px-4 border-b border-[var(--os-border)] gap-4">
      {/* Wordmark */}
      <Link to="/mall" className="flex items-center gap-2 font-black tracking-tight whitespace-nowrap">
        <span>GrahmOS</span>
        <span className="text-[var(--os-gold)]">✦</span>
        <span className="hidden md:inline text-[var(--os-text-secondary)] font-bold">Virtual Mall</span>
      </Link>

      {/* Browse / Guided mode toggle */}
      <div className="flex bg-[var(--os-surface-2)] rounded-xl p-1 text-sm font-bold">
        <Link
          to="/mall"
          className={`px-3 py-1 rounded-lg transition-colors ${
            !guided ? "bg-[var(--os-surface-3)]" : "text-[var(--os-text-secondary)] hover:text-[var(--os-text)]"
          }`}
        >
          Browse
        </Link>
        <Link
          to="/mall/directions"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
            guided || routeActive
              ? "bg-[var(--os-surface-3)]"
              : "text-[var(--os-text-secondary)] hover:text-[var(--os-text)]"
          }`}
        >
          Guided
          {routeActive && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--os-blue)]"
              title="Route in progress"
            />
          )}
        </Link>
      </div>

      {/* Search — routes to /mall/products?q=… */}
      <form onSubmit={submitSearch} className="flex-1 max-w-[600px] relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--os-text-tertiary)]">
          <span className="text-sm">🔍</span>
        </div>
        <input
          ref={searchRef}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search storefronts, products, or aisles"
          className="w-full h-10 pl-10 pr-10 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl focus:border-[var(--os-blue)] transition-colors text-sm"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <kbd className="h-5 px-1.5 flex items-center justify-center bg-[var(--os-surface-3)] border border-[var(--os-border-light)] rounded text-[10px] text-[var(--os-text-secondary)] font-sans">
            K
          </kbd>
        </div>
      </form>

      {/* Right Side Actions */}
      <div className="flex items-center ml-auto gap-3 text-sm font-semibold">
        {user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--os-surface-2)] hover:bg-[var(--os-surface-3)] transition-colors"
            title={user.email}
          >
            <span>Sign out</span>
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--os-blue)] hover:bg-opacity-90 transition-colors"
          >
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
}
