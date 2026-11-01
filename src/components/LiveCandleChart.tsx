import React, { useEffect, useRef } from 'react';
import { Candle, QuotexAsset, ActiveTrade } from '../types';
import { formatPrice } from '../services/marketEngine';

interface LiveCandleChartProps {
  asset: QuotexAsset;
  candles: Candle[];
  currentPrice: number;
  activeTrade: ActiveTrade | null;
}

export const LiveCandleChart: React.FC<LiveCandleChartProps> = ({
  asset,
  candles,
  currentPrice,
  activeTrade,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Load background image once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = 'https://instasize.com/api/image/da7ac4d55a9ff2b0ccdf4b4c5762eba8dc2ec4a1e5ac90f79938b9152fcec09d.jpeg';
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Draw Background Image or Fallback Dark Theme
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, width, height);
      // Dark overlay taake candles aur text bilkul saaf nazar aayein
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, width, height);
    }

    // Padding margins
    const paddingRight = 75; // For price scale
    const paddingBottom = 26; // For time labels
    const paddingTop = 20;
    const chartWidth = width - paddingRight;
    const chartHeight = height - paddingBottom - paddingTop;

    if (candles.length < 2) return;

    // Calculate price bounds with padding
    const visibleCandles = candles.slice(-30);
    const prices = visibleCandles.flatMap((c) => [c.high, c.low]);
    prices.push(currentPrice);
    if (activeTrade) prices.push(activeTrade.entryPrice);

    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || asset.volatility * 2;
    minPrice -= range * 0.08;
    maxPrice += range * 0.08;
    const totalRange = maxPrice - minPrice;

    const getY = (val: number) => {
      return paddingTop + chartHeight - ((val - minPrice) / totalRange) * chartHeight;
    };

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;

    // Horizontal price grid lines
    const gridSteps = 5;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'left';

    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = minPrice + (totalRange / gridSteps) * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Right axis price text
      ctx.fillText(formatPrice(priceVal, asset.decimals), chartWidth + 8, y + 3);
    }

    // Candle metrics
    const candleCount = visibleCandles.length;
    const candleSlotWidth = chartWidth / candleCount;
    const candleBodyWidth = Math.max(3, candleSlotWidth * 0.65);

    // Support and Resistance dynamic bands
    const high20 = Math.max(...visibleCandles.map((c) => c.high));
    const low20 = Math.min(...visibleCandles.map((c) => c.low));

    // Draw Resistance Line
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, getY(high20));
    ctx.lineTo(chartWidth, getY(high20));
    ctx.stroke();

    // Draw Support Line
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, getY(low20));
    ctx.lineTo(chartWidth, getY(low20));
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw EMA 9 indicator line
    const ema9Coords: { x: number; y: number }[] = [];
    visibleCandles.forEach((_, idx) => {
      const subset = visibleCandles.slice(Math.max(0, idx - 8), idx + 1);
      const avg = subset.reduce((sum, c) => sum + c.close, 0) / subset.length;
      const x = idx * candleSlotWidth + candleSlotWidth / 2;
      ema9Coords.push({ x, y: getY(avg) });
    });

    if (ema9Coords.length > 1) {
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(ema9Coords[0].x, ema9Coords[0].y);
      for (let i = 1; i < ema9Coords.length; i++) {
        ctx.lineTo(ema9Coords[i].x, ema9Coords[i].y);
      }
      ctx.stroke();
    }

    // Draw Candles & Volume
    visibleCandles.forEach((candle, idx) => {
      const isLast = idx === visibleCandles.length - 1;
      const close = isLast ? currentPrice : candle.close;
      const high = isLast ? Math.max(candle.high, currentPrice) : candle.high;
      const low = isLast ? Math.min(candle.low, currentPrice) : candle.low;
      const open = candle.open;

      const isBull = close >= open;
      const color = isBull ? '#22c55e' : '#ef4444';
      const wickColor = isBull ? '#4ade80' : '#f87171';

      const x = idx * candleSlotWidth + candleSlotWidth / 2;
      const yOpen = getY(open);
      const yClose = getY(close);
      const yHigh = getY(high);
      const yLow = getY(low);

      // Volume bar at bottom
      const maxVolHeight = 35;
      const volHeight = Math.min(maxVolHeight, (candle.volume / 1800) * maxVolHeight);
      ctx.fillStyle = isBull ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(
        x - candleBodyWidth / 2,
        height - paddingBottom - volHeight,
        candleBodyWidth,
        volHeight
      );

      // Wick
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

      ctx.fillRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);

      // Subtle glow for the forming candle
      if (isLast) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);
        ctx.shadowBlur = 0;
      }
    });

    // Draw Active Trade Entry Level (Locked)
    if (activeTrade) {
      const entryY = getY(activeTrade.entryPrice);
      const isCall = activeTrade.signal.direction === 'CALL';
      const isWinning = isCall
        ? currentPrice >= activeTrade.entryPrice
        : currentPrice <= activeTrade.entryPrice;

      // Dashed entry horizontal line
      ctx.strokeStyle = isWinning ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(0, entryY);
      ctx.lineTo(chartWidth, entryY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Entry Price Badge
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(chartWidth + 2, entryY - 9, 70, 18);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ENTRY`, chartWidth + 37, entryY + 3);
    }

    // Draw Live Current Price Line & Badge
    const currentY = getY(currentPrice);
    const lastIsBull =
      currentPrice >= visibleCandles[visibleCandles.length - 1].open;
    const currentColor = lastIsBull ? '#22c55e' : '#ef4444';

    // Glowing dotted line across chart
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Price Pill on Right Scale
    ctx.fillStyle = currentColor;
    ctx.shadowColor = currentColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(chartWidth + 4, currentY - 11, 68, 22, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Price Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(formatPrice(currentPrice, asset.decimals), chartWidth + 38, currentY + 3);

  }, [asset, candles, currentPrice, activeTrade]);

  // Calculate live pip difference if active trade exists
  const pipDiff = activeTrade
    ? currentPrice - activeTrade.entryPrice
    : 0;
  const isWinning = activeTrade
    ? activeTrade.signal.direction === 'CALL'
      ? currentPrice > activeTrade.entryPrice
      : currentPrice < activeTrade.entryPrice
    : false;

  return (
    <div className="relative w-full card-3d-gold rounded-2xl p-3 md:p-4 overflow-hidden">
      {/* Top HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-500/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm md:text-base flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {asset.name}
          </span>
          {asset.isOtc && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/40">
              OTC STREAM
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono-numbers">
          {/* EMA Legend */}
          <div className="hidden sm:flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> EMA 9
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> S/R ZONE
            </span>
          </div>

          {/* Live Price Tag */}
          <div className="px-3 py-1 rounded-lg bg-black/80 border border-amber-500/30 text-right">
            <span className="text-[10px] text-neutral-400 block uppercase">LIVE TICK</span>
            <span className="font-bold text-amber-300 text-sm">
              {formatPrice(currentPrice, asset.decimals)}
            </span>
          </div>

          {/* Active Pip Delta */}
          {activeTrade && (
            <div
              className={`px-3 py-1 rounded-lg border font-bold text-xs ${
                isWinning
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                  : 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              }`}
            >
              <span className="text-[10px] block uppercase">
                {isWinning ? 'IN PROFIT' : 'OUT OF MONEY'}
              </span>
              <span>
                {pipDiff >= 0 ? '+' : ''}
                {formatPrice(pipDiff, asset.decimals)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-72 sm:h-80 md:h-96">
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-xl cursor-crosshair"
        />
      </div>

      {/* Bottom Chart Footer Metrics */}
      <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400 font-mono-numbers">
        <div className="flex items-center gap-3">
          <span>HIGH: {formatPrice(Math.max(...candles.map((c) => c.high)), asset.decimals)}</span>
          <span>LOW: {formatPrice(Math.min(...candles.map((c) => c.low)), asset.decimals)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>SD BALOCH PRO QUOTEX ENGINE</span>
        </div>
      </div>
    </div>
  );
};
