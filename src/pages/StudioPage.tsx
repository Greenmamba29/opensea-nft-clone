import React, { useState } from "react";

export default function StudioPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    { id: "contract", label: "Contract", badge: "DEPLOYED", icon: "📜" },
    { id: "details", label: "Collection Details", icon: "📋" },
    { id: "earnings", label: "Creator Earnings", icon: "💰" },
    { id: "media", label: "Media & Metadata", icon: "🖼️", children: ["Upload", "View", "Overview Page"] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-8 pb-4 border-b border-[var(--os-border)]">
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-secondary)] mb-4">
          <span className="hover:text-white cursor-pointer">Studio</span>
          <span>›</span>
          <span className="hover:text-white cursor-pointer">Edit Open Collection</span>
          <span>›</span>
          <span className="text-[var(--os-text)]">Customize Overview Page</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Collection Editor</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-[var(--os-border)] overflow-y-auto p-6 hidden lg:block">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeSection === item.id
                      ? "bg-[var(--os-surface-2)] text-[var(--os-text)]"
                      : "text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-2 py-0.5 bg-[var(--os-green)]/20 text-[var(--os-green)] rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
                {item.children && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child}
                        className="w-full text-left px-3 py-2 text-sm text-[var(--os-text-secondary)] hover:text-white rounded-lg hover:bg-[var(--os-surface-2)] transition-all"
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-3xl p-12 text-center mb-8">
              <div className="w-20 h-20 bg-[var(--os-surface-2)] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-[var(--os-border)]">
                🎨
              </div>
              <h3 className="text-xl font-black mb-3">Customize your collection</h3>
              <p className="text-[var(--os-text-secondary)] font-medium mb-8 max-w-md mx-auto">
                Add sections, images, and content to make your collection page stand out.
              </p>
              <button className="px-8 py-3 bg-[var(--os-blue)] text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                Add new section
              </button>
            </div>

            <button className="w-full py-4 bg-[var(--os-blue)] text-white rounded-2xl font-black text-lg hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">
              Publish Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
