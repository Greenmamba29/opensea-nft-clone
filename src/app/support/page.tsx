"use client";

import React from "react";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">Support</h1>
        <p className="text-[var(--os-text-secondary)] font-medium">How can we help you?</p>
      </div>

      <div className="flex-1 p-12 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "📖", title: "Help Center", desc: "Browse articles and guides" },
            { icon: "💬", title: "Contact Us", desc: "Submit a support request" },
            { icon: "🐛", title: "Report a Bug", desc: "Help us improve OpenSea" },
            { icon: "💡", title: "Feature Request", desc: "Suggest new features" },
          ].map((item) => (
            <button
              key={item.title}
              className="flex items-start gap-4 p-6 bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl hover:bg-[var(--os-surface-2)] hover:border-[var(--os-border-light)] transition-all text-left group"
            >
              <div className="w-12 h-12 bg-[var(--os-surface-2)] rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold mb-1 group-hover:text-[var(--os-blue)] transition-colors">{item.title}</h3>
                <p className="text-sm text-[var(--os-text-secondary)]">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
