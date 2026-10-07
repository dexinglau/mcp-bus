import React from 'react';
import { Bus, Accessibility, Star, ChevronRight, Clock } from 'lucide-react';
import { BusArrivalInfo, NextBus } from '../data/transitData';

interface ArrivalCardProps {
  arrival: BusArrivalInfo;
  isFavorite: boolean;
  onToggleFavorite: (serviceNo: string) => void;
  onSelectRoute: (serviceNo: string) => void;
}

export const ArrivalCard: React.FC<ArrivalCardProps> = ({
  arrival,
  isFavorite,
  onToggleFavorite,
  onSelectRoute,
}) => {
  const getLoadBadge = (load: NextBus['load']) => {
    switch (load) {
      case 'seats':
        return {
          label: 'Seats Avail',
          className: 'bg-[#ecfdf5] text-[#16a34a] border border-[#bbf7d0]',
          indicatorBg: 'bg-[#16a34a]',
        };
      case 'standing':
        return {
          label: 'Standing',
          className: 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]',
          indicatorBg: 'bg-[#d97706]',
        };
      case 'crowded':
        return {
          label: 'Limited Standing',
          className: 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]',
          indicatorBg: 'bg-[#dc2626]',
        };
    }
  };

  const formatCountdown = (mins: number) => {
    if (mins <= 0) {
      return { text: 'Arr', isArriving: true };
    }
    return { text: `${mins} min${mins > 1 ? 's' : ''}`, isArriving: false };
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] hover:border-[#cbd5e1] transition-all">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span className="font-space font-bold text-2xl sm:text-3xl tracking-tight text-[#0f172a] leading-none">
              {arrival.serviceNo}
            </span>
            <span className="text-[10px] uppercase font-space font-semibold text-[#64748b] mt-1 tracking-wider">
              {arrival.operator}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6f2c75] uppercase tracking-wide">
                To:
              </span>
              <h3 className="font-space font-bold text-sm sm:text-base text-[#0f172a] truncate uppercase">
                {arrival.destination}
              </h3>
            </div>
            {arrival.subDestination && (
              <p className="text-xs text-[#64748b] truncate mt-0.5">
                {arrival.subDestination}
              </p>
            )}
            <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] mt-1">
              <span>First: {arrival.firstBus}</span>
              <span aria-hidden="true">·</span>
              <span>Last: {arrival.lastBus}</span>
              {arrival.category !== 'Trunk' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#eb651b] font-medium">{arrival.category}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleFavorite(arrival.serviceNo)}
            aria-label={isFavorite ? 'Remove from saved favorites' : 'Save to favorites'}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isFavorite
                ? 'text-[#eb651b] bg-[#fff7ed]'
                : 'text-[#94a3b8] hover:text-[#eb651b] hover:bg-[#f8fafc]'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#eb651b]' : ''}`} />
          </button>
          
          <button
            onClick={() => onSelectRoute(arrival.serviceNo)}
            title="View Route & Stops"
            className="flex items-center gap-1 text-xs text-[#6f2c75] hover:text-[#5a1e62] bg-[#fbf5fc] hover:bg-[#f6ebf8] border border-[#f0d8f3] px-2.5 py-1.5 rounded font-space font-semibold transition-colors cursor-pointer"
          >
            <span>Route</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Sequential Arrival Slots */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3">
        {arrival.nextBuses.map((bus, idx) => {
          const slotLabel = idx === 0 ? 'Next' : idx === 1 ? '2nd Bus' : '3rd Bus';
          const countdown = formatCountdown(bus.arrivalMinutes);
          const badge = getLoadBadge(bus.load);

          return (
            <div
              key={idx}
              className={`rounded p-2.5 flex flex-col justify-between border transition-all ${
                idx === 0
                  ? 'bg-[#fafafa] border-[#e2e8f0]'
                  : 'bg-white border-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#64748b] mb-1">
                <span className="font-space font-medium uppercase tracking-wider text-[10px]">
                  {slotLabel}
                </span>
                <div className="flex items-center gap-1">
                  {bus.wheelchair && (
                    <Accessibility
                      className="w-3 h-3 text-[#64748b]"
                      aria-label="Wheelchair accessible bus"
                    />
                  )}
                  <span className="text-[10px] font-mono px-1 rounded bg-[#e2e8f0] text-[#334155] font-semibold">
                    {bus.type}
                  </span>
                </div>
              </div>

              {/* Countdown Numbers */}
              <div className="my-1.5 flex items-baseline gap-1">
                <span
                  className={`font-space font-bold text-xl sm:text-2xl tabular-nums tracking-tight ${
                    countdown.isArriving ? 'text-[#16a34a]' : 'text-[#0f172a]'
                  }`}
                >
                  {countdown.text}
                </span>
              </div>

              {/* Occupancy Indicator */}
              <div
                className={`text-[10px] font-space font-semibold px-2 py-0.5 rounded flex items-center gap-1.5 w-fit ${badge.className}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badge.indicatorBg}`}></span>
                <span className="truncate">{badge.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
