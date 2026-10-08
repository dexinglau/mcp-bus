import React from 'react';
import { Bus, MapPin, GitCommit, Calculator, Bookmark, Heart } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'arrivals', label: 'Arrivals', icon: Bus },
    { id: 'stops', label: 'Stops', icon: MapPin },
    { id: 'routes', label: 'Routes', icon: GitCommit },
    { id: 'planner', label: 'Planner', icon: Bookmark },
    { id: 'fare', label: 'Fare', icon: Calculator },
    { id: 'plushie', label: 'Plushie', icon: Heart },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] px-2 py-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-6 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
                isActive ? 'text-[#6f2c75]' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span
                className={`text-[10px] font-space tracking-tight mt-1 ${
                  isActive ? 'font-bold text-[#6f2c75]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
