"use client";

import React, { useState } from "react";
import { nftItems, traits, collections } from "@/data/mock";

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState("Items");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const collection = collections[0]; // Pudgy Penguins

  return (
    <div className="min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] font-sans">
      {/* Header Section */}
      <div className="relative">
        <div 
          className="h-64 w-full bg-gradient-to-r from-[#0b0e11] via-[#1a1d21] to-[#0b0e11]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2a2d33 1px, transparent 0)', backgroundSize: '40px 40px' }}
        ></div>
        <div className="px-8 -mt-16 relative z-10">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <div className="w-32 h-32 rounded-2xl bg-[var(--os-surface-2)] border-4 border-[var(--os-bg)] flex items-center justify-center text-6xl shadow-xl mb-4">
                🐧
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{collection.name}</h1>
                <span className="text-[var(--os-blue)] text-xl">✔️</span>
                <span className="text-[var(--os-text-secondary)] cursor-pointer hover:text-white">★</span>
              </div>
              
              <div className="flex gap-4 items-center mb-6">
                <div className="flex gap-2">
                  <IconButton icon="ℹ️" />
                  <IconButton icon="🔗" />
                  <IconButton icon="🌐" />
                  <IconButton icon="𝕏" />
                  <IconButton icon="⋯" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <Badge text="BY THEIGLOCOMP..." secondary />
                <Badge text="ETHEREUM" />
                <Badge text="8,888 ITEMS" />
                <Badge text="JUL 2021" />
                <Badge text="PFPS" />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-8 mb-8 overflow-x-auto pb-4">
            <Stat label="FLOOR PRICE" value="$44.7K" />
            <Stat label="1D FLOOR %" value="+5.2%" color="var(--os-green)" />
            <Stat label="TOP OFFER" value="$43.7K" />
            <Stat label="24H VOLUME" value="$1.8M" />
            <Stat label="TOTAL VOLUME" value="$1.2B" />
            <Stat label="OWNERS (UNIQUE)" value="4,966 (55.9%)" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-8 border-b border-[var(--os-border)] mb-6 flex gap-8">
        {["Explore", "Items", "Tokens", "Offers", "Holders", "Traits", "Activity", "About"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold relative ${
              activeTab === tab ? "text-[var(--os-text)]" : "text-[var(--os-text-secondary)] hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--os-blue)] rounded-t-lg"></div>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex px-8 pb-32">
        {/* Sidebar */}
        {isSidebarOpen ? (
          <div className="w-[260px] flex-shrink-0 pr-6 border-r border-[var(--os-border)]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Filters</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-[var(--os-text-secondary)]">«</button>
            </div>
            
            <FilterSection title="Status">
              <ToggleRow label="All" active />
              <ToggleRow label="Listed" />
              <ToggleRow label="Owned by you" />
            </FilterSection>

            <Accordion title="Rarity" />
            <Accordion title="Price" />
            <Accordion title="Marketplaces" />
            
            <Accordion title="Traits" open>
              {traits.map((trait) => (
                <div key={trait.category} className="flex justify-between items-center py-2 text-sm text-[var(--os-text-secondary)] hover:text-white cursor-pointer">
                  <span>{trait.category}</span>
                  <span>{trait.count}</span>
                </div>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="w-12 flex-shrink-0 border-r border-[var(--os-border)] flex flex-col items-center pt-2">
            <button onClick={() => setIsSidebarOpen(true)} className="text-[var(--os-text-secondary)]">»</button>
          </div>
        )}

        {/* Main Grid */}
        <div className="flex-grow pl-6">
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by item or trait"
                className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[var(--os-text-secondary)]"
              />
              <span className="absolute left-3 top-2.5 text-[var(--os-text-secondary)]">🔍</span>
            </div>
            
            <div className="flex gap-2">
              <select className="bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl px-4 py-2 text-sm focus:outline-none">
                <option>Price low to high</option>
                <option>Price high to low</option>
                <option>Recently listed</option>
              </select>
              
              <div className="flex border border-[var(--os-border)] rounded-xl overflow-hidden">
                <button className="px-3 py-2 bg-[var(--os-surface-3)]">田</button>
                <button className="px-3 py-2 hover:bg-[var(--os-surface-2)]">grid</button>
                <button className="px-3 py-2 hover:bg-[var(--os-surface-2)]">compact</button>
                <button className="px-3 py-2 hover:bg-[var(--os-surface-2)]">list</button>
              </div>
              
              <button className="bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl px-4 py-2 text-sm font-semibold">Insights</button>
            </div>
          </div>

          <div className="text-xs font-bold text-[var(--os-text-secondary)] mb-4">8,888 ITEMS</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nftItems.map((item) => (
              <NFTCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sweep Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--os-surface)] border-t border-[var(--os-border)] p-4 flex items-center justify-between z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex bg-[var(--os-surface-2)] rounded-lg p-1">
            <button className="px-4 py-1.5 rounded-md bg-[var(--os-surface-3)] text-sm font-bold">Buy</button>
            <button className="px-4 py-1.5 rounded-md hover:bg-[var(--os-surface-3)] text-sm font-bold text-[var(--os-text-secondary)]">Sell</button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-[var(--os-surface-2)] flex items-center justify-center border border-[var(--os-border)]">-</button>
            <div className="w-12 text-center font-bold">1</div>
            <button className="w-8 h-8 rounded-full bg-[var(--os-surface-2)] flex items-center justify-center border border-[var(--os-border)]">+</button>
          </div>

          <div className="h-8 w-px bg-[var(--os-border)]"></div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[var(--os-text-secondary)] text-xs mb-1">
              Max Price Per Item <span className="cursor-help text-[10px] border border-[var(--os-text-secondary)] rounded-full w-3 h-3 flex items-center justify-center">i</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value="0" readOnly className="bg-transparent font-bold w-8 focus:outline-none" />
              <select className="bg-transparent text-xs font-bold focus:outline-none">
                <option>USD</option>
                <option>ETH</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-3 border border-[var(--os-border)] rounded-xl font-bold text-sm hover:bg-[var(--os-surface-2)]">Make collection offer</button>
          <button className="px-8 py-3 bg-[var(--os-blue)] rounded-xl font-bold text-sm hover:brightness-110">Buy floor</button>
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon }: { icon: string }) {
  return (
    <button className="w-10 h-10 rounded-xl border border-[var(--os-border)] flex items-center justify-center hover:bg-[var(--os-surface-2)] transition-colors">
      {icon}
    </button>
  );
}

function Badge({ text, secondary }: { text: string; secondary?: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
      secondary ? "border-[var(--os-border)] bg-[var(--os-surface-2)]" : "border-[var(--os-border)]"
    }`}>
      {text}
    </span>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col min-w-max">
      <span className="text-[var(--os-text-secondary)] text-[10px] font-bold mb-1">{label}</span>
      <span className="text-xl font-bold" style={{ color: color }}>{value}</span>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-[var(--os-text-secondary)] mb-4 uppercase tracking-wider">{title}</div>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm font-semibold">{label}</span>
      <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${active ? "bg-[var(--os-blue)]" : "bg-[var(--os-surface-3)]"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${active ? "right-0.5" : "left-0.5"}`}></div>
      </div>
    </div>
  );
}

function Accordion({ title, children, open = false }: { title: string; children?: React.ReactNode; open?: boolean }) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="border-t border-[var(--os-border)] py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center font-bold text-sm"
      >
        {title}
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function NFTCard({ item }: { item: any }) {
  return (
    <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl overflow-hidden group cursor-pointer hover:border-[var(--os-text-secondary)] transition-all">
      <div className="aspect-square flex items-center justify-center text-8xl" style={{ backgroundColor: `hsl(${item.id * 40 % 360}, 50%, 20%)` }}>
        {item.image}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm truncate">{item.name}</span>
        </div>
        <div className="flex items-center gap-1 text-[var(--os-text-secondary)] text-[10px] font-bold mb-3">
          <span className="text-[var(--os-blue)]">💠</span> #{item.rarity}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{item.price}</span>
          <span className="text-[var(--os-text-secondary)] text-xs">Last sale {item.lastSale}</span>
        </div>
      </div>
    </div>
  );
}
