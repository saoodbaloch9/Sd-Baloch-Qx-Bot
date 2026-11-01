import React from 'react';
import { DollarSign, ShieldAlert, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface RiskCalculatorProps {
  stake: number;
  onStakeChange: (stake: number) => void;
  payoutPercent: number;
  disabled?: boolean;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  stake,
  onStakeChange,
  payoutPercent,
  disabled = false,
}) => {
  const quickStakes = [10, 25, 50, 100, 250, 500];
  const netProfit = (stake * (payoutPercent / 100)).toFixed(2);
  const totalReturn = (stake + Number(netProfit)).toFixed(2);

  // 1-Step Martingale Multiplier (Quotex standard is 2.2x to 2.3x)
  const mtgStep1 = Math.round(stake * 2.2);
  const mtgReturn = (mtgStep1 * (payoutPercent / 100) - stake).toFixed(2);

  const handleSelectStake = (val: number) => {
    sound.playClick();
    onStakeChange(val);
  };

  return (
    <div className="card-3d-gold rounded-2xl p-4 md:p-5 border border-amber-500/30">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/20">
        <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" />
          <span>QUOTEX RISK & MONEY MANAGEMENT</span>
        </label>
        <span className="text-[11px] font-mono-numbers text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          PAYOUT: +{payoutPercent}%
        </span>
      </div>

      {/* Quick Stake Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
        {quickStakes.map((val) => {
          const isSelected = stake === val;
          return (
            <button
              key={val}
              type="button"
              disabled={disabled}
              onClick={() => handleSelectStake(val)}
              className={`py-2 rounded-xl text-xs font-black font-mono-numbers transition-all cursor-pointer ${
                isSelected
                  ? 'btn-3d-gold'
                  : 'bg-black/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-300'
              }`}
            >
              ${val}
            </button>
          );
        })}
      </div>

      {/* Custom Stake Input & Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-numbers text-xs">
        {/* Input */}
        <div className="bg-black/60 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
            CUSTOM STAKE ($)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-extrabold text-base">$</span>
            <input
              type="number"
              min="1"
              max="50000"
              value={stake}
              disabled={disabled}
              onChange={(e) => {
                const val = Math.max(1, Number(e.target.value) || 1);
                onStakeChange(val);
              }}
              className="w-full bg-transparent text-white font-black text-lg focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Expected Net Profit */}
        <div className="bg-black/60 rounded-xl p-3 border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
            NET WIN PROFIT
          </span>
          <div>
            <span className="text-emerald-400 font-black text-lg block">
              +${netProfit}
            </span>
            <span className="text-[10px] text-neutral-500">
              Total Return: ${totalReturn}
            </span>
          </div>
        </div>

        {/* 1-Step Martingale Recovery */}
        <div className="bg-black/60 rounded-xl p-3 border border-amber-500/30 flex flex-col justify-between">
          <span className="text-[10px] text-amber-300 uppercase font-bold block mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>1-STEP MTG SAFEGUARD</span>
          </span>
          <div>
            <span className="text-amber-300 font-black text-lg block">
              ${mtgStep1} <span className="text-xs text-neutral-400 font-normal">(x2.2)</span>
            </span>
            <span className="text-[10px] text-neutral-500">
              Recovers Drawdown + Net +${mtgReturn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
