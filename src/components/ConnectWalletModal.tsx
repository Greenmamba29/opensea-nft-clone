import React from 'react';
import { walletOptions } from '@/data/mock';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[var(--os-surface)] border border-[var(--os-border)] rounded-[2rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 text-[var(--os-text-secondary)] hover:text-white transition-colors text-2xl"
        >
          ✕
        </button>

        <div className="flex flex-col items-center">
          <div className="text-5xl mb-6">⛵</div>
          <h2 className="text-2xl font-black mb-1">Connect with OpenSea</h2>
          <p className="text-[var(--os-text-secondary)] font-medium mb-8">Choose your preferred wallet</p>

          <div className="w-full space-y-3 mb-6">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.name}
                className="w-full flex items-center justify-between p-4 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-2xl hover:bg-[var(--os-surface-3)] hover:border-[var(--os-border-light)] transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="text-lg font-bold">{wallet.name}</span>
                </div>
                <span className="text-[var(--os-text-tertiary)] group-hover:text-white transition-colors">→</span>
              </button>
            ))}
            
            <button className="w-full text-center text-sm font-bold text-[var(--os-blue)] hover:underline pt-2">
              More Wallet Options
            </button>
          </div>

          <div className="w-full flex items-center space-x-4 mb-6">
            <div className="flex-1 h-px bg-[var(--os-border)]"></div>
            <span className="text-xs font-bold text-[var(--os-text-tertiary)] uppercase tracking-widest">or continue with email</span>
            <div className="flex-1 h-px bg-[var(--os-border)]"></div>
          </div>

          <div className="w-full relative mb-12">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[var(--os-blue)] transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--os-blue)] rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
              <span>→</span>
            </button>
          </div>

          <p className="text-[10px] text-[var(--os-text-tertiary)] font-bold text-center leading-relaxed max-w-xs">
            By connecting your wallet, you agree to our <span className="text-[var(--os-text-secondary)] hover:underline cursor-pointer">Terms of Service</span> and our <span className="text-[var(--os-text-secondary)] hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
