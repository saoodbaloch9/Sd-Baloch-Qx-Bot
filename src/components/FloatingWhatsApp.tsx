import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../services/soundEffects';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '+923316813901';
  const whatsappUrl = `https://wa.me/923316813901?text=Hello%20SD%20BALOCH%20QX%20BOT%20Official%20Support.%20I%20am%20using%20the%20Quotex%20signal%20engine.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* 3D Floating Tooltip */}
      <div
        className={`hidden sm:flex items-center gap-2 card-3d-gold px-3.5 py-2 rounded-2xl border border-emerald-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 scale-95'
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <div className="text-left font-mono-numbers">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">
            SD BALOCH OFFICIAL SUPPORT
          </span>
          <span className="text-xs font-black text-emerald-400">
            {phoneNumber} (Direct Chat)
          </span>
        </div>
      </div>

      {/* 3D Glowing WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact SD BALOCH QX BOT WhatsApp Support"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => sound.playClick()}
        className="relative group w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 p-0.5 shadow-[0_8px_30px_rgba(16,185,129,0.5),_0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:scale-108 active:scale-95 flex items-center justify-center cursor-pointer border-2 border-amber-300/60"
      >
        {/* Pulsing Outer Rings */}
        <span className="absolute -inset-1 rounded-2xl bg-emerald-500/30 blur-sm group-hover:bg-emerald-400/50 transition-all animate-pulse" />

        {/* Inner Content */}
        <div className="relative w-full h-full rounded-[14px] bg-gradient-to-b from-[#0a2315] to-[#04120a] flex items-center justify-center overflow-hidden">
          {/* Subtle Gold Shimmer across button */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* WhatsApp SVG Icon */}
          <svg
            className="w-8 h-8 md:w-9 md:h-9 text-emerald-400 fill-current drop-shadow-[0_2px_8px_rgba(16,185,129,0.8)] transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.539 1.95.823 2.791.823 3.181 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.769-5.767-5.769zm10.222 5.766c0 5.632-4.59 10.22-10.222 10.22-1.789 0-3.473-.464-4.945-1.275l-5.336 1.399 1.425-5.208c-.908-1.532-1.394-3.307-1.394-5.136 0-5.631 4.589-10.22 10.221-10.22 5.631 0 10.221 4.589 10.221 10.22zm-4.707 3.327c-.258-.129-1.528-.754-1.765-.841-.237-.086-.41-.129-.582.13-.172.258-.667.841-.818 1.013-.151.172-.301.194-.559.065-.258-.129-1.09-.402-2.077-1.282-.768-.685-1.287-1.532-1.437-1.79-.151-.258-.016-.398.113-.526.116-.116.258-.301.387-.452.129-.151.172-.258.258-.43.086-.172.043-.323-.021-.452-.065-.129-.582-1.402-.797-1.921-.21-.504-.423-.435-.582-.443-.15-.008-.323-.009-.495-.009-.172 0-.452.065-.688.323-.237.258-.904.883-.904 2.153 0 1.27.925 2.497 1.054 2.669.129.172 1.821 2.78 4.412 3.898.616.266 1.097.425 1.472.544.619.197 1.182.169 1.627.103.496-.074 1.528-.624 1.743-1.226.215-.603.215-1.119.151-1.226-.065-.107-.237-.172-.495-.301z" />
          </svg>

          {/* Golden Badge Counter */}
          <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-black" />
        </div>
      </a>
    </div>
  );
};
