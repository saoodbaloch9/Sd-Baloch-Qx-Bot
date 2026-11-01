import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Sparkles, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { QuotexAsset, AssetCategory } from '../types';
import { QUOTEX_ASSETS, formatPrice } from '../services/marketEngine';
import { sound } from '../services/soundEffects';

interface AssetSelectorProps {
  selectedAsset: QuotexAsset;
  onSelectAsset: (asset: QuotexAsset) => void;
  disabled?: boolean;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({
  selectedAsset,
  onSelectAsset,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAssets = QUOTEX_ASSETS.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (asset: QuotexAsset) => {
    sound.playClick();
    onSelectAsset(asset);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-amber-400" />
        <span>SELECT QUOTEX ASSET / MARKET</span>
      </label>

      {/* Main Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            sound.playClick();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full card-3d-gold p-3.5 rounded-2xl flex items-center justify-between text-left transition-all ${
          disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer hover:border-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]'
        } ${isOpen ? 'border-amber-400 ring-2 ring-amber-500/30' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-black border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 font-mono-numbers">
            {selectedAsset.isOtc ? 'OTC' : selectedAsset.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base md:text-lg">
                {selectedAsset.name}
              </span>
              {selectedAsset.isOtc && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                  QUOTEX OTC
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono-numbers">
              <span className="text-amber-200/90 font-semibold">
                BASE: {formatPrice(selectedAsset.basePrice, selectedAsset.decimals)}
              </span>
              <span>•</span>
              <span className="text-neutral-400 capitalize">{selectedAsset.category.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Payout & Arrow */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              PAYOUT
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-black text-sm font-mono-numbers shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              +{selectedAsset.payout}%
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 card-3d-gold p-3 rounded-2xl border-2 border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              placeholder="Search Quotex asset (e.g., EUR/USD, BTC, PKR)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/70 border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-medium"
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-xs font-semibold">
            {(['ALL', 'OTC', 'CURRENCIES', 'CRYPTO', 'COMMODITIES'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black font-extrabold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                      : 'bg-black/60 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat === 'ALL' ? 'All Assets' : cat}
                </button>
              )
            )}
          </div>

          {/* Asset List */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {filteredAssets.length === 0 ? (
              <div className="py-6 text-center text-sm text-neutral-400">
                No Quotex assets found matching "{search}"
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = asset.id === selectedAsset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => handleSelect(asset)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-400 text-white'
                        : 'bg-black/40 hover:bg-neutral-900 border border-transparent hover:border-amber-500/30 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-bold text-amber-300">
                        {asset.isOtc ? 'OTC' : asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white">
                            {asset.name}
                          </span>
                          {asset.isOtc && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              OTC
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono-numbers">
                          {formatPrice(asset.basePrice, asset.decimals)}
                        </span>
                      </div>
                    </div>

                    <div className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs font-mono-numbers">
                      +{asset.payout}%
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
