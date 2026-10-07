import React, { useState } from 'react';
import { Banknote, CreditCard, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { calculateBusFare } from '../data/transitData';

export const FareCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState(6.4);
  const [passengerType, setPassengerType] = useState<'adult' | 'student' | 'senior' | 'workfare'>('adult');

  const fareResult = calculateBusFare(distanceKm, passengerType);

  const passengerTypes = [
    { id: 'adult', label: 'Adult / Contactless Card', desc: 'Standard Adult fare' },
    { id: 'student', label: 'Primary / Secondary / JC', desc: 'Student concession rate' },
    { id: 'senior', label: 'Senior Citizen (60+)', desc: 'Senior concession rate' },
    { id: 'workfare', label: 'Workfare Concession', desc: 'Lower-wage worker rate' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between pb-4 border-b border-[#f1f5f9]">
          <div>
            <h2 className="font-space font-bold text-2xl text-[#0f172a]">
              LTA Distance-Based Fare Calculator
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              Public transit fares in Singapore are strictly distance-based across all buses and MRT lines with free transfers.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-[#6f2c75] border border-purple-200 rounded text-xs font-space font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>SimplyGo / EZ-Link</span>
          </div>
        </div>

        {/* Passenger Profile Switcher */}
        <div className="mt-5">
          <label className="block text-xs font-space font-semibold uppercase tracking-wider text-[#64748b] mb-2">
            Select Passenger Concession Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {passengerTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setPassengerType(type.id as any)}
                className={`cursor-pointer p-3 rounded text-left border transition-all ${
                  passengerType === type.id
                    ? 'bg-[#6f2c75] text-white border-[#6f2c75] shadow-xs'
                    : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                }`}
              >
                <div className="font-space font-bold text-xs">{type.label}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    passengerType === type.id ? 'text-purple-200' : 'text-[#94a3b8]'
                  }`}
                >
                  {type.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Distance Slider */}
        <div className="mt-6 p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-space font-semibold uppercase tracking-wider text-[#64748b]">
              Journey Travel Distance
            </label>
            <span className="font-space font-bold text-2xl text-[#6f2c75] tabular-nums">
              {distanceKm.toFixed(1)} km
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="30.0"
            step="0.1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
            className="w-full accent-[#eb651b] cursor-pointer h-2 bg-[#cbd5e1] rounded-lg appearance-none"
          />

          <div className="flex justify-between text-[11px] text-[#94a3b8] font-mono mt-2">
            <span>0.5 km (Feeder trip)</span>
            <span>10.0 km (Cross-town)</span>
            <span>30.0 km (Islandwide)</span>
          </div>
        </div>

        {/* Fare Results Summary Card */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-[#bbf7d0] bg-[#f0fdf4]">
            <span className="text-[11px] font-space font-semibold uppercase text-emerald-800">
              Electronic Card Fare
            </span>
            <div className="font-space font-bold text-3xl text-emerald-700 mt-1 tabular-nums">
              ${fareResult.cardFare.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">
              Contactless Bank Card / EZ-Link
            </span>
          </div>

          <div className="p-4 rounded border border-[#e2e8f0] bg-white">
            <span className="text-[11px] font-space font-semibold uppercase text-[#64748b]">
              Cash Payment Fare
            </span>
            <div className="font-space font-bold text-3xl text-[#0f172a] mt-1 tabular-nums">
              ${fareResult.cashFare.toFixed(2)}
            </div>
            <span className="text-[11px] text-[#94a3b8] mt-0.5 block">
              Exact coins required on boarding
            </span>
          </div>

          <div className="p-4 rounded border border-[#fed7aa] bg-[#fff7ed]">
            <span className="text-[11px] font-space font-semibold uppercase text-[#c2410c]">
              Savings with Card
            </span>
            <div className="font-space font-bold text-3xl text-[#ea580c] mt-1 tabular-nums">
              ${(fareResult.cashFare - fareResult.cardFare).toFixed(2)}
            </div>
            <span className="text-[11px] text-[#c2410c] mt-0.5 block">
              Up to 5 free transfers in 120 mins
            </span>
          </div>
        </div>

        {/* Transfer Rules Guide */}
        <div className="mt-6 pt-5 border-t border-[#f1f5f9] text-xs text-[#64748b] space-y-1.5">
          <h4 className="font-space font-bold text-xs uppercase text-[#0f172a] mb-1">
            Distance-Based Transfer Rules (Singapore LTA)
          </h4>
          <p>• Up to 5 transfers are allowed within a single journey with a maximum travel window of 2 hours.</p>
          <p>• Up to 45 minutes between bus-to-bus or bus-to-train transfers.</p>
          <p>• Only 1 entry and exit permitted per MRT station within the journey sequence.</p>
        </div>
      </div>
    </div>
  );
};
