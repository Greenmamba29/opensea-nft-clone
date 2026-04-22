"use client";

import React, { useState } from 'react';
import { collections, chains } from '@/data/mock';

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState('top');
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeFilter, setTimeFilter] = useState('1d');
  const [assetType, setAssetType] = useState<'nfts' | 'tokens'>('nfts');

  const categories = [
    "All", "Art", "Gaming", "Memberships", "Music", "PFPs", "Photography", 
    "Domain Names", "Sports Collectibles", "Virtual Worlds"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-4 border-b border-[var(--os-border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 bg-[var(--os-surface-2)] p-1 rounded-xl">
            <button 
              onClick={() => setAssetType('nfts')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${assetType === 'nfts' ? 'bg-[var(--os-surface-3)] shadow-sm' : 'text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              NFTs
            </button>
            <button 
              onClick={() => setAssetType('tokens')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${assetType === 'tokens' ? 'bg-[var(--os-surface-3)] shadow-sm' : 'text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              Tokens
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('top')}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'top' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              <span>👑</span>
              <span>Top</span>
            </button>
            <button 
              onClick={() => setActiveTab('trending')}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'trending' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              <span>🔥</span>
              <span>Trending</span>
            </button>
            <button 
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'watchlist' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              <span>⭐</span>
              <span>Watchlist</span>
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-[var(--os-surface-2)] p-1 rounded-xl mb-4">
            {['All', '30d', '7d', '1d', '1h', '15m', '5m', '1m'].map((time) => (
              <button
                key={time}
                onClick={() => setTimeFilter(time)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${timeFilter === time ? 'bg-[var(--os-surface-3)]' : 'text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-[var(--os-border)] overflow-y-auto p-6 hidden lg:block">
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)] mb-4">Category</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeCategory === cat ? 'bg-[var(--os-surface-2)] font-semibold' : 'text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)] hover:text-[var(--os-text)]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)] mb-4">Chains</h3>
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search chains" 
                className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-[var(--os-blue)]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {chains.slice(0, 8).map((chain) => (
                <button 
                  key={chain.name}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-full text-xs font-semibold hover:border-[var(--os-border-light)] transition-all"
                >
                  <span>{chain.icon}</span>
                  <span>{chain.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center cursor-pointer hover:text-[var(--os-blue)]">
            <span className="font-semibold">Floor Price</span>
            <span>⌄</span>
          </div>
          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center cursor-pointer hover:text-[var(--os-blue)]">
            <span className="font-semibold">Top Offer</span>
            <span>⌄</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--os-bg)] z-10">
              <tr className="border-b border-[var(--os-border)] text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4">Collection</th>
                <th className="px-6 py-4 text-right">Floor Price</th>
                <th className="px-6 py-4 text-right">1d Change</th>
                <th className="px-6 py-4 text-right">Top Offer</th>
                <th className="px-6 py-4 text-right bg-[var(--os-surface)]">1d Vol</th>
                <th className="px-6 py-4 text-right">1d Sales</th>
                <th className="px-6 py-4 text-right">Owners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {collections.map((col, i) => (
                <tr key={col.name} className="hover:bg-[var(--os-surface)] transition-colors cursor-pointer group">
                  <td className="px-6 py-5 text-[var(--os-text-secondary)] font-medium">{i + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <span className="text-[var(--os-text-tertiary)] hover:text-yellow-400 transition-colors">☆</span>
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--os-surface-3)] flex items-center justify-center text-2xl">
                        {col.image}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold group-hover:text-[var(--os-blue)] transition-colors">{col.name}</span>
                          {col.verified && <span className="text-[var(--os-blue)] text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-semibold">{col.floor}</td>
                  <td className={`px-6 py-5 text-right font-semibold ${col.change.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'}`}>
                    {col.change}
                  </td>
                  <td className="px-6 py-5 text-right font-semibold">{(Math.random() * 50).toFixed(2)} ETH</td>
                  <td className="px-6 py-5 text-right font-bold bg-[var(--os-surface)]">{col.volume}</td>
                  <td className="px-6 py-5 text-right font-semibold">{Math.floor(Math.random() * 100)}</td>
                  <td className="px-6 py-5 text-right font-semibold">{(col.owners / 1000).toFixed(1)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
