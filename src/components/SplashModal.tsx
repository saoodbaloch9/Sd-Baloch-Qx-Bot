import React, { useState } from 'react';
import { ShieldCheck, Zap, TrendingUp, Sparkles, X, ChevronRight } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface SplashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SplashModal: React.FC<SplashModalProps> = ({ isOpen, onClose }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  if (!isOpen) return null;

  const handleEnter = () => {
    sound.playClick();
    setIsLaunching(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 transition-all duration-500">
      {/* 3D Holographic Backdrop Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/15 via-black/80 to-black pointer-events-none" />

      {/* 3D Main Gold Card */}
      <div 
        className={`relative w-full max-w-xl card-3d-gold p-8 md:p-10 rounded-3xl text-center border-2 border-amber-400/40 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.4)] transition-all duration-500 ${
          isLaunching ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Top Gold Embellishment */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 text-black text-xs font-black tracking-widest uppercase shadow-[0_4px_15px_rgba(212,175,55,0.6)] border border-amber-100 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          QUOTEX PLATFORM CERTIFIED ENGINE
        </div>

        {/* 3D Animated Metallic Insignia */}
        <div className="relative mx-auto my-6 w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50 radar-spinner" />
          <div className="absolute inset-2 rounded-full border border-amber-500/30 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-black p-0.5 shadow-[0_10px_25px_rgba(212,175,55,0.5)] transform rotate-45 flex items-center justify-center">
            <div className="w-full h-full bg-[#0e0e10] rounded-[14px] flex items-center justify-center -rotate-45">
              <span className="font-luxury font-black text-2xl text-amber-300 tracking-tighter drop-shadow-[0_2px_8px_rgba(212,175,55,0.8)]">
                SD
              </span>
            </div>
          </div>
        </div>

        {/* Prominent App Name */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase mb-2">
          <span className="gold-text-gradient font-luxury tracking-wide">
            SD BALOCH
          </span>{' '}
          <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            QX BOT
          </span>
        </h1>

        <p className="text-amber-200/80 text-sm md:text-base font-medium tracking-wide mb-6">
          Advanced 26-Parameter Algorithmic Quotex Trading Signal Engine
        </p>

        {/* 3D Feature Pills */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-xs font-semibold text-neutral-300">
          <div className="bg-black/60 border border-amber-500/25 rounded-xl p-3 shadow-inner flex flex-col items-center">
            <Zap className="w-4 h-4 text-amber-400 mb-1" />
            <span>26 Methods</span>
            <span className="text-[10px] text-amber-400/70">Deep Analysis</span>
          </div>
          <div className="bg-black/60 border border-amber-500/25 rounded-xl p-3 shadow-inner flex flex-col items-center">
            <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
            <span>Quotex OTC</span>
            <span className="text-[10px] text-emerald-400/70">Live & 100% Payout</span>
          </div>
          <div className="bg-black/60 border border-amber-500/25 rounded-xl p-3 shadow-inner flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-cyan-400 mb-1" />
            <span>Strict Logic</span>
            <span className="text-[10px] text-cyan-400/70">Zero False Wins</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleEnter}
          className="w-full py-4 rounded-xl btn-3d-gold flex items-center justify-center gap-3 text-base md:text-lg cursor-pointer group"
        >
          <span>INITIALIZE TERMINAL</span>
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-mono-numbers">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CONNECTED TO QUOTEX HIGH FREQUENCY SERVERS</span>
        </div>
      </div>
    </div>
  );
};
