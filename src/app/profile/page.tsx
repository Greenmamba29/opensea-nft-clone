"use client";

import React, { useState } from 'react';
import { nftItems, chains, collections } from '@/data/mock';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('nfts');
  const [activeStatus, setActiveStatus] = useState('All');

  const tabs = [
    "Galleries", "NFTs", "Tokens", "Listings", "Offers", 
    "Portfolio", "Created", "Watchlist", "Favorites", "Activity"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-[var(--os-blue)] via-purple-600 to-[var(--os-red)] w-full"></div>

      <div className="px-8 -mt-16 relative z-10 flex flex-col md:flex-row items-end md:items-start justify-between pb-8 border-b border-[var(--os-border)]">
        <div className="flex flex-col md:flex-row items-end md:items-start space-x-0 md:space-x-8">
          <div className="w-32 h-32 rounded-3xl border-4 border-[var(--os-bg)] bg-[var(--os-surface-2)] shadow-xl overflow-hidden flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="mt-4 md:mt-20 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black tracking-tight">0xdeaf...fb8b</h1>
              <div className="flex items-center space-x-1.5">
                <button className="p-1.5 hover:bg-[var(--os-surface-2)] rounded-lg text-[var(--os-text-secondary)] transition-colors">✎</button>
                <button className="p-1.5 hover:bg-[var(--os-surface-2)] rounded-lg text-[var(--os-text-secondary)] transition-colors">📄</button>
                <button className="p-1.5 hover:bg-[var(--os-surface-2)] rounded-lg text-[var(--os-text-secondary)] transition-colors">⋮</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <span className="px-3 py-1 bg-[var(--os-surface-2)] text-[var(--os-text-secondary)] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[var(--os-border)]">JOINED JUN 2023</span>
              <span className="px-3 py-1 bg-[var(--os-surface-2)] text-[var(--os-text-secondary)] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[var(--os-border)]">DEAF7A</span>
              <span className="px-3 py-1 bg-[var(--os-blue)]/10 text-[var(--os-blue)] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[var(--os-blue)]/20">0 XP</span>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-[var(--os-surface-2)] p-6 rounded-2xl border border-[var(--os-border)]">
          <div>
            <div className="text-[var(--os-text-tertiary)] text-[10px] font-bold uppercase mb-1">Portfolio Value</div>
            <div className="text-lg font-black">0.45 ETH</div>
          </div>
          <div>
            <div className="text-[var(--os-text-tertiary)] text-[10px] font-bold uppercase mb-1">USD Value</div>
            <div className="text-lg font-black text-[var(--os-text-secondary)]">$1.2K</div>
          </div>
          <div>
            <div className="text-[var(--os-text-tertiary)] text-[10px] font-bold uppercase mb-1">NFTs</div>
            <div className="text-lg font-black text-[var(--os-green)]">42%</div>
          </div>
          <div>
            <div className="text-[var(--os-text-tertiary)] text-[10px] font-bold uppercase mb-1">Tokens</div>
            <div className="text-lg font-black text-[var(--os-blue)]">58%</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-[var(--os-border)] overflow-x-auto no-scrollbar flex items-center space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-6 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.toLowerCase() ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-[var(--os-border)] overflow-y-auto p-6 hidden lg:block">
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)] mb-4">Status</h3>
            <div className="space-y-1">
              {['All', 'Listed', 'Not Listed', 'Hidden'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeStatus === status ? 'bg-[var(--os-surface-2)] font-semibold' : 'text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)] hover:text-[var(--os-text)]'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center cursor-pointer hover:text-[var(--os-blue)] transition-colors">
            <span className="font-semibold">Chains</span>
            <span>⌄</span>
          </div>
          
          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center cursor-pointer hover:text-[var(--os-blue)] transition-colors">
            <span className="font-semibold">Collections</span>
            <span>⌄</span>
          </div>
        </div>

        {/* NFT Grid Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-8 space-x-4">
            <div className="relative flex-1 max-w-lg">
              <input 
                type="text" 
                placeholder="Search by name" 
                className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-2 px-4 pl-10 text-sm focus:outline-none focus:border-[var(--os-blue)]"
              />
              <span className="absolute left-4 top-2 text-[var(--os-text-tertiary)]">🔍</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select className="bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-2 px-4 text-sm font-semibold outline-none">
                <option>Recently received</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Recently listed</option>
              </select>
              
              <div className="flex items-center space-x-1 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl p-1">
                <button className="p-1.5 bg-[var(--os-surface-3)] rounded-lg text-sm shadow-sm">⊞</button>
                <button className="p-1.5 hover:bg-[var(--os-surface-3)] rounded-lg text-sm text-[var(--os-text-secondary)]">▦</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {nftItems.map((nft) => (
              <div key={nft.id} className="group bg-[var(--os-surface-2)] rounded-2xl overflow-hidden border border-[var(--os-border)] hover:border-[var(--os-border-light)] transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-square relative bg-[var(--os-surface-3)] flex items-center justify-center text-6xl">
                  {nft.image}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center text-xs">
                    ◆
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[var(--os-text-secondary)] text-[10px] font-bold uppercase truncate max-w-[70%]">Pudgy Penguins</span>
                    <span className="text-[var(--os-text-tertiary)] text-[10px] font-bold">#{nft.rarity}</span>
                  </div>
                  <div className="font-bold text-sm mb-3 truncate">{nft.name}</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[var(--os-text-tertiary)] text-[10px] font-bold uppercase">Price</div>
                      <div className="font-black text-sm">{nft.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[var(--os-text-tertiary)] text-[10px] font-bold uppercase">Last Sale</div>
                      <div className="font-black text-xs text-[var(--os-text-secondary)]">{nft.lastSale}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
