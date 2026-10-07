/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bus,
  MapPin,
  RotateCw,
  SlidersHorizontal,
  Star,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ArrivalCard } from './components/ArrivalCard';
import { StopHeader } from './components/StopHeader';
import { RouteExplorer } from './components/RouteExplorer';
import { JourneyPlanner } from './components/JourneyPlanner';
import { FareCalculator } from './components/FareCalculator';
import { StopsDirectory } from './components/StopsDirectory';
import { ServiceAlertsModal } from './components/ServiceAlertsModal';
import { ApiMonitorModal } from './components/ApiMonitorModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  BUS_STOPS_DATABASE,
  BUS_ARRIVALS_MOCK,
  BUS_ROUTES_DATABASE,
  SERVICE_ADVISORIES,
  BusStop,
  BusArrivalInfo,
  NextBus,
} from './data/transitData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'stops' | 'routes' | 'planner' | 'fare' | 'alerts'>('arrivals');
  const [searchMode, setSearchMode] = useState<'service' | 'stop'>('service');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStop, setCurrentStop] = useState<BusStop>(BUS_STOPS_DATABASE[0]);
  const [selectedRouteService, setSelectedRouteService] = useState('190');
  const [activeFilter, setActiveFilter] = useState<'all' | 'trunk' | 'express'>('all');
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isApiMonitorOpen, setIsApiMonitorOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsRemaining, setSecondsRemaining] = useState(25);
  const [isLiveFromLta, setIsLiveFromLta] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('metro_favorites');
      return saved ? JSON.parse(saved) : ['14', '190', '65'];
    } catch {
      return ['14', '190', '65'];
    }
  });

  const toggleFavorite = (serviceNo: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(serviceNo)
        ? prev.filter((s) => s !== serviceNo)
        : [...prev, serviceNo];
      try {
        localStorage.setItem('metro_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const removeFavorite = (serviceNo: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((s) => s !== serviceNo);
      try {
        localStorage.setItem('metro_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Dynamic live arrival state (with live countdown updates)
  const [arrivalsData, setArrivalsData] = useState<Record<string, BusArrivalInfo[]>>(BUS_ARRIVALS_MOCK);

  // Simulated countdown timer and auto-refresh loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleManualRefresh(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStop.code]);

  const parseLtaNextBus = (nextBus: any): NextBus => {
    if (!nextBus || !nextBus.EstimatedArrival) {
      return { arrivalMinutes: 0, load: 'seats', type: 'SD', wheelchair: true };
    }
    const diffMs = new Date(nextBus.EstimatedArrival).getTime() - Date.now();
    const mins = Math.max(0, Math.round(diffMs / 60000));
    let load: 'seats' | 'standing' | 'crowded' = 'seats';
    if (nextBus.Load === 'SDA') load = 'standing';
    if (nextBus.Load === 'LSD') load = 'crowded';
    const type = nextBus.Type === 'DD' || nextBus.Type === 'BD' ? nextBus.Type : 'SD';
    const wheelchair = nextBus.Feature === 'WAB';
    return { arrivalMinutes: mins, load, type, wheelchair };
  };

  const handleManualRefresh = async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);
    let liveSuccess = false;

    try {
      const response = await fetch(`/api/bus-arrival?BusStopCode=${encodeURIComponent(currentStop.code)}`);
      if (response.ok) {
        const ltaData = await response.json();
        if (ltaData.Services && Array.isArray(ltaData.Services) && ltaData.Services.length > 0) {
          const mappedServices: BusArrivalInfo[] = ltaData.Services.map((srv: any) => ({
            serviceNo: srv.ServiceNo,
            operator: srv.Operator === 'SBST' ? 'SBS Transit' : srv.Operator === 'SMRT' ? 'SMRT Buses' : srv.Operator === 'TTS' ? 'Tower Transit' : 'Go-Ahead Singapore',
            destination: `DESTINATION (${srv.NextBus?.DestinationCode || 'TERMINAL'})`,
            subDestination: `Origin Stop ${srv.NextBus?.OriginCode || 'N/A'}`,
            category: 'Trunk',
            firstBus: '05:45',
            lastBus: '23:55',
            nextBuses: [
              parseLtaNextBus(srv.NextBus),
              parseLtaNextBus(srv.NextBus2),
              parseLtaNextBus(srv.NextBus3),
            ],
          }));

          setArrivalsData((prev) => ({
            ...prev,
            [currentStop.code]: mappedServices,
          }));
          liveSuccess = true;
          setIsLiveFromLta(true);
        }
      }
    } catch {
      // Fallback to simulation if offline or key not yet set
    }

    if (!liveSuccess) {
      setIsLiveFromLta(false);
      setArrivalsData((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((stopKey) => {
          next[stopKey] = next[stopKey].map((item) => ({
            ...item,
            nextBuses: item.nextBuses.map((bus, idx) => {
              const delta = Math.floor(Math.random() * 2) - (idx === 0 ? 1 : 0);
              const newMins = Math.max(0, bus.arrivalMinutes + delta);
              return {
                ...bus,
                arrivalMinutes: newMins,
              };
            }) as any,
          }));
        });
        return next;
      });
    }

    setLastUpdated(new Date());
    setSecondsRemaining(20);
    if (showLoading) setIsRefreshing(false);
  };

  // Filter current stop arrival cards
  const stopArrivals = arrivalsData[currentStop.code] || [];

  const filteredArrivals = useMemo(() => {
    return stopArrivals.filter((item) => {
      // Category filter
      if (activeFilter === 'trunk' && ['502', '518', '190', '960'].includes(item.serviceNo)) {
        return false;
      }
      if (activeFilter === 'express' && !['502', '518', '190', '960'].includes(item.serviceNo)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (searchMode === 'service') {
          return (
            item.serviceNo.toLowerCase().includes(q) ||
            item.destination.toLowerCase().includes(q)
          );
        } else {
          return (
            item.serviceNo.toLowerCase().includes(q) ||
            item.destination.toLowerCase().includes(q)
          );
        }
      }

      return true;
    });
  }, [stopArrivals, activeFilter, searchQuery, searchMode]);

  // Handle selecting a route to view
  const handleSelectRoute = (serviceNo: string) => {
    if (BUS_ROUTES_DATABASE[serviceNo]) {
      setSelectedRouteService(serviceNo);
      setActiveTab('routes');
    } else {
      // Default to first available route if not in database
      setSelectedRouteService('190');
      setActiveTab('routes');
    }
  };

  // Handle jumping to a stop from schematic
  const handleJumpToStop = (stopCode: string) => {
    const target = BUS_STOPS_DATABASE.find((s) => s.code === stopCode);
    if (target) {
      setCurrentStop(target);
      setActiveTab('arrivals');
    }
  };

  // Quick suggestions for bus stop search
  const stopSuggestions = useMemo(() => {
    if (searchMode !== 'stop' || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return BUS_STOPS_DATABASE.filter(
      (s) =>
        s.code.includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.road.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchMode, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#111c2d] flex flex-col font-work pb-16 md:pb-0">
      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'alerts') {
            setIsAlertsModalOpen(true);
          } else {
            setActiveTab(tab as any);
          }
        }}
        onRefresh={() => handleManualRefresh(true)}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        activeAlertsCount={SERVICE_ADVISORIES.filter((a) => a.status === 'Active').length}
        onOpenApiMonitor={() => setIsApiMonitorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Render Tab Contents */}
        {activeTab === 'arrivals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left 4-Column Dedicated Reference Sidebar on Desktop */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <Sidebar
                currentStop={currentStop}
                onSelectStop={setCurrentStop}
                favorites={favorites}
                onRemoveFavorite={removeFavorite}
                onSelectRoute={handleSelectRoute}
                advisories={SERVICE_ADVISORIES}
                onOpenAdvisories={() => setIsAlertsModalOpen(true)}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>

            {/* Right 8-Column Main Operational Console */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
              {/* Search Console with Distinctive Segmented Switcher */}
              <div className="bg-white border border-[#e2e8f0] rounded p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                {/* Dual-tab controls */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => {
                      setSearchMode('service');
                      setSearchQuery('');
                    }}
                    className={`cursor-pointer px-4 py-2.5 rounded text-xs font-space font-bold transition-all ${
                      searchMode === 'service'
                        ? 'bg-[#6f2c75] text-white shadow-xs'
                        : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    Search by Service No.
                  </button>

                  <button
                    onClick={() => {
                      setSearchMode('stop');
                      setSearchQuery('');
                    }}
                    className={`cursor-pointer px-4 py-2.5 rounded text-xs font-space font-bold transition-all ${
                      searchMode === 'stop'
                        ? 'bg-[#6f2c75] text-white shadow-xs'
                        : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    Search by Bus Stop No.
                  </button>
                </div>

                {/* Search Input Box */}
                <div className="relative">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchMode === 'service'
                          ? 'Enter bus service number (e.g., 14, 65, 106, 143, 190)...'
                          : 'Enter 5-digit stop code (e.g. 09048, 08057) or station name...'
                      }
                      className="w-full h-12 pl-11 pr-10 bg-white border border-[#e2e8f0] rounded text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#6f2c75] focus:ring-2 focus:ring-[#6f2c75]/15 outline-none font-space font-medium transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="cursor-pointer absolute right-3 p-1 text-[#94a3b8] hover:text-[#0f172a]"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Suggestions for Bus Stops */}
                  {stopSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#cbd5e1] rounded shadow-lg z-30 overflow-hidden divide-y divide-[#f1f5f9]">
                      {stopSuggestions.map((s) => (
                        <button
                          key={s.code}
                          onClick={() => {
                            setCurrentStop(s);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-3 hover:bg-[#f8fafc] flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-xs bg-[#6f2c75] text-white px-2 py-0.5 rounded">
                              {s.code}
                            </span>
                            <div>
                              <div className="font-space font-semibold text-xs sm:text-sm text-[#0f172a]">
                                {s.name}
                              </div>
                              <div className="text-[11px] text-[#64748b]">{s.road}</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-space text-[#6f2c75] font-semibold">
                            Select Stop →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Services Quick Chips */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[#64748b]">
                  <span className="font-space font-semibold uppercase text-[11px] text-[#94a3b8]">
                    Quick Service Jump:
                  </span>
                  {['14', '65', '106', '123', '143', '166', '174', '190', '502'].map((srv) => (
                    <button
                      key={srv}
                      onClick={() => {
                        setSearchMode('service');
                        setSearchQuery(srv);
                      }}
                      className="cursor-pointer px-2 py-0.5 rounded bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] font-space font-semibold text-xs transition-colors"
                    >
                      {srv}
                    </button>
                  ))}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="cursor-pointer text-xs text-[#eb651b] font-space font-semibold ml-2 hover:underline"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Stop Header with Code, Road, Interchange Lines */}
              <StopHeader
                currentStop={currentStop}
                allStops={BUS_STOPS_DATABASE}
                onSelectStop={setCurrentStop}
              />

              {/* Live Arrival Cards Header & Telemetry Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-space font-bold text-lg text-[#0f172a]">
                    Live Bus Arrivals at Stop
                  </h3>
                  <span className="text-xs bg-[#e2e8f0] text-[#334155] px-2 py-0.5 rounded font-mono font-semibold">
                    {filteredArrivals.length} services
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Auto-sync in:</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0f172a]">
                    {secondsRemaining}s
                  </span>
                </div>
              </div>

              {/* Arrival Cards Grid */}
              {filteredArrivals.length === 0 ? (
                <div className="bg-white border border-[#e2e8f0] rounded p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <Bus className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                  <h4 className="font-space font-bold text-base text-[#0f172a]">
                    No bus services match "{searchQuery}"
                  </h4>
                  <p className="text-xs text-[#64748b] mt-1 max-w-sm mx-auto">
                    Try searching for another service number or clear the search query to view all available services at this stop.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="cursor-pointer mt-4 px-4 py-2 bg-[#6f2c75] text-white text-xs font-space font-bold uppercase rounded hover:bg-[#5a1e62] transition-colors"
                  >
                    View All Services
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredArrivals.map((arrival) => (
                    <ArrivalCard
                      key={arrival.serviceNo}
                      arrival={arrival}
                      isFavorite={favorites.includes(arrival.serviceNo)}
                      onToggleFavorite={toggleFavorite}
                      onSelectRoute={handleSelectRoute}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stops & Terminals Directory View */}
        {activeTab === 'stops' && (
          <StopsDirectory
            onSelectStop={(stop) => {
              setCurrentStop(stop);
              setActiveTab('arrivals');
            }}
            currentStopCode={currentStop.code}
          />
        )}

        {/* Route Explorer View */}
        {activeTab === 'routes' && (
          <RouteExplorer
            selectedServiceNo={selectedRouteService}
            onSelectServiceNo={setSelectedRouteService}
            onJumpToStop={handleJumpToStop}
          />
        )}

        {/* Journey Planner View */}
        {activeTab === 'planner' && (
          <JourneyPlanner onSelectStop={setCurrentStop} />
        )}

        {/* Fare Calculator View */}
        {activeTab === 'fare' && <FareCalculator />}
      </main>

      {/* Service Advisories Modal */}
      <ServiceAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        advisories={SERVICE_ADVISORIES}
        onSelectService={(srv) => {
          handleSelectRoute(srv);
          setIsAlertsModalOpen(false);
        }}
      />

      {/* API Gateway & Health Monitor Modal */}
      <ApiMonitorModal
        isOpen={isApiMonitorOpen}
        onClose={() => setIsApiMonitorOpen(false)}
      />

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as any)} />
    </div>
  );
}
