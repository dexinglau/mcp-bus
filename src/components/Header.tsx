import React from 'react';
import { RotateCw, Compass, Clock, MapPin, Bell } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date;
  activeAlertsCount: number;
  onOpenApiMonitor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  lastUpdated,
  activeAlertsCount,
  onOpenApiMonitor,
}) => {
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark (Space Grotesk) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#6f2c75] text-white flex items-center justify-center font-space font-bold text-lg shadow-sm">
            M
          </div>
          <button 
            onClick={() => setActiveTab('arrivals')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-space font-bold text-xl sm:text-2xl tracking-tight text-[#0f172a] group-hover:text-[#6f2c75] transition-colors">
              Metropolitan Transit
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#475569]">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`cursor-pointer transition-colors py-1 relative ${
              activeTab === 'arrivals'
                ? 'text-[#6f2c75] font-semibold border-b-2 border-[#6f2c75]'
                : 'hover:text-[#0f172a]'
            }`}
          >
            Live Arrivals
          </button>
          <button
            onClick={() => setActiveTab('stops')}
            className={`cursor-pointer transition-colors py-1 relative ${
              activeTab === 'stops'
                ? 'text-[#6f2c75] font-semibold border-b-2 border-[#6f2c75]'
                : 'hover:text-[#0f172a]'
            }`}
          >
            Stops & Terminals
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`cursor-pointer transition-colors py-1 relative ${
              activeTab === 'routes'
                ? 'text-[#6f2c75] font-semibold border-b-2 border-[#6f2c75]'
                : 'hover:text-[#0f172a]'
            }`}
          >
            Route Explorer
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`cursor-pointer transition-colors py-1 relative ${
              activeTab === 'planner'
                ? 'text-[#6f2c75] font-semibold border-b-2 border-[#6f2c75]'
                : 'hover:text-[#0f172a]'
            }`}
          >
            Journey Planner
          </button>
          <button
            onClick={() => setActiveTab('fare')}
            className={`cursor-pointer transition-colors py-1 relative ${
              activeTab === 'fare'
                ? 'text-[#6f2c75] font-semibold border-b-2 border-[#6f2c75]'
                : 'hover:text-[#0f172a]'
            }`}
          >
            Fare Calculator
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center text-xs text-[#64748b] gap-1.5 bg-[#f8fafc] px-2.5 py-1.5 rounded border border-[#e2e8f0]">
            <Clock className="w-3.5 h-3.5 text-[#6f2c75]" />
            <span>Updated:</span>
            <span className="font-mono tabular-nums font-semibold text-[#0f172a]">
              {formatTime(lastUpdated)}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh real-time arrival estimates"
            className="cursor-pointer flex items-center gap-2 px-3.5 py-2 bg-[#eb651b] hover:bg-[#d9531e] active:bg-[#c24413] text-white rounded text-xs font-space font-bold tracking-wider uppercase transition-colors shadow-sm disabled:opacity-70"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Timings</span>
            <span className="sm:hidden">Refresh</span>
          </button>

          {onOpenApiMonitor && (
            <button
              onClick={onOpenApiMonitor}
              title="View LTA API Gateway & Health Status"
              className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-space font-semibold text-[#475569] hover:text-[#0f172a] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API Gateway</span>
            </button>
          )}

          {activeAlertsCount > 0 && (
            <button
              onClick={() => setActiveTab('alerts')}
              className="cursor-pointer relative p-2 text-[#475569] hover:text-[#6f2c75] hover:bg-[#f1f5f9] rounded transition-colors"
              title="Service Advisories"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#eb651b] rounded-full ring-2 ring-white"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
