import React from 'react';
import {
  Activity,
  Map,
  BarChart3,
  Database,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'powerbi' | 'mongo' | 'safety';
  setActiveTab: (tab: 'map' | 'powerbi' | 'mongo' | 'safety') => void;
  onOpenEmergencyModal: () => void;
  dataSource: 'live' | 'fallback';
  quakeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergencyModal,
  dataSource,
  quakeCount
}) => {
  const navItems: {
    id: 'map' | 'powerbi' | 'mongo' | 'safety';
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'map',
      label: 'Interactive Map & Faults',
      description: 'USGS live feeds, Indian earthquakes & city search',
      icon: <Map className="w-4 h-4" />
    },
    {
      id: 'powerbi',
      label: 'Power BI Analytics & Past Disasters',
      description: 'Analytics, recurrence models & historical catastrophes',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'mongo',
      label: 'MongoDB Database & Schema',
      description: 'Database schema, storage format & fields',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'safety',
      label: 'Safety Precautions',
      description: 'Action points before, during, after & emergency lines',
      icon: <ShieldCheck className="w-4 h-4" />
    }
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        {/* Zone 1: Brand Wordmark (Studio removed) */}
        <div
          onClick={() => setActiveTab('map')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer group"
          title="Return to Earthquake Map"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-tight">
              SeismoPulse
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
              Earthquake Intelligence &amp; Indian Seismic Safety
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto py-1 px-1 max-w-full text-xs font-semibold text-slate-600 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title={item.description}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-amber-700 bg-amber-50 font-bold border-b-2 border-amber-600 shadow-xs'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-amber-600' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Emergency Helpline SOS */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            title="Emergency Disasters Helplines (NDMA 112, 911)"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Emergency Help</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
