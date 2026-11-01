import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Radio, MessageCircle, HelpCircle } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface NavbarProps {
  onOpenHelp: () => void;
  winRate: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHelp, winRate }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    sound.enabled = nextState;
    setSoundEnabled(nextState);
    if (nextState) sound.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/25 bg-[#0a0a0c]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Name & 3D Insignia */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-700 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0d0e] rounded-[10px] flex items-center justify-center">
              <span className="font-luxury font-black text-amber-300 text-lg leading-none">
                SD
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-luxury font-black text-lg sm:text-xl tracking-wider gold-text-gradient">
                SD BALOCH
              </span>
              <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
                QX BOT
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 uppercase tracking-widest">
                Quotex Pro v4.2
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono-numbers">
                <Radio className="w-3 h-3 animate-ping" />
                QX SERVERS ONLINE
              </span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="hidden sm:inline text-neutral-400">LATENCY: 14ms</span>
            </div>
          </div>
        </div>

        {/* Center: Live Time & Session Info (Hidden on very small screens) */}
        <div className="hidden lg:flex items-center gap-4 bg-black/60 border border-amber-500/20 px-4 py-1.5 rounded-xl shadow-inner font-mono-numbers text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-amber-400 font-bold">UTC CLOCK:</span>
            <span className="text-white font-bold">{currentTime}</span>
          </div>
          <div className="h-3 w-px bg-neutral-800" />
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALGO ACCURACY: {winRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-black/70 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">SFX ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline text-neutral-400">MUTED</span>
              </>
            )}
          </button>

          {/* Help Info Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            title="Bot Engine Guide"
            className="p-2 rounded-xl bg-black/70 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Direct WhatsApp Support */}
          <a
            href="https://wa.me/923316813901?text=Hello%20SD%20BALOCH%20QX%20BOT%20Official%20Support"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.35)] border border-emerald-400 transition-all transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>VIP SUPPORT</span>
          </a>
        </div>
      </div>
    </header>
  );
};
