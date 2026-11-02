import React from 'react';
import {
  X,
  Activity,
  Map,
  BarChart3,
  Database,
  ShieldCheck,
  History,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: 'map' | 'powerbi' | 'mongo' | 'safety' | 'history') => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  if (!isOpen) return null;

  const features = [
    {
      tab: 'map' as const,
      icon: <Map className="w-4 h-4 text-amber-500" />,
      title: '1. Live Earthquake Map & City Search',
      simpleExplain: 'Interactive map displaying real-time global USGS telemetry, thorough Indian earthquakes, tectonic fault lines, and instant 5-detail city seismic vulnerability search.'
    },
    {
      tab: 'powerbi' as const,
      icon: <BarChart3 className="w-4 h-4 text-cyan-500" />,
      title: '2. Power BI Analytics Studio',
      simpleExplain: 'Publication-grade dashboard with interactive cross-filtering, Gutenberg-Richter recurrence regression, depth stratification, and 1-click PNG image export for reports.'
    },
    {
      tab: 'mongo' as const,
      icon: <Database className="w-4 h-4 text-emerald-500" />,
      title: '3. MongoDB Database Creation & Schema Studio',
      simpleExplain: 'Comprehensive breakdown explaining how the database is created step-by-step, the exact BSON schema followed, 5 NoSQL design patterns, 2dsphere indexing, and an aggregation query runner.'
    },
    {
      tab: 'safety' as const,
      icon: <ShieldCheck className="w-4 h-4 text-rose-500" />,
      title: '4. Safety Precautions & Emergency Protocols',
      simpleExplain: 'Simple, life-saving steps before, during, and after earthquakes, scenario-specific guidelines, a 72-hour survival go-bag checklist, and 24x7 disaster hotlines (NDMA 1078, 112).'
    },
    {
      tab: 'history' as const,
      icon: <History className="w-4 h-4 text-indigo-500" />,
      title: '5. Past Disaster Case Studies',
      simpleExplain: 'Retrospective library of major Indian and global earthquakes (2001 Bhuj, 1993 Latur, 1950 Assam, 1960 Chile, 2011 Japan) explaining failure mechanisms and building codes.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 text-slate-800 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <Activity className="w-5 h-5 stroke-[2.5] text-white" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
              System Overview &amp; Guide
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              SeismoPulse Studio
            </h2>
          </div>
        </div>

        {/* Quick Pitch */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 text-xs text-amber-950 leading-relaxed">
          <strong>Big Data Management (BDM) Platform:</strong> An end-to-end seismic intelligence framework connecting USGS live telemetry streaming with a comprehensive Indian earthquake archive, a dimensional Star Schema database, interactive Power BI reporting, and practical life-safety protocols.
        </div>

        {/* Modular Feature Guide */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            Explore Application Modules:
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {features.map((item) => (
              <div
                key={item.tab}
                onClick={() => {
                  onNavigateToTab(item.tab);
                  onClose();
                }}
                className="p-3 bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 rounded-xl transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-amber-600 font-semibold group-hover:underline">
                      Open &rarr;
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {item.simpleExplain}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>BIS IS 1893:2016 Compliant &bull; USGS GeoJSON Telemetry</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          >
            Got it, Let&apos;s Explore
          </button>
        </div>
      </div>
    </div>
  );
};
