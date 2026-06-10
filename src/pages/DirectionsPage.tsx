import React from 'react';
import { Link } from 'react-router-dom';

/** Stub for Guided Mode — the Directions agent wires the real experience here. */
export default function DirectionsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] p-12 text-center">
      <div className="w-24 h-24 bg-[var(--os-blue)]/15 border border-[var(--os-blue)]/30 rounded-3xl flex items-center justify-center text-4xl mb-8">
        🧭
      </div>
      <h1 className="text-3xl font-black tracking-tight mb-4">Guided Mode — coming online</h1>
      <p className="text-[var(--os-text-secondary)] font-medium max-w-md mb-8">
        Soon, GrahmOS will walk you through the mall — ask for what you need and get
        turn-by-turn directions to the right aisle, store, and product.
      </p>
      <Link
        to="/mall"
        className="px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:brightness-110 transition-all"
      >
        Back to the Atrium
      </Link>
    </div>
  );
}
