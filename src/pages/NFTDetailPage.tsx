import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { nftItems } from "@/data/mock";

export default function NFTDetailPage() {
  const { id } = useParams();
  const nft = nftItems.find(item => item.id === Number(id)) || nftItems[0];
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <div className="min-h-screen bg-[var(--os-bg)] text-[var(--os-text)] font-sans">
      {/* Thumbnail Strip Navigation */}
      <div className="sticky top-0 z-50 bg-[var(--os-bg)] border-b border-[var(--os-border)] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button className="p-2 text-[var(--os-text-secondary)]">←</button>
          {nftItems.slice(0, 10).map((item) => (
            <div 
              key={item.id} 
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 cursor-pointer border-2 ${
                item.id === nft.id ? "border-[var(--os-blue)]" : "border-transparent"
              }`}
              style={{ backgroundColor: `hsl(${item.id * 40 % 360}, 50%, 20%)` }}
            >
              {item.image}
            </div>
          ))}
          <button className="p-2 text-[var(--os-text-secondary)]">→</button>
        </div>
        <button className="p-2 text-[var(--os-text-secondary)] hover:text-white text-xl">✕</button>
      </div>

      <div className="max-w-[1400px] mx-auto p-8 flex flex-col md:flex-row gap-12">
        {/* Left Side: Large NFT Image */}
        <div className="w-full md:w-1/2 flex justify-center items-start">
          <div 
            className="w-full aspect-square rounded-2xl flex items-center justify-center text-[200px] shadow-2xl"
            style={{ backgroundColor: `hsl(${nft.id * 40 % 360}, 50%, 20%)` }}
          >
            {nft.image}
          </div>
        </div>

        {/* Right Side: Info and Actions */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1 text-[var(--os-blue)] font-bold mb-2">
                BNY Metalworks <span className="text-sm">✔️</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{nft.name}</h1>
              <div className="text-[var(--os-text-secondary)] text-sm mb-6">
                Sold by <span className="text-[var(--os-blue)] font-semibold">BNY Metalworks</span> · ships in 5 business days
              </div>
            </div>
            
            <div className="flex gap-2">
              <IconButton icon="🌐" />
              <IconButton icon="📸" />
              <IconButton icon="💬" />
              <IconButton icon="𝕏" />
              <IconButton icon="🔗" />
              <IconButton icon="❤️" />
              <IconButton icon="⋯" />
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <Badge text="IN STOCK" />
            <Badge text="SHIPS NATIONWIDE" />
            <Badge text={`SKU #${nft.id}`} />
          </div>

          {/* Price Info Box */}
          <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <PriceStat label="BULK PRICE" value="$2.1K" />
              <PriceStat label="FROM PRICE" value="$2.4K" />
              <PriceStat label="MIN ORDER" value="1 unit" />
              <PriceStat label="LAST SALE" value={nft.lastSale} />
            </div>
            
            <div className="pt-6 border-t border-[var(--os-border)]">
              <div className="text-[var(--os-text-secondary)] text-xs font-bold mb-2">PRICE</div>
              <div className="text-3xl font-bold mb-6">{nft.price} <span className="text-xs text-[var(--os-text-secondary)]">FREE DELIVERY OVER $500</span></div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[var(--os-blue)] rounded-xl font-bold text-lg hover:brightness-110">Buy now</button>
                <Link to="/mall/quotes" className="flex-1 py-4 border border-[var(--os-border)] rounded-xl font-bold text-lg hover:bg-[var(--os-surface-2)] text-center">Request quote</Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--os-border)] mb-6">
            {["Details", "Orders", "Activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold relative ${
                  activeTab === tab ? "text-white" : "text-[var(--os-text-secondary)] hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--os-blue)]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Traits Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-bold">
                <span className="text-[var(--os-blue)]">💠</span> SPECS 5
              </div>
              <div className="flex bg-[var(--os-surface-2)] rounded-lg p-0.5 border border-[var(--os-border)]">
                <button className="p-1 px-2 rounded-md bg-[var(--os-surface-3)]">田</button>
                <button className="p-1 px-2 rounded-md hover:bg-[var(--os-surface-3)]">≡</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <TraitCard label="MATERIAL" value="Stainless Steel" count="1,282" percentage="14%" price="$2.4K" />
              <TraitCard label="CERTIFICATION" value="ISO 9001" count="705" percentage="8%" price="$2.4K" />
              <TraitCard label="LEAD TIME" value="5 Business Days" count="168" percentage="2%" price="$2.4K" />
              <TraitCard label="ORIGIN" value="United States" count="426" percentage="5%" price="$2.4K" />
              <TraitCard label="WARRANTY" value="2 Years" count="248" percentage="3%" price="$2.4K" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon }: { icon: string }) {
  return (
    <button className="w-10 h-10 rounded-xl border border-[var(--os-border)] flex items-center justify-center hover:bg-[var(--os-surface-2)] text-lg">
      {icon}
    </button>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-lg text-[10px] font-bold">
      {text}
    </span>
  );
}

function PriceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[var(--os-text-secondary)] text-[10px] font-bold mb-1">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function TraitCard({ label, value, count, percentage, price }: { 
  label: string; value: string; count: string; percentage: string; price: string 
}) {
  return (
    <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-xl p-4 cursor-pointer hover:bg-[var(--os-surface-2)] transition-colors">
      <div className="text-[var(--os-text-secondary)] text-[10px] font-bold mb-1">{label}</div>
      <div className="font-bold mb-3">{value}</div>
      <div className="flex justify-between items-center">
        <div className="text-[var(--os-text-secondary)] text-[10px] font-semibold">{percentage}</div>
        <div className="px-1.5 py-0.5 bg-[var(--os-surface-3)] rounded text-[9px] font-bold">{count}</div>
      </div>
      <div className="mt-2 text-[11px] font-bold">From: {price}</div>
    </div>
  );
}
