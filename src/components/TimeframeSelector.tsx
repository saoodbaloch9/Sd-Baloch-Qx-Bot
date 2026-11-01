import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { TimeframeOption } from '../types';
import { TIMEFRAMES } from '../services/marketEngine';
import { sound } from '../services/soundEffects';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeframeOption;
  onSelectTimeframe: (tf: TimeframeOption) => void;
  disabled?: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onSelectTimeframe,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>EXPIRY TIMEFRAME</span>
        </label>
        <span className="text-[11px] font-mono-numbers text-neutral-400">
          SELECTED: <span className="text-amber-300 font-bold">{selectedTimeframe.label}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {TIMEFRAMES.map((tf) => {
          const isSelected = selectedTimeframe.id === tf.id;
          return (
            <button
              key={tf.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  sound.playClick();
                  onSelectTimeframe(tf);
                }
              }}
              className={`relative py-3 px-3 rounded-xl text-center transition-all cursor-pointer ${
                disabled ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                isSelected
                  ? 'btn-3d-gold shadow-[0_4px_15px_rgba(212,175,55,0.45)] ring-1 ring-white/50'
                  : 'btn-3d-pill hover:border-amber-400/50 hover:text-white text-neutral-300'
              }`}
            >
              {tf.id === '30s' && (
                <span className={`absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 ${
                  isSelected ? 'bg-black text-amber-300' : 'bg-amber-500 text-black'
                }`}>
                  <Zap className="w-2.5 h-2.5" /> TURBO
                </span>
              )}
              <div className={`font-black text-sm md:text-base ${isSelected ? 'text-black' : 'text-neutral-100'}`}>
                {tf.label}
              </div>
              <div className={`text-[10px] uppercase font-bold tracking-tight ${isSelected ? 'text-neutral-900/80' : 'text-neutral-500'}`}>
                {tf.sublabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
