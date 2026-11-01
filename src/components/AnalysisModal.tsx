import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, ShieldCheck, Zap, Sparkles, Activity } from 'lucide-react';
import { AnalysisParameter } from '../types';
import { sound } from '../services/soundEffects';

interface AnalysisModalProps {
  isOpen: boolean;
  parameters: AnalysisParameter[];
  onComplete: () => void;
  assetName: string;
  timeframeLabel: string;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  parameters,
  onComplete,
  assetName,
  timeframeLabel,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIndex(0);
      return;
    }

    // Play subtle scan ticks and progress smoothly
    const totalDuration = 2200; // 2.2 seconds total scan time
    const intervalTime = 50;
    const stepIncrement = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        // Update parameter cycling index
        const paramIdx = Math.min(
          parameters.length - 1,
          Math.floor((next / 100) * parameters.length)
        );
        setCurrentStepIndex(paramIdx);

        if (Math.random() > 0.6) {
          sound.playScanTick();
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, onComplete, parameters.length]);

  if (!isOpen) return null;

  const currentParam = parameters[currentStepIndex] || parameters[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg card-3d-gold p-6 md:p-8 rounded-3xl border-2 border-amber-400/50 shadow-[0_25px_60px_rgba(212,175,55,0.4)] text-center relative overflow-hidden">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>SD BALOCH QX 26-METHOD ENGINE</span>
        </div>

        {/* 3D Scanning Radar Visual */}
        <div className="relative mx-auto my-4 w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-amber-500/30" />
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-400/60 radar-spinner" />
          <div className="absolute inset-6 rounded-full border border-amber-400/20 animate-ping opacity-40" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)]">
            <Cpu className="w-8 h-8 text-black" />
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-wide uppercase mb-1">
          PROCESSING ALGORITHMIC CHECK
        </h2>
        <p className="text-xs text-amber-200/80 font-mono-numbers mb-4">
          ASSET: <span className="text-white font-bold">{assetName}</span> | EXPIRY:{' '}
          <span className="text-amber-300 font-bold">{timeframeLabel}</span>
        </p>

        {/* Progress Bar with 3D Depth */}
        <div className="w-full bg-black/80 rounded-full h-4 border border-amber-500/40 p-0.5 mb-2 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-75 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono-numbers text-neutral-400 mb-6">
          <span>PARSED {currentStepIndex + 1} / {parameters.length} METHODS</span>
          <span className="font-extrabold text-amber-300 text-sm">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Live Active Parameter Box */}
        {currentParam && (
          <div className="bg-black/70 border border-amber-500/30 rounded-2xl p-4 text-left shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                CATEGORY: {currentParam.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                VERIFIED ✓
              </span>
            </div>
            <div className="font-extrabold text-white text-sm md:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentParam.name}</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {currentParam.detail}
            </p>
          </div>
        )}

        {/* Bottom Guarantee */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Directional Filter Active (Zero Fake Signals)</span>
        </div>
      </div>
    </div>
  );
};
