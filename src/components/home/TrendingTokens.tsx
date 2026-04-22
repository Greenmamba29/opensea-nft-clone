import React from 'react';
import { trendingTokens } from '@/data/mock';

const TrendingTokens = () => {
  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Trending Tokens</h2>
          <p className="text-[var(--os-text-secondary)]">Token rankings by trading volume and performance</p>
        </div>
        <button className="text-[var(--os-blue)] font-bold hover:opacity-80 transition-opacity flex items-center gap-1">
          View all <span className="text-lg">→</span>
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-[var(--os-border)]">
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider">#</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider">Name</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">Price</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">1h %</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">24h %</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">30d %</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">Volume</th>
              <th className="py-4 font-bold text-[var(--os-text-secondary)] text-sm uppercase tracking-wider text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {trendingTokens.map((token, index) => (
              <tr 
                key={token.symbol}
                className="border-b border-[var(--os-border)]/50 hover:bg-[var(--os-surface-2)] transition-colors group cursor-pointer"
              >
                <td className="py-6 text-[var(--os-text-secondary)] font-medium">{index + 1}</td>
                <td className="py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--os-surface-3)] flex items-center justify-center font-bold text-xs">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-[var(--os-blue)] transition-colors">{token.name}</div>
                      <div className="text-[var(--os-text-secondary)] text-sm font-medium">{token.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-right font-bold">{token.price}</td>
                <td className={`py-6 text-right font-bold ${token.change1h.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'}`}>
                  {token.change1h}
                </td>
                <td className={`py-6 text-right font-bold ${token.change1d.startsWith('+') ? 'text-[var(--os-green)]' : 'text-[var(--os-red)]'}`}>
                  {token.change1d}
                </td>
                <td className={`py-6 text-right font-bold ${token.change30d.startsWith('+') ? 'text-[var(--os-green)]' : token.change30d === '—' ? 'text-[var(--os-text-secondary)]' : 'text-[var(--os-red)]'}`}>
                  {token.change30d}
                </td>
                <td className="py-6 text-right font-bold">{token.volume}</td>
                <td className="py-6 text-right font-bold text-[var(--os-text-secondary)]">{token.mcap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTokens;
