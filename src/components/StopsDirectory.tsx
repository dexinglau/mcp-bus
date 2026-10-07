import React, { useState } from 'react';
import { MapPin, Navigation, Bus, Search, ArrowUpRight } from 'lucide-react';
import { BusStop, BUS_STOPS_DATABASE, MRT_LINE_COLORS } from '../data/transitData';

interface StopsDirectoryProps {
  onSelectStop: (stop: BusStop) => void;
  currentStopCode: string;
}

export const StopsDirectory: React.FC<StopsDirectoryProps> = ({
  onSelectStop,
  currentStopCode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStops = BUS_STOPS_DATABASE.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.code.includes(searchTerm) ||
      stop.road.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.services.some((s) => s.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Banner Card */}
      <div className="bg-white border border-[#e2e8f0] rounded overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="relative h-44 sm:h-52 bg-[#0f172a] overflow-hidden">
          <img
            src="/src/assets/images/transit_hub_terminal_1791347712299.jpg"
            alt="Civic transit interchange and terminal"
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent p-6 flex flex-col justify-end text-white">
            <span className="text-xs font-space font-bold uppercase tracking-wider text-[#eb651b]">
              Civic Transport Infrastructure
            </span>
            <h2 className="font-space font-bold text-2xl sm:text-3xl">
              Major Bus Interchanges & Terminals
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              Connect effortlessly across Singapore's unified bus, rail, and active mobility corridors.
            </p>
          </div>
        </div>

        {/* Search input in directory */}
        <div className="p-4 bg-white border-t border-[#f1f5f9]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by stop code (e.g. 09048), station name, road, or bus service..."
              className="w-full h-11 pl-10 pr-4 bg-[#f8fafc] border border-[#e2e8f0] rounded text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#6f2c75] focus:bg-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of Bus Stops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredStops.map((stop) => {
          const isSelected = stop.code === currentStopCode;
          return (
            <div
              key={stop.code}
              className={`bg-white border rounded p-5 transition-all shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between ${
                isSelected
                  ? 'border-[#6f2c75] ring-2 ring-[#6f2c75]/15'
                  : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-[#6f2c75] text-white px-2.5 py-0.5 rounded font-mono font-bold text-xs tracking-wider">
                    <span>{stop.code}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {stop.mrtConnections.map((mrt) => (
                      <span
                        key={mrt.code}
                        className="text-[10px] font-space font-bold px-1.5 py-0.5 rounded text-white"
                        style={{
                          backgroundColor: mrt.color,
                          color: MRT_LINE_COLORS[mrt.line]?.text || '#ffffff',
                        }}
                      >
                        {mrt.code}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-space font-bold text-lg text-[#0f172a]">
                  {stop.name}
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">{stop.road}</p>
                <p className="text-[11px] text-[#94a3b8] mt-1 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#eb651b]" />
                  <span>{stop.directionDesc}</span>
                </p>

                {/* Available Services */}
                <div className="mt-3 pt-3 border-t border-[#f1f5f9]">
                  <span className="text-[11px] font-space font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5">
                    Operating Services ({stop.services.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {stop.services.slice(0, 10).map((srv) => (
                      <span
                        key={srv}
                        className="px-1.5 py-0.5 bg-[#f1f5f9] text-[#334155] rounded text-[11px] font-mono font-semibold"
                      >
                        {srv}
                      </span>
                    ))}
                    {stop.services.length > 10 && (
                      <span className="text-[11px] text-[#94a3b8] font-mono px-1">
                        +{stop.services.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex justify-end">
                <button
                  onClick={() => onSelectStop(stop)}
                  className="cursor-pointer text-xs font-space font-bold uppercase tracking-wider text-[#6f2c75] hover:text-[#5a1e62] flex items-center gap-1"
                >
                  <span>View Live Arrivals</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
