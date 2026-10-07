import React, { useState } from 'react';
import {
  Bus,
  ArrowRight,
  Clock,
  Compass,
  MapPin,
  CheckCircle,
  Accessibility,
  CornerDownRight,
  ChevronRight,
  Layers,
} from 'lucide-react';
import {
  BUS_ROUTES_DATABASE,
  BusRouteDetails,
  MRT_LINE_COLORS,
  BusStop,
  BUS_STOPS_DATABASE,
} from '../data/transitData';

interface RouteExplorerProps {
  selectedServiceNo: string;
  onSelectServiceNo: (serviceNo: string) => void;
  onJumpToStop: (stopCode: string) => void;
}

export const RouteExplorer: React.FC<RouteExplorerProps> = ({
  selectedServiceNo,
  onSelectServiceNo,
  onJumpToStop,
}) => {
  const availableServices = Object.keys(BUS_ROUTES_DATABASE);
  const currentServiceKey = availableServices.includes(selectedServiceNo)
    ? selectedServiceNo
    : availableServices[0];

  const route: BusRouteDetails = BUS_ROUTES_DATABASE[currentServiceKey];
  const [direction, setDirection] = useState<1 | 2>(1);

  return (
    <div className="space-y-6">
      {/* Route Service Selector Header */}
      <div className="bg-white border border-[#e2e8f0] rounded p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-space font-bold text-3xl sm:text-4xl text-[#0f172a]">
                Bus {route.serviceNo}
              </span>
              <span className="bg-[#6f2c75] text-white text-xs px-2.5 py-1 rounded font-space font-semibold uppercase">
                {route.operator}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#475569] mt-2">
              <span className="font-semibold text-[#0f172a]">{route.origin}</span>
              <ArrowRight className="w-4 h-4 text-[#eb651b]" />
              <span className="font-semibold text-[#0f172a]">{route.destination}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b] mt-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6f2c75]" />
                <span>Weekday Operating Hours:</span>
                <span className="font-mono font-medium text-[#0f172a]">
                  {route.firstBusWeekday} - {route.lastBusWeekday}
                </span>
              </div>
              <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
              <div className="flex items-center gap-1.5">
                <span>Peak Frequency:</span>
                <span className="font-semibold text-[#eb651b] font-space">{route.frequencyPeak}</span>
              </div>
              <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
              <div className="flex items-center gap-1.5">
                <span>Off-Peak:</span>
                <span className="font-medium text-[#0f172a] font-space">{route.frequencyOffPeak}</span>
              </div>
            </div>
          </div>

          {/* Quick Route Switcher */}
          <div className="shrink-0 flex flex-col gap-2">
            <label className="text-xs font-space font-semibold uppercase tracking-wider text-[#64748b]">
              Select Service Route
            </label>
            <div className="flex items-center gap-1.5 bg-[#f1f5f9] p-1 rounded border border-[#e2e8f0]">
              {availableServices.map((srv) => (
                <button
                  key={srv}
                  onClick={() => onSelectServiceNo(srv)}
                  className={`cursor-pointer px-3 py-1.5 rounded font-space font-bold text-xs transition-colors ${
                    currentServiceKey === srv
                      ? 'bg-[#6f2c75] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {srv}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Route Direction Switcher & Legend */}
      <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection(1)}
            className={`cursor-pointer px-3.5 py-1.5 rounded text-xs font-space font-bold transition-all ${
              direction === 1
                ? 'bg-[#6f2c75] text-white'
                : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
            }`}
          >
            Direction 1 (to {route.destination.split(' ')[0]})
          </button>
          <button
            onClick={() => setDirection(2)}
            className={`cursor-pointer px-3.5 py-1.5 rounded text-xs font-space font-bold transition-all ${
              direction === 2
                ? 'bg-[#6f2c75] text-white'
                : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
            }`}
          >
            Direction 2 (to {route.origin.split(' ')[0]})
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#64748b]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
            <span>Bus approaching</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6f2c75]"></span>
            <span>Interchange / MRT</span>
          </span>
        </div>
      </div>

      {/* Metro-Style Transit Stop Sequence Diagram */}
      <div className="bg-white border border-[#e2e8f0] rounded p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="mb-4 pb-3 border-b border-[#f1f5f9] flex items-center justify-between">
          <h3 className="font-space font-bold text-base text-[#0f172a] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6f2c75]" />
            <span>Interactive Stop Sequence & Line Schematic</span>
          </h3>
          <span className="text-xs text-[#64748b] font-medium">
            Total {route.stops.length} Fare Stages / Stops
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6">
          {/* Vertical Metro Line Rail */}
          <div className="absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-1 bg-[#6f2c75]/25 -translate-x-1/2 rounded"></div>

          {route.stops.map((node, index) => {
            const isFirst = index === 0;
            const isLast = index === route.stops.length - 1;
            const hasApproachingBus = index === 7 || index === 2; // Simulated live bus tracking

            return (
              <div key={node.stopCode} className="relative flex items-start gap-4 group">
                {/* Metro Node Circle */}
                <div
                  className={`absolute -left-[15px] sm:-left-[19px] -translate-x-1/2 top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isFirst || isLast
                      ? 'bg-[#6f2c75] text-white ring-4 ring-[#6f2c75]/20 font-bold text-[10px]'
                      : node.mrtTransfer
                      ? 'bg-white border-3 border-[#6f2c75] ring-2 ring-purple-100'
                      : 'bg-white border-2 border-[#94a3b8]'
                  }`}
                >
                  {isFirst ? 'A' : isLast ? 'B' : node.seq}
                </div>

                {/* Node Details Card */}
                <div className="flex-1 bg-[#f8fafc] group-hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded p-3 sm:p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#6f2c75] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {node.stopCode}
                        </span>
                        <h4 className="font-space font-bold text-sm sm:text-base text-[#0f172a]">
                          {node.stopName}
                        </h4>

                        {/* Connected MRT Lines */}
                        {node.mrtTransfer && (
                          <div className="flex items-center gap-1">
                            {node.mrtTransfer.map((code) => {
                              const linePrefix = code.slice(0, 2);
                              return (
                                <span
                                  key={code}
                                  className="text-[10px] font-space font-bold px-1.5 py-0.5 rounded text-white bg-[#6f2c75]"
                                >
                                  {code}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#64748b] mt-1">
                        <span>{node.roadName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px]">{node.distanceKm.toFixed(1)} km</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[11px]">Stage {node.fareStage}</span>
                      </div>
                    </div>

                    {/* Action buttons & live approaching bus pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      {hasApproachingBus && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ecfdf5] border border-[#a7f3d0] text-[#16a34a] text-xs font-space font-semibold animate-pulse">
                          <Bus className="w-3.5 h-3.5" />
                          <span>Bus Approaching (Seats)</span>
                        </div>
                      )}

                      <button
                        onClick={() => onJumpToStop(node.stopCode)}
                        className="cursor-pointer text-xs font-space font-semibold text-[#6f2c75] hover:text-[#5a1e62] bg-white hover:bg-purple-50 border border-[#e2e8f0] px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                      >
                        <span>View Stop</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
