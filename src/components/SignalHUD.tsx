import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Percent, 
  Award, 
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { TradingSignal, ActiveTrade } from '../types';
import { formatPrice } from '../services/marketEngine';
import { sound } from '../services/soundEffects';

interface SignalHUDProps {
  signal: TradingSignal | null;
  activeTrade: ActiveTrade | null;
  currentPrice: number;
  onGenerateNewSignal: () => void;
  isAnalyzing: boolean;
  stake: number;
}

export const SignalHUD: React.FC<SignalHUDProps> = ({
  signal,
  activeTrade,
  currentPrice,
  onGenerateNewSignal,
  isAnalyzing,
  stake,
}) => {
  const [showParameters, setShowParameters] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  if (!signal) {
    return (
      <div className="card-3d-gold rounded-3xl p-8 text-center border-2 border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-300 mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wide mb-2">
          READY FOR DEEP ALGORITHMIC SCAN
        </h3>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
          Select your Quotex asset and expiry timeframe, then trigger the 26-Method Analysis Engine to generate high-probability binary signals.
        </p>
        <button
          onClick={onGenerateNewSignal}
          disabled={isAnalyzing}
          className="px-8 py-4 rounded-xl btn-3d-gold text-base md:text-lg cursor-pointer flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-5 h-5 text-black" />
          <span>START 26-METHOD ANALYSIS</span>
        </button>
      </div>
    );
  }

  // Format seconds to mm:ss
  const remainingSeconds = activeTrade ? activeTrade.remainingSeconds : 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Strict Evaluation State
  const isCall = signal.direction === 'CALL';
  const entryPrice = activeTrade ? activeTrade.entryPrice : signal.entryPrice;
  const currentDiff = currentPrice - entryPrice;
  const isWinningNow = isCall ? currentPrice > entryPrice : currentPrice < entryPrice;
  const isTradeCompleted = activeTrade?.status === 'WON' || activeTrade?.status === 'LOST' || activeTrade?.status === 'TIE';

  // Strict profit calculation
  const potentialProfit = Number((stake * (signal.targetPayout / 100)).toFixed(2));
  const finalProfit = activeTrade?.resultProfit ?? (isWinningNow ? potentialProfit : -stake);

  const filteredParams = signal.parameters.filter(p => {
    if (activeCategoryFilter === 'ALL') return true;
    return p.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-4">
      {/* STRICT FINAL RESULT BANNER (When Trade Reaches 00:00) */}
      {isTradeCompleted && (
        <div
          className={`p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 shadow-2xl animate-in fade-in zoom-in-95 ${
            activeTrade.status === 'WON'
              ? 'bg-gradient-to-r from-emerald-950/90 via-emerald-900/90 to-black border-emerald-400 shadow-[0_0_35px_rgba(34,197,94,0.4)]'
              : activeTrade.status === 'LOST'
              ? 'bg-gradient-to-r from-red-950/90 via-red-900/90 to-black border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.4)]'
              : 'bg-neutral-900 border-amber-400'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              {activeTrade.status === 'WON' ? (
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                  <Award className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-red-300 shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  <XCircle className="w-8 h-8" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span
                    className={`text-xl md:text-2xl font-black uppercase tracking-wider ${
                      activeTrade.status === 'WON'
                        ? 'text-emerald-400 green-text-glow'
                        : 'text-red-400 red-text-glow'
                    }`}
                  >
                    {activeTrade.status === 'WON' ? '✓ SUCCESS / WINNER' : '✗ TRADE CLOSED: LOSE'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 border border-neutral-700 text-neutral-300">
                    STRICT AUDIT 100%
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 font-mono-numbers">
                  Entry: <span className="font-bold text-white">{formatPrice(entryPrice, signal.asset.decimals)}</span> | Exit:{' '}
                  <span className="font-bold text-white">{formatPrice(activeTrade.exitPrice ?? currentPrice, signal.asset.decimals)}</span> (
                  {currentDiff >= 0 ? '+' : ''}{formatPrice(currentDiff, signal.asset.decimals)} pips)
                </p>
              </div>
            </div>

            {/* Profit or Loss Display */}
            <div className="text-center md:text-right">
              <span className="text-[11px] font-bold uppercase text-neutral-400 block">
                {activeTrade.status === 'WON' ? 'NET PROFIT EARNED' : 'CAPITAL DRAWDOWN'}
              </span>
              <span
                className={`text-2xl md:text-3xl font-black font-mono-numbers ${
                  activeTrade.status === 'WON' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {activeTrade.status === 'WON' ? `+$${activeTrade.resultProfit?.toFixed(2)}` : `-$${stake.toFixed(2)}`}
              </span>
              {activeTrade.status === 'LOST' && (
                <div className="text-[10px] text-amber-300 font-bold mt-1">
                  RECOMMENDATION: 1-Step Martingale (${(stake * 2.2).toFixed(2)}) on next signal
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN 3D SIGNAL CONTROL PANEL */}
      <div className="card-3d-gold rounded-3xl p-5 md:p-7 border-2 border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              {signal.id}
            </span>
            <span className="text-xs text-neutral-400 font-mono-numbers">
              {signal.asset.symbol} ({signal.timeframe.label})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-neutral-800 text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{signal.martingaleRecommendation}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black font-mono-numbers">
              +{signal.targetPayout}% Payout
            </span>
          </div>
        </div>

        {/* Big 3D Direction & Timer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6 items-center">
          {/* Signal Box (CALL or PUT) */}
          <div
            className={`p-6 rounded-2xl text-center relative overflow-hidden transition-all duration-300 ${
              isCall ? 'btn-3d-call' : 'btn-3d-put'
            }`}
          >
            <div className="absolute top-2 right-2 text-white/30">
              {isCall ? <ArrowUpRight className="w-12 h-12" /> : <ArrowDownRight className="w-12 h-12" />}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block mb-1">
              SIGNAL DIRECTION
            </span>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {isCall ? 'CALL / UP' : 'PUT / DOWN'}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-white text-xs font-bold backdrop-blur-sm">
              <span>{isCall ? 'BUY GREEN CANDLE' : 'SELL RED CANDLE'}</span>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="card-3d-gold p-6 rounded-2xl text-center border border-amber-500/30 flex flex-col items-center justify-center relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTradeCompleted ? 'EXPIRED' : 'LIVE EXPIRY COUNTDOWN'}</span>
            </span>

            {/* Glowing Digital Time */}
            <div
              className={`text-4xl md:text-5xl font-black font-mono-numbers tracking-tight my-1 ${
                isTradeCompleted
                  ? 'text-neutral-500'
                  : remainingSeconds <= 5
                  ? 'text-red-400 animate-ping'
                  : 'text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]'
              }`}
            >
              {formattedTimer}
            </div>

            {/* Live Status indicator */}
            {!isTradeCompleted ? (
              <div
                className={`mt-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono-numbers flex items-center gap-1.5 ${
                  isWinningNow
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isWinningNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{isWinningNow ? `IN MONEY (+ $${potentialProfit})` : `OUT OF MONEY (- $${stake})`}</span>
              </div>
            ) : (
              <span className="mt-2 text-xs font-bold text-neutral-400">SESSION TERMINATED</span>
            )}
          </div>

          {/* Win Probability Gauge */}
          <div className="card-3d-gold p-6 rounded-2xl text-center border border-amber-500/30 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 mb-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>SUCCESS PROBABILITY</span>
            </span>

            <div className="text-4xl md:text-5xl font-black font-mono-numbers gold-text-gradient drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] my-1">
              {signal.confidence.toFixed(1)}%
            </div>

            <div className="w-full bg-neutral-900 rounded-full h-2.5 border border-amber-500/30 mt-2 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400"
                style={{ width: `${signal.confidence}%` }}
              />
            </div>

            <span className="text-[10px] text-neutral-400 font-medium mt-1.5">
              Derived from 26 Multi-Method Verification
            </span>
          </div>
        </div>

        {/* Live Prices Locked vs Real-Time */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/60 rounded-2xl p-4 border border-amber-500/20 font-mono-numbers text-xs">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block">ENTRY PRICE (LOCKED)</span>
            <span className="text-white font-extrabold text-sm md:text-base">
              {formatPrice(entryPrice, signal.asset.decimals)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block">CURRENT LIVE PRICE</span>
            <span
              className={`font-extrabold text-sm md:text-base ${
                isWinningNow ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatPrice(currentPrice, signal.asset.decimals)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block">PIP DIFFERENTIAL</span>
            <span
              className={`font-extrabold text-sm md:text-base ${
                currentDiff >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {currentDiff >= 0 ? '+' : ''}
              {formatPrice(currentDiff, signal.asset.decimals)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block">STAKE & RETURN</span>
            <span className="text-amber-300 font-extrabold text-sm md:text-base">
              ${stake} → ${(stake + potentialProfit).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Controls & New Analysis Trigger */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-amber-500/20">
          <button
            onClick={() => {
              sound.playClick();
              setShowParameters(!showParameters);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/80 hover:bg-neutral-900 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>INSPECT 26 ALGORITHMIC METHODS ({signal.parameters.length})</span>
            {showParameters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGenerateNewSignal();
            }}
            disabled={isAnalyzing || activeTrade?.status === 'ACTIVE'}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTrade?.status === 'ACTIVE'
                ? 'opacity-50 cursor-not-allowed bg-neutral-800 text-neutral-500'
                : 'btn-3d-gold'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'SCANNING ALGORITHM...' : 'ANALYZE NEXT CANDLE'}</span>
          </button>
        </div>

        {/* 26-PARAMETER BREAKDOWN ACCORDION */}
        {showParameters && (
          <div className="mt-5 pt-4 border-t border-amber-500/30 animate-in fade-in duration-200">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs font-bold">
              {['ALL', 'Price Action', 'Candle Patterns', 'Market Structure', 'Support & Resistance', 'Volume & Momentum'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick();
                      setActiveCategoryFilter(cat);
                    }}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                      activeCategoryFilter === cat
                        ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                        : 'bg-black/60 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredParams.map((p) => {
                const isBull = p.status === 'BULLISH';
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-black/70 border border-neutral-800/80 hover:border-amber-500/30 transition-all text-left"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isBull ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {p.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                          isBull
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-500/15 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {p.status} ({p.score}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                      {p.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
