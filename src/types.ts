export type AssetCategory = 'OTC' | 'CURRENCIES' | 'CRYPTO' | 'COMMODITIES';

export interface QuotexAsset {
  id: string;
  name: string;
  symbol: string;
  category: AssetCategory;
  payout: number; // e.g. 92%
  basePrice: number;
  decimals: number;
  isOtc: boolean;
  volatility: number;
}

export type TimeframeId = '30s' | '1m' | '5m' | '10m';

export interface TimeframeOption {
  id: TimeframeId;
  label: string;
  seconds: number;
  sublabel: string;
}

export type SignalDirection = 'CALL' | 'PUT';

export interface AnalysisParameter {
  id: string;
  name: string;
  category: 'Price Action' | 'Candle Patterns' | 'Market Structure' | 'Support & Resistance' | 'Volume & Momentum';
  status: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number; // 0 to 100
  detail: string;
  weight: number;
}

export interface TradingSignal {
  id: string;
  asset: QuotexAsset;
  timeframe: TimeframeOption;
  direction: SignalDirection;
  confidence: number; // e.g. 93.4
  entryPrice: number;
  targetPayout: number;
  martingaleRecommendation: 'Direct WIN (No MTG)' | '1-Step MTG Safe' | 'Volume Confirmed';
  parameters: AnalysisParameter[];
  createdAt: number;
  expiryAt: number;
}

export type TradeResultStatus = 'IDLE' | 'ANALYZING' | 'ACTIVE' | 'WON' | 'LOST' | 'TIE';

export interface ActiveTrade {
  signal: TradingSignal;
  stake: number;
  entryPrice: number;
  currentPrice: number;
  remainingSeconds: number;
  totalSeconds: number;
  status: TradeResultStatus;
  resultProfit?: number;
  exitPrice?: number;
  completedAt?: number;
}

export interface TradeHistoryItem {
  id: string;
  timestamp: number;
  assetSymbol: string;
  direction: SignalDirection;
  timeframe: string;
  entryPrice: number;
  exitPrice: number;
  confidence: number;
  stake: number;
  payoutPercent: number;
  profit: number;
  result: 'WIN' | 'LOSE' | 'TIE';
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
