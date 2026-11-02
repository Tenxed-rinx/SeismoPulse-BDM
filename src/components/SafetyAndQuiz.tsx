import React, { useState } from 'react';
import { GoBagItem, HelplineEntry } from '../types/seismic';
import { GLOBAL_HELPLINES, INITIAL_GOBAG_ITEMS } from '../data/safetyHelplines';
import {
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  AlertOctagon,
  Flame,
  Home,
  Car,
  Waves,
  Briefcase,
  Search,
  Copy,
  Check,
  AlertTriangle,
  HeartHandshake,
  Activity,
  ArrowRight,
  Sparkles,
  Volume2
} from 'lucide-react';

export const SafetyAndQuiz: React.FC = () => {
  // Tab switcher: 'protocols' | 'gobag' | 'helplines'
  const [activeSafetyTab, setActiveSafetyTab] = useState<'protocols' | 'gobag' | 'helplines'>('protocols');

  // Go-Bag State
  const [goBagItems, setGoBagItems] = useState<GoBagItem[]>(INITIAL_GOBAG_ITEMS);

  // Helpline Search State
  const [helplineSearch, setHelplineSearch] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Toggle Go-Bag Item
  const handleToggleGoBagItem = (id: string) => {
    setGoBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = goBagItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / goBagItems.length) * 100);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredHelplines = GLOBAL_HELPLINES.filter((h) => {
    if (!helplineSearch.trim()) return true;
    const q = helplineSearch.toLowerCase();
    return (
      h.country.toLowerCase().includes(q) ||
      h.disasterAgency.toLowerCase().includes(q) ||
      h.emergencyNumber.includes(q)
    );
  });

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 text-slate-800 p-4 sm:p-6 max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Disaster Preparedness &amp; Survival Protocols</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Earthquake Safety Precautions &amp; Action Points
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Practical, life-saving steps verified by NDMA (National Disaster Management Authority) and global seismology agencies. Follow these simple steps before, during, and after a tremor.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-300 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSafetyTab('protocols')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSafetyTab === 'protocols'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Safety Steps</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSafetyTab('gobag')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSafetyTab === 'gobag'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>72h Go-Bag ({completedCount}/{goBagItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSafetyTab('helplines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSafetyTab === 'helplines'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency Helplines</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: SIMPLE SAFETY PRECAUTION STEPS AND POINTS */}
      {/* ======================================================== */}
      {activeSafetyTab === 'protocols' && (
        <div className="space-y-6">
          {/* THE GOLDEN RULE BANNER */}
          <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                <span>The Universal Earthquake Rule</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                DROP, COVER, AND HOLD ON!
              </h2>
              <p className="text-xs sm:text-sm text-amber-50 leading-relaxed">
                When ground shaking starts, do <strong>NOT</strong> attempt to run outside. Most casualties occur from falling building facades, brickwork, ceiling plaster, and shattering glass when fleeing.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center font-mono">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="text-xl font-black">1. DROP</div>
                <div className="text-[10px] text-amber-100">Down onto hands &amp; knees</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="text-xl font-black">2. COVER</div>
                <div className="text-[10px] text-amber-100">Head &amp; neck under sturdy desk</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="text-xl font-black">3. HOLD</div>
                <div className="text-[10px] text-amber-100">Hold on until shaking stops</div>
              </div>
            </div>
          </div>

          {/* 3 PHASES: BEFORE, DURING, AFTER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PHASE 1: BEFORE AN EARTHQUAKE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Before an Earthquake</h3>
                  <div className="text-[11px] text-sky-700 font-semibold">Preparation &amp; Home Safety</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Anchor Furniture:</strong> Bolt tall shelves, mirrors &amp; almirahs to walls.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Safe Spots:</strong> Find sturdy tables away from glass windows.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Gas &amp; Power Valves:</strong> Know how to shut off LPG cylinder &amp; main switch.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Family Contact:</strong> Pick one relative for all family call updates.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Emergency Go-Bag:</strong> Keep water, food, torch, and first aid ready.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Check Building:</strong> Inspect pillars and walls for deep cracks.
                  </div>
                </li>
              </ul>
            </div>

            {/* PHASE 2: DURING AN EARTHQUAKE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">During an Earthquake</h3>
                  <div className="text-[11px] text-amber-700 font-semibold">Immediate Survival Actions</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Drop, Cover, Hold:</strong> Get under table; hold on tight until shaking stops.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Stay Inside:</strong> Do not run outside while ground is shaking.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>No Elevators:</strong> Never use lifts; power cuts trap occupants.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>In Bed:</strong> Stay in bed; protect head and neck with a pillow.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Outdoors:</strong> Move to open area away from buildings, wires &amp; trees.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>In Vehicle:</strong> Pull over safely away from flyovers and wait inside.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Near Coast:</strong> Rush to high ground immediately (tsunami risk).
                  </div>
                </li>
              </ul>
            </div>

            {/* PHASE 3: AFTER AN EARTHQUAKE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">After an Earthquake</h3>
                  <div className="text-[11px] text-emerald-700 font-semibold">Post-Tremor Hazard Checks</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Gas Leak Check:</strong> Smell gas? Turn off cylinder, open windows, no fire.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Expect Aftershocks:</strong> Secondary tremors can strike; stay alert.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Wear Shoes:</strong> Protect feet from broken glass and fallen tiles.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Inspect Walls:</strong> Evacuate if major cracks appear on pillars or beams.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Use SMS / Text:</strong> Keep phone lines clear for emergency rescue.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong>Official Alerts:</strong> Listen to verified advisories from NDMA or radio.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* SPECIFIC SCENARIO QUICK CARDS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Specialized Scenario Instructions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Home className="w-4 h-4 text-amber-600" />
                  <span>High-Rise Apartments</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Stay away from balconies. Towers sway safely; do not use elevators.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Car className="w-4 h-4 text-sky-600" />
                  <span>On Highway / In Car</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Slow down steadily. Stop away from flyovers and power poles; stay inside.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Waves className="w-4 h-4 text-cyan-600" />
                  <span>Beach / Coastal</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Water pulling back or sirens? Run inland to high ground immediately.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>In Kitchen</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Turn off gas stove immediately. Step away from hot pots and oil pans.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: INTERACTIVE 72-HOUR SURVIVAL GO-BAG CHECKLIST */}
      {/* ======================================================== */}
      {activeSafetyTab === 'gobag' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>72-Hour Emergency Evacuation Survival Kit</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Emergency Go-Bag Readiness Checklist
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Essential provisions for each family member to sustain 72 hours until disaster response forces arrive.
              </p>
            </div>

            {/* Readiness Score Badge */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-mono uppercase font-bold">Kit Readiness</div>
                <div className="text-lg font-black font-mono text-emerald-700">{progressPercent}% Ready</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 flex items-center justify-center font-mono text-xs font-bold text-slate-800">
                {completedCount}/{goBagItems.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300"
            />
          </div>

          {/* Checklist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {goBagItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleGoBagItem(item.id)}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
            <span>
              <strong>Tip:</strong> Keep your Go-Bag packed in an easily portable backpack placed near your main exit door or in your vehicle trunk. Inspect battery dates every 6 months.
            </span>
            <button
              type="button"
              onClick={() => setGoBagItems((prev) => prev.map((i) => ({ ...i, completed: true })))}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors"
            >
              Mark All Packed
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: DIRECT EMERGENCY HELPLINES DIRECTORY */}
      {/* ======================================================== */}
      {activeSafetyTab === 'helplines' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>Verified Rescue &amp; Disaster Response Numbers</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                National &amp; Global Emergency Hotlines
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Direct phone numbers for immediate earthquake rescue, search-and-rescue, and medical dispatch.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={helplineSearch}
                onChange={(e) => setHelplineSearch(e.target.value)}
                placeholder="Search country or agency..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Priority Highlights: India Emergency Numbers */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span>India National Disaster Priority Numbers (Toll-Free 24x7)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase">NDMA Helpline</div>
                <div className="text-base font-bold text-amber-800">1078</div>
                <div className="text-[10px] text-slate-600">Disaster Management</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase">National Emergency</div>
                <div className="text-base font-bold text-rose-700">112</div>
                <div className="text-[10px] text-slate-600">Police / Fire / Health</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase">Medical Ambulance</div>
                <div className="text-base font-bold text-emerald-700">108 / 102</div>
                <div className="text-[10px] text-slate-600">Immediate Trauma Triage</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase">NDRF Control Room</div>
                <div className="text-xs font-bold text-sky-800 truncate">011-24363260</div>
                <div className="text-[10px] text-slate-600">Search &amp; Rescue HQ</div>
              </div>
            </div>
          </div>

          {/* Full Directory List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {filteredHelplines.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{item.country}</div>
                  <div className="text-[11px] text-slate-600 truncate">{item.disasterAgency}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.notes}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-sm font-bold text-rose-700 bg-white px-2 py-1 rounded border border-rose-200">
                    {item.emergencyNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.emergencyNumber)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs transition-colors"
                    title="Copy number"
                  >
                    {copiedNumber === item.emergencyNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
