import React from 'react';
import {
  Compass,
  Star,
  AlertTriangle,
  Bookmark,
  Bus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  BusStop,
  ServiceAdvisory,
  BUS_ARRIVALS_MOCK,
} from '../data/transitData';

interface SidebarProps {
  currentStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  favorites: string[];
  onRemoveFavorite: (serviceNo: string) => void;
  onSelectRoute: (serviceNo: string) => void;
  advisories: ServiceAdvisory[];
  onOpenAdvisories: () => void;
  activeFilter: 'all' | 'trunk' | 'express';
  setActiveFilter: (filter: 'all' | 'trunk' | 'express') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStop,
  onSelectStop,
  favorites,
  onRemoveFavorite,
  onSelectRoute,
  advisories,
  onOpenAdvisories,
  activeFilter,
  setActiveFilter,
}) => {
  const activeAdvisories = advisories.filter((a) => a.status === 'Active');

  return (
    <aside className="space-y-6">
      {/* Visual Totem Card */}
      <div className="bg-white border border-[#e2e8f0] rounded overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="relative h-36 bg-[#1e293b] overflow-hidden">
          <img
            src="/src/assets/images/transit_wayfinding_totem_1791347733136.jpg"
            alt="Metropolitan transit wayfinding digital totem"
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback container
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent p-3.5 flex flex-col justify-end text-white">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#eb651b]">
              Public Transport Network
            </span>
            <h4 className="font-space font-bold text-base leading-tight">
              Singapore Civic Wayfinding
            </h4>
            <p className="text-[11px] text-slate-300">
              Real-time LTA Data Standards & Fleet Telemetry
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-white border-t border-[#f1f5f9] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Systems Normal</span>
          </div>
          <span className="font-mono text-[#64748b] text-[11px]">LTA API v2.8</span>
        </div>
      </div>

      {/* Service Category Filter */}
      <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <h3 className="font-space font-bold text-xs uppercase tracking-wider text-[#64748b] mb-3">
          Service Category Filter
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-space font-semibold transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#6f2c75] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            <span>All Services at Stop</span>
            <span className="font-mono">{currentStop.services.length}</span>
          </button>

          <button
            onClick={() => setActiveFilter('trunk')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-space font-semibold transition-colors cursor-pointer ${
              activeFilter === 'trunk'
                ? 'bg-[#6f2c75] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            <span>Basic Trunk Lines</span>
            <span className="font-mono">
              {currentStop.services.filter((s) => !['502', '518', '190', '960'].includes(s)).length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('express')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-space font-semibold transition-colors cursor-pointer ${
              activeFilter === 'express'
                ? 'bg-[#6f2c75] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            <span>Express & City Direct</span>
            <span className="font-mono">
              {currentStop.services.filter((s) => ['502', '518', '190', '960'].includes(s)).length}
            </span>
          </button>
        </div>
      </div>

      {/* Active Service Advisories Alert Box */}
      {activeAdvisories.length > 0 && (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-space font-bold text-xs uppercase tracking-wide text-[#92400e]">
                Active Transit Advisory
              </h4>
              <p className="text-xs text-[#78350f] font-medium mt-1 leading-snug">
                {activeAdvisories[0].title}
              </p>
              <div className="mt-2.5 flex items-center justify-between">
                <button
                  onClick={onOpenAdvisories}
                  className="cursor-pointer text-xs font-space font-bold text-[#b45309] hover:text-[#78350f] underline flex items-center gap-1"
                >
                  <span>View Details & Affected Routes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Favorites Widget */}
      <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-space font-bold text-xs uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#eb651b] fill-[#eb651b]" />
            <span>Saved Bus Services</span>
          </h3>
          <span className="text-[11px] font-mono text-[#94a3b8] font-semibold">
            {favorites.length} pinned
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-4 px-2 border border-dashed border-[#e2e8f0] rounded">
            <Bookmark className="w-5 h-5 text-[#94a3b8] mx-auto mb-1.5" />
            <p className="text-xs text-[#64748b]">No pinned services yet.</p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Click the star icon on any arrival card to bookmark.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {favorites.map((serviceNo) => (
              <div
                key={serviceNo}
                className="flex items-center justify-between p-2 rounded bg-[#f8fafc] border border-[#f1f5f9] hover:border-[#e2e8f0] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-9 h-7 rounded bg-[#6f2c75] text-white flex items-center justify-center font-space font-bold text-sm">
                    {serviceNo}
                  </span>
                  <span className="text-xs font-medium text-[#0f172a]">Service {serviceNo}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectRoute(serviceNo)}
                    className="cursor-pointer text-[11px] font-space font-semibold text-[#6f2c75] hover:text-[#5a1e62] px-2 py-1 rounded hover:bg-white"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(serviceNo)}
                    className="cursor-pointer text-[11px] text-[#94a3b8] hover:text-red-600 px-1.5 py-1"
                    title="Remove favorite"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transit Capacity Guide */}
      <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] text-xs">
        <h3 className="font-space font-bold text-xs uppercase tracking-wider text-[#64748b] mb-2.5">
          Occupancy Color Standards
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] shrink-0"></span>
            <span className="font-medium text-[#0f172a]">Seats Available:</span>
            <span className="text-[#64748b]">Seated capacity free</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] shrink-0"></span>
            <span className="font-medium text-[#0f172a]">Standing:</span>
            <span className="text-[#64748b]">Standing spaces available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shrink-0"></span>
            <span className="font-medium text-[#0f172a]">Limited Standing:</span>
            <span className="text-[#64748b]">Crowded / limited room</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
