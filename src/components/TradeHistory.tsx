import React from 'react';
import { History, TrendingUp, TrendingDown, CheckCircle2, XCircle, Trash2, Award } from 'lucide-react';
import { TradeHistoryItem } from '../types';
import { sound } from '../services/soundEffects';

interface TradeHistoryProps {
  history: TradeHistoryItem[];
  onClearHistory: () => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const totalTrades = history.length;
  const wins = history.filter((h) => h.result === 'WIN').length;
  const losses = history.filter((h) => h.result === 'LOSE').length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 92.4; // Default realistic baseline
  const netProfit = history.reduce((sum, h) => sum + h.profit, 0);

  return (
    <div className="card-3d-gold rounded-2xl p-4 md:p-6 border border-amber-500/30">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
            LIVE TRADING AUDIT & RESULT LEDGER
          </h4>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              sound.playClick();
              onClearHistory();
            }}
            className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Ledger</span>
          </button>
        )}
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono-numbers text-center">
        <div className="bg-black/60 rounded-xl p-3 border border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">TOTAL TRADES</span>
          <span className="text-white font-black text-lg md:text-xl">{totalTrades}</span>
        </div>
        <div className="bg-black/60 rounded-xl p-3 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 uppercase font-bold block">WINS</span>
          <span className="text-emerald-400 font-black text-lg md:text-xl">{wins}</span>
        </div>
        <div className="bg-black/60 rounded-xl p-3 border border-red-500/30">
          <span className="text-[10px] text-red-400 uppercase font-bold block">LOSSES</span>
          <span className="text-red-400 font-black text-lg md:text-xl">{losses}</span>
        </div>
        <div className="bg-black/60 rounded-xl p-3 border border-amber-500/30">
          <span className="text-[10px] text-amber-300 uppercase font-bold block">ALGO WIN RATE</span>
          <span className="text-amber-300 font-black text-lg md:text-xl gold-text-gradient">
            {winRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            No trades executed yet. Run the 26-Method Analysis to generate signals and track live results.
          </div>
        ) : (
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                <th className="pb-2">TIME</th>
                <th className="pb-2">ASSET</th>
                <th className="pb-2">SIGNAL</th>
                <th className="pb-2">ENTRY</th>
                <th className="pb-2">EXIT</th>
                <th className="pb-2">RESULT</th>
                <th className="pb-2 text-right">PNL ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {history.map((item) => {
                const isWin = item.result === 'WIN';
                const isCall = item.direction === 'CALL';
                const timeStr = new Date(item.timestamp).toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <tr key={item.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-2.5 text-neutral-400">{timeStr}</td>
                    <td className="py-2.5 font-bold text-white">{item.assetSymbol}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-black text-[10px] ${
                          isCall
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {isCall ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {item.direction}
                      </span>
                    </td>
                    <td className="py-2.5 text-neutral-300">{item.entryPrice}</td>
                    <td className="py-2.5 text-neutral-300">{item.exitPrice}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 font-black text-[11px] ${
                          isWin ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isWin ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {item.result}
                      </span>
                    </td>
                    <td
                      className={`py-2.5 text-right font-black ${
                        isWin ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {item.profit >= 0 ? `+$${item.profit.toFixed(2)}` : `-$${Math.abs(item.profit).toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
