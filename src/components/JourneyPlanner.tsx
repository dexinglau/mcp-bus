import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  Banknote,
  Footprints,
  Bus,
  Train,
  CheckCircle2,
  ChevronRight,
  Accessibility,
} from 'lucide-react';
import { BUS_STOPS_DATABASE, BusStop, calculateBusFare } from '../data/transitData';

interface JourneyPlannerProps {
  onSelectStop: (stop: BusStop) => void;
}

export const JourneyPlanner: React.FC<JourneyPlannerProps> = ({ onSelectStop }) => {
  const [originCode, setOriginCode] = useState('09048'); // Orchard
  const [destCode, setDestCode] = useState('05049'); // Chinatown

  const originStop = BUS_STOPS_DATABASE.find((s) => s.code === originCode) || BUS_STOPS_DATABASE[0];
  const destStop = BUS_STOPS_DATABASE.find((s) => s.code === destCode) || BUS_STOPS_DATABASE[1];

  const handleSwap = () => {
    setOriginCode(destCode);
    setDestCode(originCode);
  };

  // Mock computed route options between selected hubs
  const itineraries = [
    {
      id: 'plan-1',
      title: 'Fastest: Direct Trunk Service',
      durationMinutes: 18,
      walkingMeters: 140,
      busServices: ['190', '143'],
      fareCard: calculateBusFare(5.8).cardFare,
      wheelchair: true,
      transfers: 0,
      steps: [
        {
          type: 'walk',
          instruction: `Walk 80m to ${originStop.name} (Stop ${originStop.code})`,
          duration: '2 mins',
        },
        {
          type: 'bus',
          instruction: `Board Bus 190 or 143 (Double Deck / WAB)`,
          subInstruction: 'Ride 5 stops along Orchard Rd & Eu Tong Sen St',
          duration: '14 mins',
        },
        {
          type: 'walk',
          instruction: `Alight at ${destStop.name} (Stop ${destStop.code}) and walk 60m`,
          duration: '2 mins',
        },
      ],
    },
    {
      id: 'plan-2',
      title: 'Alternative: Direct Bus 174',
      durationMinutes: 22,
      walkingMeters: 110,
      busServices: ['174'],
      fareCard: calculateBusFare(6.2).cardFare,
      wheelchair: true,
      transfers: 0,
      steps: [
        {
          type: 'walk',
          instruction: `Walk 60m to ${originStop.name}`,
          duration: '1 min',
        },
        {
          type: 'bus',
          instruction: 'Board Bus 174 towards New Bridge Rd Ter',
          subInstruction: 'Ride 7 stops via Dhoby Ghaut and Clarke Quay',
          duration: '19 mins',
        },
        {
          type: 'walk',
          instruction: `Arrive at destination near ${destStop.name}`,
          duration: '2 mins',
        },
      ],
    },
    {
      id: 'plan-3',
      title: 'Multi-Modal: MRT Transfer',
      durationMinutes: 15,
      walkingMeters: 280,
      busServices: ['NSL / NEL'],
      fareCard: 1.29,
      wheelchair: true,
      transfers: 1,
      steps: [
        {
          type: 'walk',
          instruction: `Walk to ${originStop.name} MRT station concourse`,
          duration: '3 mins',
        },
        {
          type: 'train',
          instruction: 'Board North South Line towards Marina South Pier to Dhoby Ghaut',
          subInstruction: 'Transfer to North East Line towards HarbourFront to Chinatown',
          duration: '10 mins',
        },
        {
          type: 'walk',
          instruction: `Exit station at Exit C towards ${destStop.name}`,
          duration: '2 mins',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Route Query Box */}
      <div className="bg-white border border-[#e2e8f0] rounded p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <h2 className="font-space font-bold text-xl text-[#0f172a] mb-4">
          Point-to-Point Journey Planner
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* Origin selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-space font-semibold uppercase text-[#64748b] mb-1">
              Origin (Boarding Point)
            </label>
            <select
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value)}
              className="w-full h-12 px-3 bg-white border border-[#e2e8f0] focus:border-[#6f2c75] focus:ring-2 focus:ring-[#6f2c75]/15 rounded text-sm text-[#0f172a] font-medium outline-none cursor-pointer"
            >
              {BUS_STOPS_DATABASE.map((s) => (
                <option key={s.code} value={s.code}>
                  [{s.code}] {s.name} ({s.road})
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="cursor-pointer w-10 h-10 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#e2e8f0] flex items-center justify-center text-[#6f2c75] transition-transform active:rotate-180"
              title="Swap origin and destination"
            >
              ⇄
            </button>
          </div>

          {/* Destination selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-space font-semibold uppercase text-[#64748b] mb-1">
              Destination (Alighting Point)
            </label>
            <select
              value={destCode}
              onChange={(e) => setDestCode(e.target.value)}
              className="w-full h-12 px-3 bg-white border border-[#e2e8f0] focus:border-[#6f2c75] focus:ring-2 focus:ring-[#6f2c75]/15 rounded text-sm text-[#0f172a] font-medium outline-none cursor-pointer"
            >
              {BUS_STOPS_DATABASE.map((s) => (
                <option key={s.code} value={s.code}>
                  [{s.code}] {s.name} ({s.road})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Itineraries */}
      <div className="space-y-4">
        <h3 className="font-space font-bold text-base text-[#0f172a] flex items-center gap-2">
          <span>Recommended Transit Itineraries</span>
          <span className="text-xs font-normal text-[#64748b]">
            (Based on live traffic & timetable)
          </span>
        </h3>

        {itineraries.map((itinerary) => (
          <div
            key={itinerary.id}
            className="bg-white border border-[#e2e8f0] rounded p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:border-[#cbd5e1] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f1f5f9] gap-2">
              <div>
                <h4 className="font-space font-bold text-base text-[#0f172a]">
                  {itinerary.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#64748b]">
                  <span className="flex items-center gap-1 font-space font-bold text-[#eb651b] text-sm">
                    <Clock className="w-4 h-4" />
                    <span>~{itinerary.durationMinutes} mins</span>
                  </span>
                  <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5" />
                    <span>{itinerary.walkingMeters}m walk</span>
                  </span>
                  <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    ${itinerary.fareCard.toFixed(2)} card fare
                  </span>
                  <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                  <span>{itinerary.transfers} transfer{itinerary.transfers === 1 ? '' : 's'}</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="flex items-center gap-1.5">
                {itinerary.busServices.map((srv) => (
                  <span
                    key={srv}
                    className="px-2.5 py-1 bg-[#6f2c75] text-white rounded text-xs font-space font-bold"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-Step Directions */}
            <div className="pt-4 space-y-3">
              {itinerary.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center shrink-0 mt-0.5">
                    {step.type === 'walk' ? (
                      <Footprints className="w-3.5 h-3.5 text-[#64748b]" />
                    ) : step.type === 'bus' ? (
                      <Bus className="w-3.5 h-3.5 text-[#6f2c75]" />
                    ) : (
                      <Train className="w-3.5 h-3.5 text-[#eb651b]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0f172a]">{step.instruction}</p>
                    {step.subInstruction && (
                      <p className="text-xs text-[#64748b] mt-0.5">{step.subInstruction}</p>
                    )}
                  </div>

                  <span className="text-xs text-[#94a3b8] font-mono shrink-0">
                    {step.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
