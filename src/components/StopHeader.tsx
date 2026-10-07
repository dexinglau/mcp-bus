import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, Info } from 'lucide-react';
import { BusStop, MRT_LINE_COLORS } from '../data/transitData';

interface StopHeaderProps {
  currentStop: BusStop;
  allStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
}

export const StopHeader: React.FC<StopHeaderProps> = ({
  currentStop,
  allStops,
  onSelectStop,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentStop.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* 5-digit bus stop code */}
            <div className="flex items-center gap-1.5 bg-[#6f2c75] text-white px-3 py-1 rounded font-space font-bold text-sm tracking-wider shadow-sm">
              <span className="text-[10px] text-purple-200 uppercase tracking-widest">STOP</span>
              <span className="font-mono text-base">{currentStop.code}</span>
            </div>

            <button
              onClick={handleCopyCode}
              title="Copy Bus Stop Code"
              className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#6f2c75] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] px-2 py-1 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* MRT Interchange badges */}
            {currentStop.mrtConnections.map((mrt) => (
              <div
                key={mrt.code}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-space font-bold shadow-xs"
                style={{
                  backgroundColor: mrt.color,
                  color: MRT_LINE_COLORS[mrt.line]?.text || '#ffffff',
                }}
                title={`${mrt.name} (${MRT_LINE_COLORS[mrt.line]?.name || mrt.line})`}
              >
                <span>{mrt.code}</span>
                <span className="text-[10px] opacity-90 hidden sm:inline">{mrt.name}</span>
              </div>
            ))}
          </div>

          <h2 className="font-space font-bold text-2xl sm:text-3xl text-[#0f172a] tracking-tight">
            {currentStop.name}
          </h2>

          <div className="flex items-center gap-2 text-sm text-[#475569] mt-1">
            <span className="font-medium text-[#0f172a]">{currentStop.road}</span>
            <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
            <span className="flex items-center gap-1 text-xs text-[#64748b]">
              <Navigation className="w-3.5 h-3.5 text-[#eb651b]" />
              {currentStop.directionDesc}
            </span>
          </div>

          {currentStop.landmarks.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[#f1f5f9] text-xs text-[#64748b]">
              <span className="font-medium text-[#475569]">Nearby:</span>
              {currentStop.landmarks.map((landmark, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="hover:text-[#0f172a]">{landmark}</span>
                  {idx < currentStop.landmarks.length - 1 && (
                    <span className="text-[#cbd5e1]">·</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stop Switcher Select */}
        <div className="shrink-0 sm:w-64">
          <label className="block text-xs font-space font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
            Switch Bus Stop
          </label>
          <select
            value={currentStop.code}
            onChange={(e) => {
              const selected = allStops.find((s) => s.code === e.target.value);
              if (selected) onSelectStop(selected);
            }}
            className="w-full h-11 px-3 bg-white border border-[#e2e8f0] focus:border-[#6f2c75] focus:ring-2 focus:ring-[#6f2c75]/15 rounded text-sm text-[#0f172a] font-medium outline-none cursor-pointer transition-all"
          >
            {allStops.map((stop) => (
              <option key={stop.code} value={stop.code}>
                [{stop.code}] {stop.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
