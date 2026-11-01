import { Candle, QuotexAsset, TimeframeOption } from '../types';

export const TIMEFRAMES: TimeframeOption[] = [
  { id: '30s', label: '30s Turbo', seconds: 30, sublabel: 'High Speed Scalp' },
  { id: '1m', label: '1 Minute', seconds: 60, sublabel: 'Standard Binary' },
  { id: '5m', label: '5 Minutes', seconds: 300, sublabel: 'Trend Reversal' },
  { id: '10m', label: '10 Minutes', seconds: 600, sublabel: 'Structure Swing' },
];

export const QUOTEX_ASSETS: QuotexAsset[] = [
  // OTC Pairs (Quotex Platform Staples)
  { id: 'eurusd-otc', name: 'EUR/USD (OTC)', symbol: 'EUR/USD (OTC)', category: 'OTC', payout: 93, basePrice: 1.08450, decimals: 5, isOtc: true, volatility: 0.00012 },
  { id: 'gbpusd-otc', name: 'GBP/USD (OTC)', symbol: 'GBP/USD (OTC)', category: 'OTC', payout: 91, basePrice: 1.29320, decimals: 5, isOtc: true, volatility: 0.00015 },
  { id: 'usdpkr-otc', name: 'USD/PKR (OTC)', symbol: 'USD/PKR (OTC)', category: 'OTC', payout: 94, basePrice: 278.45, decimals: 2, isOtc: true, volatility: 0.08 },
  { id: 'usdinr-otc', name: 'USD/INR (OTC)', symbol: 'USD/INR (OTC)', category: 'OTC', payout: 92, basePrice: 84.15, decimals: 2, isOtc: true, volatility: 0.04 },
  { id: 'usdbrl-otc', name: 'USD/BRL (OTC)', symbol: 'USD/BRL (OTC)', category: 'OTC', payout: 90, basePrice: 5.7620, decimals: 4, isOtc: true, volatility: 0.003 },
  { id: 'audcad-otc', name: 'AUD/CAD (OTC)', symbol: 'AUD/CAD (OTC)', category: 'OTC', payout: 89, basePrice: 0.91240, decimals: 5, isOtc: true, volatility: 0.00014 },
  { id: 'usdtry-otc', name: 'USD/TRY (OTC)', symbol: 'USD/TRY (OTC)', category: 'OTC', payout: 91, basePrice: 34.280, decimals: 3, isOtc: true, volatility: 0.015 },

  // Live Forex
  { id: 'eurusd', name: 'EUR/USD', symbol: 'EUR/USD', category: 'CURRENCIES', payout: 88, basePrice: 1.08620, decimals: 5, isOtc: false, volatility: 0.00008 },
  { id: 'gbpusd', name: 'GBP/USD', symbol: 'GBP/USD', category: 'CURRENCIES', payout: 87, basePrice: 1.29850, decimals: 5, isOtc: false, volatility: 0.00010 },
  { id: 'usdjpy', name: 'USD/JPY', symbol: 'USD/JPY', category: 'CURRENCIES', payout: 88, basePrice: 153.240, decimals: 3, isOtc: false, volatility: 0.04 },
  { id: 'audusd', name: 'AUD/USD', symbol: 'AUD/USD', category: 'CURRENCIES', payout: 85, basePrice: 0.65820, decimals: 5, isOtc: false, volatility: 0.00008 },
  { id: 'usdcad', name: 'USD/CAD', symbol: 'USD/CAD', category: 'CURRENCIES', payout: 86, basePrice: 1.38910, decimals: 5, isOtc: false, volatility: 0.00009 },

  // Crypto
  { id: 'btcusd', name: 'Bitcoin (BTC/USD)', symbol: 'BTC/USD', category: 'CRYPTO', payout: 90, basePrice: 69420.00, decimals: 2, isOtc: false, volatility: 35.0 },
  { id: 'ethusd', name: 'Ethereum (ETH/USD)', symbol: 'ETH/USD', category: 'CRYPTO', payout: 88, basePrice: 2518.50, decimals: 2, isOtc: false, volatility: 2.8 },
  { id: 'solusd', name: 'Solana (SOL/USD)', symbol: 'SOL/USD', category: 'CRYPTO', payout: 89, basePrice: 178.60, decimals: 2, isOtc: false, volatility: 0.45 },
  { id: 'xrpusd', name: 'Ripple (XRP/USD)', symbol: 'XRP/USD', category: 'CRYPTO', payout: 87, basePrice: 0.5218, decimals: 4, isOtc: false, volatility: 0.0018 },

  // Commodities
  { id: 'xauusd', name: 'Gold (XAU/USD)', symbol: 'Gold', category: 'COMMODITIES', payout: 92, basePrice: 2742.80, decimals: 2, isOtc: false, volatility: 1.4 },
  { id: 'crudeoil', name: 'US Crude Oil', symbol: 'Crude Oil', category: 'COMMODITIES', payout: 86, basePrice: 69.40, decimals: 2, isOtc: false, volatility: 0.12 },
];

/**
 * Generate synthetic historical candles for realistic technical analysis & rendering
 */
export function generateInitialCandles(asset: QuotexAsset, count = 35): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const intervalMs = 60000; // 1-minute base candle
  let currentPrice = asset.basePrice;

  // Initial trend bias
  let trendBias = (Math.random() - 0.48) * asset.volatility * 0.8;

  for (let i = count; i >= 1; i--) {
    const time = now - i * intervalMs;
    // Periodic trend shifts
    if (i % 8 === 0) {
      trendBias = (Math.random() - 0.48) * asset.volatility * 1.2;
    }

    const open = currentPrice;
    const change = trendBias + (Math.random() - 0.5) * asset.volatility * 2.2;
    const close = Number((open + change).toFixed(asset.decimals));
    const higher = Math.max(open, close);
    const lower = Math.min(open, close);
    const wickHigh = Math.random() * asset.volatility * 1.5;
    const wickLow = Math.random() * asset.volatility * 1.5;

    const high = Number((higher + wickHigh).toFixed(asset.decimals));
    const low = Number((lower - wickLow).toFixed(asset.decimals));
    const volume = Math.floor(400 + Math.random() * 1200);

    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    });

    currentPrice = close;
  }

  return candles;
}

/**
 * Format price according to asset decimal precision
 */
export function formatPrice(price: number, decimals: number): string {
  return price.toFixed(decimals);
}
