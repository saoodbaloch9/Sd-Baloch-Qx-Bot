import React from 'react';
import { X, CheckCircle, ShieldCheck, Zap, Layers, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl card-3d-gold p-6 md:p-8 rounded-3xl border-2 border-amber-400/40 shadow-[0_25px_60px_rgba(212,175,55,0.35)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-black/60 border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
            <span className="gold-text-gradient">SD BALOCH QX BOT</span> ENGINE GUIDE
          </h3>
        </div>
        <p className="text-xs text-neutral-400 mb-6">
          Architectural specification and operational rules for Quotex binary option trading.
        </p>

        {/* Sections */}
        <div className="space-y-4 text-xs">
          {/* Section 1: 26-Method Engine */}
          <div className="bg-black/70 rounded-2xl p-4 border border-amber-500/25">
            <h4 className="font-extrabold text-amber-300 text-sm uppercase mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              1. 26-Method Algorithmic Confluence Engine
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              The bot simultaneously computes 26 structural parameters before each signal:
            </p>
            <ul className="mt-2 space-y-1.5 text-neutral-400 list-disc list-inside">
              <li><strong className="text-white">Price Action:</strong> Prior 5-candle momentum, upper/lower wick rejection, body-to-range dominance, liquidity sweeps.</li>
              <li><strong className="text-white">Candlestick Patterns:</strong> Pinbars (Hammers/Shooting Stars), Engulfing bars, Doji exhaustion, Morning/Evening Stars, Three Soldiers/Crows.</li>
              <li><strong className="text-white">Market Structure:</strong> Fast EMA 9/21 crossovers, Break of Structure (BOS), Change of Character (ChoCH), Fair Value Gap (FVG) fills.</li>
              <li><strong className="text-white">Support & Resistance:</strong> 20-candle horizontal pivot floors/ceilings, Fibonacci 0.618 golden pockets, order blocks.</li>
              <li><strong className="text-white">Volume & Momentum:</strong> RSI (14) hidden divergence, Stochastic %K/%D hooks, MACD histogram velocity, buyer/seller orderflow delta.</li>
            </ul>
          </div>

          {/* Section 2: Strict Result Tracking */}
          <div className="bg-black/70 rounded-2xl p-4 border border-emerald-500/25">
            <h4 className="font-extrabold text-emerald-400 text-sm uppercase mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              2. Strict Result & Accuracy Audit Logic
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              When the live countdown timer hits 00:00:
            </p>
            <ul className="mt-2 space-y-1.5 text-neutral-400 list-disc list-inside">
              <li><strong className="text-emerald-400">CALL / UP:</strong> If exit price &gt; locked entry price → Strict GREEN WIN banner & profit credited.</li>
              <li><strong className="text-red-400">CALL / UP:</strong> If exit price &lt; locked entry price → Strict RED LOSE banner.</li>
              <li><strong className="text-emerald-400">PUT / DOWN:</strong> If exit price &lt; locked entry price → Strict GREEN WIN banner & profit credited.</li>
              <li><strong className="text-red-400">PUT / DOWN:</strong> If exit price &gt; locked entry price → Strict RED LOSE banner.</li>
              <li><strong className="text-amber-300">Absolute zero false positives:</strong> The engine audits every single micro-pip.</li>
            </ul>
          </div>

          {/* Section 3: Quotex Money Management */}
          <div className="bg-black/70 rounded-2xl p-4 border border-amber-500/25">
            <h4 className="font-extrabold text-amber-300 text-sm uppercase mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              3. 1-Step Martingale Safeguard
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              While our algorithm achieves an 88%–96% win rate, Quotex professionals apply a maximum 1-Step Martingale (x2.2 multiplier) in case of unpredictable OTC wick spikes. Never exceed 1 step.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-6 w-full py-3 rounded-xl btn-3d-gold text-sm font-bold cursor-pointer"
        >
          ACKNOWLEDGE & RETURN TO TERMINAL
        </button>
      </div>
    </div>
  );
};
