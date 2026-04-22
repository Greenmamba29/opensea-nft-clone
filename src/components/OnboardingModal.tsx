import React, { useState, useEffect } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'collector' | 'pro'>('collector');
  const [currency, setCurrency] = useState<'crypto' | 'usd'>('crypto');

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  if (!isOpen) return null;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[var(--os-surface)] border border-[var(--os-border)] rounded-[3rem] shadow-2xl overflow-hidden p-12 min-h-[600px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
        
        {/* Step Indicator Dots */}
        {step < 4 && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center space-x-3">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === s ? 'bg-[var(--os-blue)] scale-125' : 'bg-[var(--os-border-light)]'}`}
              ></div>
            ))}
          </div>
        )}

        {/* Step 1: Mode Choice */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-right duration-300">
            <h2 className="text-4xl font-black mb-4 text-center">Built for both collectors and pros</h2>
            <p className="text-[var(--os-text-secondary)] font-bold mb-12 text-center text-lg">Choose your preferred way to explore OpenSea</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
              <button 
                onClick={() => setMode('collector')}
                className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center group text-center ${mode === 'collector' ? 'bg-[var(--os-blue)]/10 border-[var(--os-blue)]' : 'bg-[var(--os-surface-2)] border-[var(--os-border)] hover:border-[var(--os-border-light)]'}`}
              >
                <div className="w-16 h-16 bg-[var(--os-surface-3)] rounded-2xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl">🖼️</div>
                <h3 className="text-xl font-black mb-3">Collector Mode</h3>
                <p className="text-sm text-[var(--os-text-secondary)] font-bold">Simplified interface focused on discovery and art.</p>
              </button>
              
              <button 
                onClick={() => setMode('pro')}
                className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center group text-center ${mode === 'pro' ? 'bg-[var(--os-blue)]/10 border-[var(--os-blue)]' : 'bg-[var(--os-surface-2)] border-[var(--os-border)] hover:border-[var(--os-border-light)]'}`}
              >
                <div className="w-16 h-16 bg-[var(--os-surface-3)] rounded-2xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl">📊</div>
                <h3 className="text-xl font-black mb-3">Pro Mode</h3>
                <p className="text-sm text-[var(--os-text-secondary)] font-bold">Advanced charts, multi-tab data, and bulk tools.</p>
              </button>
            </div>
            
            <button 
              onClick={nextStep}
              className="px-16 py-5 bg-[var(--os-blue)] text-white rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Currency Choice */}
        {step === 2 && (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-right duration-300">
            <button onClick={prevStep} className="absolute top-12 left-12 text-[var(--os-text-secondary)] hover:text-white font-black text-sm">← BACK</button>
            <h2 className="text-4xl font-black mb-4 text-center">Choose your display currency</h2>
            <p className="text-[var(--os-text-secondary)] font-bold mb-12 text-center text-lg">You can change this anytime in settings</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
              <button 
                onClick={() => setCurrency('crypto')}
                className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center group text-center ${currency === 'crypto' ? 'bg-[var(--os-blue)]/10 border-[var(--os-blue)]' : 'bg-[var(--os-surface-2)] border-[var(--os-border)] hover:border-[var(--os-border-light)]'}`}
              >
                <div className="w-16 h-16 bg-[var(--os-surface-3)] rounded-2xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl">◆</div>
                <h3 className="text-xl font-black mb-3">ETH / SOL</h3>
                <div className="p-3 bg-[var(--os-surface-3)] rounded-xl border border-[var(--os-border)] text-lg font-black mt-2">
                  Price: 4.5 ETH
                </div>
              </button>
              
              <button 
                onClick={() => setCurrency('usd')}
                className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center group text-center ${currency === 'usd' ? 'bg-[var(--os-blue)]/10 border-[var(--os-blue)]' : 'bg-[var(--os-surface-2)] border-[var(--os-border)] hover:border-[var(--os-border-light)]'}`}
              >
                <div className="w-16 h-16 bg-[var(--os-surface-3)] rounded-2xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl">💵</div>
                <h3 className="text-xl font-black mb-3">USD / EUR</h3>
                <div className="p-3 bg-[var(--os-surface-3)] rounded-xl border border-[var(--os-border)] text-lg font-black mt-2">
                  Price: $12,450.00
                </div>
              </button>
            </div>
            
            <button 
              onClick={nextStep}
              className="px-16 py-5 bg-[var(--os-blue)] text-white rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Voyages Intro */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-right duration-300">
            <button onClick={prevStep} className="absolute top-12 left-12 text-[var(--os-text-secondary)] hover:text-white font-black text-sm">← BACK</button>
            <div className="w-32 h-32 bg-[var(--os-blue)]/20 rounded-full flex items-center justify-center text-6xl mb-8 animate-pulse shadow-2xl shadow-[var(--os-blue)]/20">⚡</div>
            <h2 className="text-4xl font-black mb-4 text-center">Ready for your first Voyage?</h2>
            <p className="text-[var(--os-text-secondary)] font-bold mb-12 text-center text-lg max-w-lg leading-relaxed">
              Earn XP and unlock exclusive shipments as you trade and explore the OpenSea ecosystem.
            </p>
            
            <button 
              onClick={nextStep}
              className="px-16 py-5 bg-[var(--os-blue)] text-white rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
            >
              Embark Now
            </button>
            <button 
              onClick={onClose}
              className="mt-6 text-[var(--os-text-secondary)] hover:text-white font-black text-sm uppercase tracking-widest"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 4: Loading/Splash */}
        {step === 4 && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">
            <div className="relative w-48 h-48 mb-12">
              <div className="absolute top-0 left-0 w-16 h-16 bg-[var(--os-surface-2)] rounded-2xl flex items-center justify-center text-3xl animate-bounce shadow-2xl border border-[var(--os-border)]">🎨</div>
              <div className="absolute top-1/4 right-0 w-16 h-16 bg-[var(--os-surface-2)] rounded-2xl flex items-center justify-center text-3xl animate-bounce delay-100 shadow-2xl border border-[var(--os-border)]">🕹️</div>
              <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-[var(--os-surface-2)] rounded-2xl flex items-center justify-center text-3xl animate-bounce delay-300 shadow-2xl border border-[var(--os-border)]">🎵</div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl">⛵</div>
            </div>
            <h2 className="text-4xl font-black mb-4 text-center">Setting sail...</h2>
            <p className="text-[var(--os-text-secondary)] font-bold text-center text-lg animate-pulse">Personalizing your experience</p>
          </div>
        )}
      </div>
    </div>
  );
}
