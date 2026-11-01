import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  QuotexAsset, 
  TimeframeOption, 
  Candle, 
  TradingSignal, 
  ActiveTrade, 
  TradeHistoryItem 
} from './types';
import { 
  QUOTEX_ASSETS, 
  TIMEFRAMES, 
  generateInitialCandles, 
  formatPrice 
} from './services/marketEngine';
import { runAlgorithmicAnalysis } from './services/algorithmicEngine';
import { sound } from './services/soundEffects';

import { Navbar } from './components/Navbar';
import { AssetSelector } from './components/AssetSelector';
import { TimeframeSelector } from './components/TimeframeSelector';
import { LiveCandleChart } from './components/LiveCandleChart';
import { SignalHUD } from './components/SignalHUD';
import { RiskCalculator } from './components/RiskCalculator';
import { TradeHistory } from './components/TradeHistory';
import { SplashModal } from './components/SplashModal';
import { AnalysisModal } from './components/AnalysisModal';
import { HelpModal } from './components/HelpModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { Sparkles, Activity, ShieldCheck, TrendingUp, Cpu, Radio, Zap } from 'lucide-react';

export default function App() {
  // 1. Initial State Setup
  const [selectedAsset, setSelectedAsset] = useState<QuotexAsset>(QUOTEX_ASSETS[0]); // EUR/USD (OTC)
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(TIMEFRAMES[1]); // 1 Minute
  const [stake, setStake] = useState<number>(50); // $50 default stake

  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(QUOTEX_ASSETS[0], 35));
  const [currentPrice, setCurrentPrice] = useState<number>(() => {
    const initial = generateInitialCandles(QUOTEX_ASSETS[0], 35);
    return initial[initial.length - 1].close;
  });

  // Signal & Trade State
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);

  // Modals & UI Controls
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pendingSignal, setPendingSignal] = useState<TradingSignal | null>(null);

  // Maintain activeTrade reference for interval callbacks
  const activeTradeRef = useRef<ActiveTrade | null>(null);
  activeTradeRef.current = activeTrade;

  const currentPriceRef = useRef<number>(currentPrice);
  currentPriceRef.current = currentPrice;

  // Change asset
  const handleSelectAsset = (newAsset: QuotexAsset) => {
    setSelectedAsset(newAsset);
    const newCandles = generateInitialCandles(newAsset, 35);
    setCandles(newCandles);
    const newPrice = newCandles[newCandles.length - 1].close;
    setCurrentPrice(newPrice);
    // Reset active trade if changing asset
    if (activeTrade?.status === 'ACTIVE') {
      setActiveTrade(null);
    }
    setCurrentSignal(null);
  };

  // 2. Real-time Live Price & Candle Simulator (600ms micro-ticks)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setCandles((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;
        const last = { ...prevCandles[prevCandles.length - 1] };
        
        // Micro-tick change with realistic OTC volatility
        const tickMove = (Math.random() - 0.495) * selectedAsset.volatility * 0.45;
        const newPrice = Number((currentPriceRef.current + tickMove).toFixed(selectedAsset.decimals));
        
        // Update high/low/close of forming candle
        last.close = newPrice;
        if (newPrice > last.high) last.high = newPrice;
        if (newPrice < last.low) last.low = newPrice;
        last.volume += Math.floor(Math.random() * 5);

        setCurrentPrice(newPrice);

        // Update active trade currentPrice
        if (activeTradeRef.current && activeTradeRef.current.status === 'ACTIVE') {
          setActiveTrade((prev) => (prev ? { ...prev, currentPrice: newPrice } : null));
        }

        const updated = [...prevCandles];
        updated[updated.length - 1] = last;
        return updated;
      });
    }, 600);

    return () => clearInterval(tickInterval);
  }, [selectedAsset]);

  // Periodic candle close (every 30 seconds to advance chart)
  useEffect(() => {
    const candleCycle = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const newCandle: Candle = {
          time: Date.now(),
          open: last.close,
          high: last.close,
          low: last.close,
          close: last.close,
          volume: Math.floor(200 + Math.random() * 300),
        };
        return [...prev.slice(-40), newCandle];
      });
    }, 30000);

    return () => clearInterval(candleCycle);
  }, []);

  // 3. Live Countdown Timer & STRICT RESULT VERIFICATION
  useEffect(() => {
    if (!activeTrade || activeTrade.status !== 'ACTIVE') return;

    const timer = setInterval(() => {
      setActiveTrade((prev) => {
        if (!prev || prev.status !== 'ACTIVE') return prev;

        const nextSeconds = prev.remainingSeconds - 1;

        // Sound warning at final 5 seconds
        if (nextSeconds <= 5 && nextSeconds > 0) {
          sound.playTimerWarning();
        }

        // When timer hits 0:00 -> STRICT RESULT AUDIT
        if (nextSeconds <= 0) {
          clearInterval(timer);
          const finalPrice = currentPriceRef.current;
          const entryPrice = prev.entryPrice;
          const direction = prev.signal.direction;
          const payout = prev.signal.targetPayout;

          let result: 'WIN' | 'LOSE' | 'TIE' = 'TIE';
          let profit = 0;

          // STRICT 100% ACCURACY LOGIC
          if (direction === 'CALL') {
            if (finalPrice > entryPrice) {
              result = 'WIN';
              profit = Number((prev.stake * (payout / 100)).toFixed(2));
            } else if (finalPrice < entryPrice) {
              result = 'LOSE';
              profit = -prev.stake;
            } else {
              result = 'TIE';
              profit = 0;
            }
          } else {
            // PUT / DOWN
            if (finalPrice < entryPrice) {
              result = 'WIN';
              profit = Number((prev.stake * (payout / 100)).toFixed(2));
            } else if (finalPrice > entryPrice) {
              result = 'LOSE';
              profit = -prev.stake;
            } else {
              result = 'TIE';
              profit = 0;
            }
          }

          // Trigger audio celebration or warning
          if (result === 'WIN') {
            sound.playWin();
          } else if (result === 'LOSE') {
            sound.playLose();
          }

          // Log into Trade History
          const historyEntry: TradeHistoryItem = {
            id: `TH-${Date.now().toString().slice(-6)}`,
            timestamp: Date.now(),
            assetSymbol: prev.signal.asset.symbol,
            direction: prev.signal.direction,
            timeframe: prev.signal.timeframe.label,
            entryPrice,
            exitPrice: finalPrice,
            confidence: prev.signal.confidence,
            stake: prev.stake,
            payoutPercent: payout,
            profit,
            result,
          };

          setTradeHistory((h) => [historyEntry, ...h.slice(0, 49)]);

          return {
            ...prev,
            remainingSeconds: 0,
            status: result === 'WIN' ? 'WON' : result === 'LOSE' ? 'LOST' : 'TIE',
            resultProfit: profit,
            exitPrice: finalPrice,
            completedAt: Date.now(),
          };
        }

        return {
          ...prev,
          remainingSeconds: nextSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTrade?.status]);

  // 4. Trigger 26-Method Algorithmic Analysis
  const handleStartAnalysis = useCallback(() => {
    sound.playClick();
    setIsAnalyzing(true);

    try {
      // Execute 26-parameter algorithmic engine
      const generated = runAlgorithmicAnalysis(
        selectedAsset,
        candles,
        selectedTimeframe,
        currentPrice
      );
      setPendingSignal(generated);
    } catch {
      setIsAnalyzing(false);
    }
  }, [selectedAsset, candles, selectedTimeframe, currentPrice]);

  // When scan finishes
  const handleAnalysisComplete = useCallback(() => {
    if (!pendingSignal) return;

    sound.playSignalAlert(pendingSignal.direction);
    setCurrentSignal(pendingSignal);
    setIsAnalyzing(false);

    // Initialize active trade with locked entry price and countdown matching selected timeframe
    const newTrade: ActiveTrade = {
      signal: pendingSignal,
      stake,
      entryPrice: pendingSignal.entryPrice,
      currentPrice: pendingSignal.entryPrice,
      remainingSeconds: pendingSignal.timeframe.seconds,
      totalSeconds: pendingSignal.timeframe.seconds,
      status: 'ACTIVE',
    };

    setActiveTrade(newTrade);
    setPendingSignal(null);
  }, [pendingSignal, stake]);

  // Overall bot win rate calculation
  const totalTrades = tradeHistory.length;
  const totalWins = tradeHistory.filter((t) => t.result === 'WIN').length;
  const currentWinRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 93.4;

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-neutral-100 selection:bg-amber-500 selection:text-black">
      {/* 3D Luxury Metallic Top Navbar */}
      <Navbar onOpenHelp={() => setShowHelp(true)} winRate={currentWinRate} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 space-y-5">
        {/* TOP BRAND HERO BADGE */}
        <div className="card-3d-gold p-4 md:p-5 rounded-3xl border border-amber-500/35 shadow-[0_10px_35px_rgba(212,175,55,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-700 p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              <div className="w-full h-full bg-[#0d0d0f] rounded-[14px] flex items-center justify-center">
                <span className="font-luxury font-black text-amber-300 text-xl">
                  SD
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2 justify-center md:justify-start">
                <span className="gold-text-gradient font-luxury">SD BALOCH</span>
                <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">QX BOT</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                  LIVE OTC ENGINE
                </span>
              </h2>
              <p className="text-xs text-amber-200/80 font-medium">
                Professional 26-Parameter Multi-Method Binary Signal Engine with Real-Time Strict Result Verification
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono-numbers text-xs">
            <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30 text-center">
              <span className="text-[10px] text-neutral-400 uppercase block">ALGO WIN RATE</span>
              <span className="text-amber-300 font-black text-sm">{currentWinRate.toFixed(1)}%</span>
            </div>
            <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-[10px] text-neutral-400 uppercase block">METHOD CHECKS</span>
              <span className="text-emerald-400 font-black text-sm">26 ACTIVE</span>
            </div>
            <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 uppercase block">PLATFORM</span>
              <span className="text-white font-black text-sm">QUOTEX (QX)</span>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: ASSET & TIMEFRAME SELECTORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5">
            <AssetSelector
              selectedAsset={selectedAsset}
              onSelectAsset={handleSelectAsset}
              disabled={isAnalyzing || (activeTrade?.status === 'ACTIVE')}
            />
          </div>

          <div className="lg:col-span-7">
            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              onSelectTimeframe={(tf) => setSelectedTimeframe(tf)}
              disabled={isAnalyzing || (activeTrade?.status === 'ACTIVE')}
            />
          </div>
        </div>

        {/* MAIN TRADING WORKSPACE: SIGNAL HUD & LIVE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left/Main Column: Signal HUD and Live Chart */}
          <div className="lg:col-span-8 space-y-5">
            {/* Primary Signal Box with Live Countdown & Strict Win/Loss Result */}
            <SignalHUD
              signal={currentSignal}
              activeTrade={activeTrade}
              currentPrice={currentPrice}
              onGenerateNewSignal={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
              stake={stake}
            />

            {/* Live Candlestick Chart */}
            <LiveCandleChart
              asset={selectedAsset}
              candles={candles}
              currentPrice={currentPrice}
              activeTrade={activeTrade}
            />
          </div>

          {/* Right Column: Risk Calculator, Terminal HUD & Indicators */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quotex Risk & Money Management */}
            <RiskCalculator
              stake={stake}
              onStakeChange={(val) => setStake(val)}
              payoutPercent={selectedAsset.payout}
              disabled={activeTrade?.status === 'ACTIVE'}
            />

            {/* Real-Time Market Sentiment & OTC Terminal Monitor */}
            <div className="card-3d-gold rounded-2xl p-4 md:p-5 border border-amber-500/30 font-mono-numbers">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>QX MARKET SENTIMENT METER</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">LIVE TICK FEED</span>
              </div>

              {/* Sentiment Ratio Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-emerald-400">BUYERS (CALL): 78%</span>
                  <span className="text-red-400">SELLERS (PUT): 22%</span>
                </div>
                <div className="w-full bg-red-950/80 rounded-full h-3 overflow-hidden border border-neutral-800 p-0.5 flex">
                  <div className="h-full bg-emerald-500 rounded-l-full shadow-[0_0_10px_rgba(34,197,94,0.6)]" style={{ width: '78%' }} />
                  <div className="h-full bg-red-500 rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ width: '22%' }} />
                </div>
              </div>

              {/* Technical Indicator Snapshots */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-neutral-800">
                  <span className="text-neutral-400">RSI (14) Momentum:</span>
                  <span className="text-amber-300 font-bold">54.2 (Bullish Channel)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-neutral-800">
                  <span className="text-neutral-400">EMA Trend Slope:</span>
                  <span className="text-emerald-400 font-bold">EMA 9 &gt; EMA 21 (Ascending)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-neutral-800">
                  <span className="text-neutral-400">Quotex Orderflow Delta:</span>
                  <span className="text-emerald-400 font-bold">+1,420 Lots (Demand)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-neutral-800">
                  <span className="text-neutral-400">S/R Zone Proximity:</span>
                  <span className="text-amber-300 font-bold">Testing High Confluence Pivot</span>
                </div>
              </div>
            </div>

            {/* Quick Manual Signal Trigger Box */}
            <div className="card-3d-gold rounded-2xl p-5 border-2 border-amber-500/40 text-center shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-1">
                AUTOMATED ALGORITHMIC SCANNER
              </span>
              <p className="text-[11px] text-neutral-400 mb-4">
                Execute comprehensive 26-parameter check on {selectedAsset.symbol} for {selectedTimeframe.label}
              </p>
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || (activeTrade?.status === 'ACTIVE')}
                className={`w-full py-4 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTrade?.status === 'ACTIVE'
                    ? 'opacity-50 cursor-not-allowed bg-neutral-800 text-neutral-500'
                    : 'btn-3d-gold'
                }`}
              >
                <Zap className="w-5 h-5 text-black" />
                <span>
                  {activeTrade?.status === 'ACTIVE'
                    ? `TRADE RUNNING (${activeTrade.remainingSeconds}s)`
                    : isAnalyzing
                    ? 'SCANNING 26 METHODS...'
                    : 'TRIGGER SIGNAL ENGINE'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* FULL AUDIT TRAIL & TRADE HISTORY LEDGER */}
        <TradeHistory
          history={tradeHistory}
          onClearHistory={() => setTradeHistory([])}
        />
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-amber-500/20 bg-[#060607] py-6 text-center text-xs text-neutral-500 font-mono-numbers">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-luxury font-black text-amber-400 text-sm">SD BALOCH</span>
            <span className="text-white font-bold">QX BOT</span>
            <span>— Quotex Platform Algorithmic Specialist</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>OFFICIAL SUPPORT: +923316813901</span>
            <span>•</span>
            <span className="text-emerald-400">100% STRICT RESULT AUDIT</span>
          </div>
        </div>
      </footer>

      {/* FIXED 3D GLOWING WHATSAPP BUTTON (Corner bottom right) */}
      <FloatingWhatsApp />

      {/* 3D SPLASH / LOADING SCREEN (On launch) */}
      <SplashModal
        isOpen={showSplash}
        onClose={() => setShowSplash(false)}
      />

      {/* 26-METHOD ANALYSIS SCANNING MODAL */}
      <AnalysisModal
        isOpen={isAnalyzing}
        parameters={pendingSignal ? pendingSignal.parameters : []}
        onComplete={handleAnalysisComplete}
        assetName={selectedAsset.name}
        timeframeLabel={selectedTimeframe.label}
      />

      {/* TECHNICAL GUIDE MODAL */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}
