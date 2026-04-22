import React, { useState } from 'react';
import { trendingTokens, chains } from '@/data/mock';

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedChain, setSelectedChain] = useState('All');
  const [marketCapFilter, setMarketCapFilter] = useState('$100K-$500K');

  const marketCapOptions = [
    "<$100K", "$100K-$500K", "$500K-$1M", "$1M-$10M", "$10M-$100M", "$100M-$1B", "$1B+"
  ];

  const activeFilters = [
    { label: "Market Cap: $100K-$500K", id: "mcap" },
    { label: "Chain: Ethereum", id: "chain" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-4 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Tokens</h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('trending')}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'trending' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              <span>🔥</span>
              <span>Trending</span>
            </button>
            <button 
              onClick={() => setActiveTab('top')}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'top' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              <span>👑</span>
              <span>Top</span>
            </button>
            <button 
              onClick={() => setActiveTab('new')}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-all font-semibold ${activeTab === 'new' ? 'border-[var(--os-text)] text-[var(--os-text)]' : 'border-transparent text-[var(--os-text-secondary)] hover:text-[var(--os-text)]'}`}
            >
              <span>✨</span>
              <span>New</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-[var(--os-border)] overflow-y-auto p-6 hidden lg:block">
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)] mb-4">Chain</h3>
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search chains" 
                className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-[var(--os-blue)]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--os-surface-3)] border border-[var(--os-blue)] rounded-full text-xs font-semibold text-[var(--os-blue)]">
                <span>All</span>
              </button>
              {chains.slice(0, 5).map((chain) => (
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

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)] mb-4">Market Cap</h3>
            <div className="space-y-1">
              {marketCapOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMarketCapFilter(opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${marketCapFilter === opt ? 'bg-[var(--os-surface-2)] font-semibold border border-[var(--os-border)]' : 'text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)] hover:text-[var(--os-text)]'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center cursor-pointer hover:text-[var(--os-blue)]">
            <span className="font-semibold">Category</span>
            <span>⌄</span>
          </div>

          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center">
            <span className="font-semibold">Has NFT</span>
            <div className="w-10 h-5 bg-[var(--os-surface-3)] rounded-full relative cursor-pointer">
              <div className="w-3.5 h-3.5 bg-[var(--os-text-tertiary)] rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>

          <div className="border-t border-[var(--os-border)] py-4 flex justify-between items-center">
            <span className="font-semibold">Branded Token Page</span>
            <div className="w-10 h-5 bg-[var(--os-blue)] rounded-full relative cursor-pointer">
              <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Filters */}
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2 bg-[var(--os-surface-2)] px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--os-border)]">
                <span>{filter.label}</span>
                <button className="text-[var(--os-text-secondary)] hover:text-[var(--os-text)]">✕</button>
              </div>
            ))}
            <button className="text-xs font-bold text-[var(--os-blue)] hover:underline px-2">Clear all</button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--os-bg)] z-10 shadow-sm">
              <tr className="border-b border-[var(--os-border)] text-[var(--os-text-secondary)] text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">1h Change</th>
                <th className="px-6 py-4 text-right bg-[var(--os-surface)]">1d Change</th>
                <th className="px-6 py-4 text-right">30d Change</th>
                <th className="px-6 py-4 text-right">1d Vol</th>
                <th className="px-6 py-4 text-right">Market Cap</th>
                <th className="px-6 py-4 text-right">Supply</th>
                <th className="px-6 py-4 text-right">FDV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {trendingTokens.map((token, i) => (
                <tr key={token.symbol} className="hover:bg-[var(--os-surface)] transition-colors cursor-pointer group">
                  <td className="px-6 py-5 text-[var(--os-text-secondary)] font-medium">{i + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--os-blue)] to-[var(--os-green)] flex items-center justify-center font-bold text-xs">
                        {token.symbol[0]}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold group-hover:text-[var(--os-blue)] transition-colors">{token.name}</span>
                          {i === 0 && <span className="bg-[var(--os-blue)] text-white text-[10px] px-1 rounded font-bold">NEW</span>}
                        </div>
                        <span className="text-[var(--os-text-secondary)] text-xs font-medium">{token.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-semibold">{token.price}</td>
                  <td className={`px-6 py-5 text-right font-semibold ${token.change1h.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'}`}>
                    {token.change1h}
                  </td>
                  <td className={`px-6 py-5 text-right font-bold bg-[var(--os-surface)] ${token.change1d.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'}`}>
                    {token.change1d}
                  </td>
                  <td className={`px-6 py-5 text-right font-semibold ${token.change30d.startsWith('+') ? 'text-[var(--os-green)]' : (token.change30d === '—' ? 'text-[var(--os-text-tertiary)]' : 'text-[var(--os-red)]')}`}>
                    {token.change30d}
                  </td>
                  <td className="px-6 py-5 text-right font-semibold">{token.volume}</td>
                  <td className="px-6 py-5 text-right font-semibold">{token.mcap}</td>
                  <td className="px-6 py-5 text-right font-semibold">1B</td>
                  <td className="px-6 py-5 text-right font-semibold">$1.2M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
