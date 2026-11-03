import React, { useMemo, useState } from 'react';
import { Earthquake, HistoricalQuake } from '../types/seismic';
import { HISTORICAL_QUAKES } from '../data/historicalData';
import { exportSvgAsPng, exportSvgAsSvg } from '../utils/exportChart';
import {
  BarChart3,
  TrendingUp,
  Layers,
  Sparkles,
  PieChart,
  RefreshCw,
  Activity,
  Zap,
  Globe2,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Building2,
  AlertTriangle,
  ArrowUpDown,
  History,
  FileImage,
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface PowerBIDashboardProps {
  earthquakes: Earthquake[];
  onSelectQuake: (quake: Earthquake) => void;
}

// Helper to extract clean regional geography from place string
function extractRegion(place: string): string {
  if (!place) return 'Offshore/Global';
  const parts = place.split(',');
  let raw = parts[parts.length - 1].trim();
  raw = raw.replace(/\bregion\b/gi, '').trim();
  if (raw.toLowerCase().includes(' of ')) {
    const afterOf = raw.split(/ of /i);
    raw = afterOf[afterOf.length - 1].trim();
  }
  if (/alaska/i.test(raw)) return 'Alaska';
  if (/california/i.test(raw)) return 'California';
  if (/hawaii/i.test(raw)) return 'Hawaii';
  if (/puerto rico/i.test(raw)) return 'Puerto Rico';
  if (/indonesia/i.test(raw)) return 'Indonesia';
  if (/japan/i.test(raw)) return 'Japan';
  if (/chile/i.test(raw)) return 'Chile';
  if (/fiji/i.test(raw)) return 'Fiji';
  if (/mexico/i.test(raw)) return 'Mexico';
  if (/philippines/i.test(raw)) return 'Philippines';
  if (/turkey|turkiye/i.test(raw)) return 'Turkey';
  if (/greece/i.test(raw)) return 'Greece';
  if (/iceland/i.test(raw)) return 'Iceland';
  if (/new zealand/i.test(raw)) return 'New Zealand';
  if (/nevada/i.test(raw)) return 'Nevada';
  if (/washington/i.test(raw)) return 'Washington';
  if (/taiwan/i.test(raw)) return 'Taiwan';
  if (/peru/i.test(raw)) return 'Peru';
  if (/papua/i.test(raw)) return 'Papua New Guinea';
  if (/tonga/i.test(raw)) return 'Tonga';
  if (/italy/i.test(raw)) return 'Italy';
  if (/vanuatu/i.test(raw)) return 'Vanuatu';
  return raw || 'Offshore/Global';
}

// Compact metric energy formatting (TJ, PJ, EJ, GJ)
export function formatEnergyCompact(energyTJ: number): { value: string; unit: string; fullText: string } {
  if (!energyTJ || isNaN(energyTJ) || energyTJ <= 0) {
    return { value: '0.0', unit: 'TJ', fullText: '0.0 TJ' };
  }
  if (energyTJ >= 1_000_000) {
    const val = (energyTJ / 1_000_000).toFixed(2);
    return { value: val, unit: 'EJ', fullText: `${val} EJ` }; // Exajoules (10^18 J)
  }
  if (energyTJ >= 1_000) {
    const val = (energyTJ / 1_000).toFixed(1);
    return { value: val, unit: 'PJ', fullText: `${val} PJ` }; // Petajoules (10^15 J)
  }
  if (energyTJ >= 1) {
    const val = energyTJ < 10 ? energyTJ.toFixed(2) : energyTJ < 100 ? energyTJ.toFixed(1) : Math.round(energyTJ).toLocaleString();
    return { value: val, unit: 'TJ', fullText: `${val} TJ` };
  }
  const val = (energyTJ * 1000).toFixed(0);
  return { value: val, unit: 'GJ', fullText: `${val} GJ` };
}

export function formatTntCompact(megatons: number): string {
  if (!megatons || isNaN(megatons) || megatons <= 0) return '~0 Mt TNT equiv.';
  if (megatons >= 1000) {
    return `~${(megatons / 1000).toFixed(2)} Gt TNT equiv.`;
  }
  if (megatons >= 1) {
    return `~${megatons.toFixed(2)} Mt TNT equiv.`;
  }
  if (megatons >= 0.001) {
    return `~${(megatons * 1000).toFixed(1)} kt TNT equiv.`;
  }
  return `~${Math.round(megatons * 1e6).toLocaleString()} t TNT equiv.`;
}

interface CatastropheBenchmark {
  id: string;
  name: string;
  year: number;
  country: string;
  magnitude: number;
  deaths: number;
  deathDisplay: string;
  economicLossUsdBn: number;
  economicDisplay: string;
  fatalFactor: string;
}

const CATASTROPHE_BENCHMARKS: CatastropheBenchmark[] = [
  {
    id: 'tangshan-1976',
    name: 'Tangshan Catastrophe',
    year: 1976,
    country: 'China',
    magnitude: 7.5,
    deaths: 242000,
    deathDisplay: '242,000 deaths',
    economicLossUsdBn: 10.0,
    economicDisplay: '$10.0 Billion',
    fatalFactor: 'Unreinforced brick masonry collapse in sleeping city'
  },
  {
    id: 'sumatra-2004',
    name: 'Sumatra-Andaman Megathrust',
    year: 2004,
    country: 'Indonesia (14 Nations)',
    magnitude: 9.1,
    deaths: 227898,
    deathDisplay: '227,898 deaths',
    economicLossUsdBn: 15.0,
    economicDisplay: '$15.0 Billion',
    fatalFactor: 'Trans-oceanic 30-meter megatsunami inundation'
  },
  {
    id: 'haiti-2010',
    name: 'Port-au-Prince Disaster',
    year: 2010,
    country: 'Haiti',
    magnitude: 7.0,
    deaths: 220000,
    deathDisplay: '220,000 deaths',
    economicLossUsdBn: 8.5,
    economicDisplay: '$8.5 Billion',
    fatalFactor: 'Extremely shallow focus under unreinforced masonry'
  },
  {
    id: 'kanto-1923',
    name: 'Great Kantō Earthquake',
    year: 1923,
    country: 'Japan',
    magnitude: 7.9,
    deaths: 142800,
    deathDisplay: '142,800 deaths',
    economicLossUsdBn: 4.5,
    economicDisplay: '$4.5 Billion',
    fatalFactor: 'Violent urban firestorms consuming wooden districts'
  },
  {
    id: 'sichuan-2008',
    name: 'Great Wenchuan Earthquake',
    year: 2008,
    country: 'China',
    magnitude: 8.0,
    deaths: 87587,
    deathDisplay: '87,587 deaths',
    economicLossUsdBn: 150.0,
    economicDisplay: '$150.0 Billion',
    fatalFactor: 'Mountain rock avalanches & non-ductile building failure'
  },
  {
    id: 'turkey-2023',
    name: 'Kahramanmaraş Doublet',
    year: 2023,
    country: 'Turkey & Syria',
    magnitude: 7.8,
    deaths: 59259,
    deathDisplay: '59,259 deaths',
    economicLossUsdBn: 104.0,
    economicDisplay: '$104.0 Billion',
    fatalFactor: 'Soft-story pancake collapses & violent 2.0g ground motion'
  },
  {
    id: 'tohoku-2011',
    name: 'Great East Japan Disaster',
    year: 2011,
    country: 'Japan',
    magnitude: 9.1,
    deaths: 19759,
    deathDisplay: '19,759 deaths',
    economicLossUsdBn: 360.0,
    economicDisplay: '$360.0 Billion',
    fatalFactor: 'Record seawall-overtopping tsunami & nuclear containment damage'
  },
  {
    id: 'kobe-1995',
    name: 'Great Hanshin Earthquake',
    year: 1995,
    country: 'Japan',
    magnitude: 6.9,
    deaths: 6434,
    deathDisplay: '6,434 deaths',
    economicLossUsdBn: 100.0,
    economicDisplay: '$100.0 Billion',
    fatalFactor: 'Elevated highway overturning & port liquefaction'
  },
  {
    id: 'gorkha-2015',
    name: 'Gorkha Himalayan Earthquake',
    year: 2015,
    country: 'Nepal',
    magnitude: 7.8,
    deaths: 8964,
    deathDisplay: '8,964 deaths',
    economicLossUsdBn: 10.0,
    economicDisplay: '$10.0 Billion',
    fatalFactor: 'Deep valley seismic basin amplification & rubble stone walls'
  },
  {
    id: 'valdivia-1960',
    name: 'Great Chilean Earthquake',
    year: 1960,
    country: 'Chile',
    magnitude: 9.5,
    deaths: 6000,
    deathDisplay: '6,000 deaths',
    economicLossUsdBn: 3.5,
    economicDisplay: '$3.5 Billion',
    fatalFactor: '1,000 km megathrust slip producing Pacific-wide tsunami'
  },
  {
    id: 'san-francisco-1906',
    name: 'Great San Francisco Earthquake',
    year: 1906,
    country: 'United States',
    magnitude: 7.9,
    deaths: 3000,
    deathDisplay: '3,000 deaths',
    economicLossUsdBn: 15.0,
    economicDisplay: '$15.0 Billion',
    fatalFactor: 'Severed municipal water mains with unchecked city-wide conflagration'
  },
  {
    id: 'northridge-1994',
    name: 'Northridge Earthquake',
    year: 1994,
    country: 'United States',
    magnitude: 6.7,
    deaths: 57,
    deathDisplay: '57 deaths',
    economicLossUsdBn: 49.0,
    economicDisplay: '$49.0 Billion',
    fatalFactor: 'Blind thrust fault rupture beneath modern urban infrastructure'
  }
];

export const PowerBIDashboard: React.FC<PowerBIDashboardProps> = ({ earthquakes, onSelectQuake }) => {
  // Slicers / Interactive Filters (Power BI style)
  const [selectedMagBin, setSelectedMagBin] = useState<string | null>(null);
  const [selectedDepthStrata, setSelectedDepthStrata] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [catastropheMetric, setCatastropheMetric] = useState<'deaths' | 'economic'>('deaths');
  const [regionRankMetric, setRegionRankMetric] = useState<'count' | 'energy' | 'maxMag'>('count');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [hoveredEnergy, setHoveredEnergy] = useState<any | null>(null);
  const [hoveredWadati, setHoveredWadati] = useState<any | null>(null);
  const [selectedHistoricalQuake, setSelectedHistoricalQuake] = useState<HistoricalQuake>(HISTORICAL_QUAKES[0]);

  // Extract all distinct countries/regions from the dataset
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    earthquakes.forEach((eq) => {
      const reg = extractRegion(eq.place);
      if (reg && reg !== 'Offshore/Global') set.add(reg);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [earthquakes]);

  // Filter dataset by active slicers
  const filteredData = useMemo(() => {
    return earthquakes.filter((eq) => {
      if (selectedMagBin) {
        const floor = parseFloat(selectedMagBin);
        if (eq.magnitude < floor || eq.magnitude >= floor + 1) return false;
      }
      if (selectedDepthStrata) {
        if (selectedDepthStrata === 'shallow' && eq.depth >= 30) return false;
        if (selectedDepthStrata === 'intermediate' && (eq.depth < 30 || eq.depth >= 70)) return false;
        if (selectedDepthStrata === 'deep' && (eq.depth < 70 || eq.depth >= 300)) return false;
        if (selectedDepthStrata === 'ultra-deep' && eq.depth < 300) return false;
      }
      if (selectedRegion) {
        const reg = extractRegion(eq.place);
        if (reg.toLowerCase() !== selectedRegion.toLowerCase()) return false;
      }
      return true;
    });
  }, [earthquakes, selectedMagBin, selectedDepthStrata, selectedRegion]);

  // DAX-style KPI Calculations & Gutenberg-Richter Seismological Stress Index
  const kpis = useMemo(() => {
    const count = filteredData.length;
    if (count === 0) {
      return {
        count: 0,
        maxMag: 0,
        totalEnergyTJ: 0,
        compactEnergy: { value: '0.0', unit: 'TJ', fullText: '0.0 TJ' },
        tntMegatons: 0,
        compactTnt: '~0 Mt TNT',
        avgDepth: 0,
        tsunamiAlerts: 0,
        bValue: 1.0,
        aValue: 0,
        stressIndex: 1.0,
        stressLabel: 'No Data',
        grPoints: []
      };
    }

    let maxMag = 0;
    let totalEnergyJoules = 0;
    let sumDepth = 0;
    let tsunamiCount = 0;

    filteredData.forEach((eq) => {
      if (eq.magnitude > maxMag) maxMag = eq.magnitude;
      totalEnergyJoules += eq.energyJoules || 0;
      sumDepth += eq.depth;
      if (eq.tsunami === 1) tsunamiCount++;
    });

    const totalEnergyTJ = totalEnergyJoules / 1e12;
    const tntMegatons = totalEnergyJoules / (4.184e9 * 1e6);

    // Gutenberg-Richter Recurrence Law: log10(N >= M) = a - b*M
    // Exactly computed from cumulative magnitude steps so the graph points and regression line match 100%
    const mags = filteredData.map((d) => d.magnitude).filter((m) => !isNaN(m) && m > 0);
    const step = 0.5;
    const minM = Math.max(2.0, Math.floor(Math.min(...(mags.length > 0 ? mags : [2.0]))));
    const maxM = Math.min(8.5, Math.ceil(Math.max(...(mags.length > 0 ? mags : [8.0]))));

    const points: { mag: number; count: number; logN: number }[] = [];
    for (let m = minM; m <= maxM; m = Math.round((m + step) * 10) / 10) {
      const c = mags.filter((x) => x >= m).length;
      if (c > 0) {
        points.push({ mag: m, count: c, logN: Math.log10(c) });
      }
    }

    let b = 1.0;
    let a = 3.0;

    if (points.length >= 2) {
      const n = points.length;
      const sumX = points.reduce((acc, p) => acc + p.mag, 0);
      const sumY = points.reduce((acc, p) => acc + p.logN, 0);
      const sumXY = points.reduce((acc, p) => acc + p.mag * p.logN, 0);
      const sumX2 = points.reduce((acc, p) => acc + p.mag * p.mag, 0);
      const denom = n * sumX2 - sumX * sumX;
      if (denom !== 0) {
        const slope = (n * sumXY - sumX * sumY) / denom;
        b = -slope;
        a = (sumY - slope * sumX) / n;
      }
    }

    // Stress Index is inversely proportional to b-value: SI = 1.0 / b
    const stressIndex = b > 0 ? Math.round((1.0 / b) * 100) / 100 : 1.0;
    let stressLabel = 'Balanced Tectonic Stress';
    if (b < 0.6) {
      stressLabel = 'High Shear Stress (Mega-Quake Weighting)';
    } else if (b < 0.85) {
      stressLabel = 'High Accumulated Shear Stress';
    } else if (b > 1.15) {
      stressLabel = 'Low Stress / Swarms';
    }

    return {
      count,
      maxMag,
      totalEnergyTJ,
      compactEnergy: formatEnergyCompact(totalEnergyTJ),
      tntMegatons,
      compactTnt: formatTntCompact(tntMegatons),
      avgDepth: sumDepth / count,
      tsunamiAlerts: tsunamiCount,
      bValue: Math.round(b * 100) / 100,
      aValue: Math.round(a * 100) / 100,
      stressIndex,
      stressLabel,
      grPoints: points
    };
  }, [filteredData]);

  // Region-Wise Ranked Hotspots Analysis (Aggregated from catalog)
  const regionRankings = useMemo(() => {
    const map = new Map<string, { region: string; count: number; maxMag: number; totalEnergyTJ: number; depthSum: number }>();

    earthquakes.forEach((eq) => {
      const reg = extractRegion(eq.place);
      const existing = map.get(reg) || { region: reg, count: 0, maxMag: 0, totalEnergyTJ: 0, depthSum: 0 };
      existing.count += 1;
      if (eq.magnitude > existing.maxMag) existing.maxMag = eq.magnitude;
      existing.totalEnergyTJ += (eq.energyJoules || 0) / 1e12;
      existing.depthSum += eq.depth;
      map.set(reg, existing);
    });

    const list = Array.from(map.values()).map((r) => ({
      ...r,
      avgDepth: r.count > 0 ? r.depthSum / r.count : 0
    }));

    if (regionRankMetric === 'energy') {
      return list.sort((a, b) => b.totalEnergyTJ - a.totalEnergyTJ).slice(0, 8);
    }
    if (regionRankMetric === 'maxMag') {
      return list.sort((a, b) => b.maxMag - a.maxMag).slice(0, 8);
    }
    return list.sort((a, b) => b.count - a.count).slice(0, 8);
  }, [earthquakes, regionRankMetric]);

  // Ranked Catastrophes Data (Sorted by Deaths or Economic Loss)
  const rankedCatastrophes = useMemo(() => {
    return [...CATASTROPHE_BENCHMARKS].sort((a, b) => {
      if (catastropheMetric === 'deaths') {
        return b.deaths - a.deaths;
      }
      return b.economicLossUsdBn - a.economicLossUsdBn;
    });
  }, [catastropheMetric]);

  // Magnitude Bins Breakdown for Bar Chart
  const magBins = useMemo(() => {
    const bins: Record<string, { label: string; count: number; min: number; totalEnergy: number }> = {
      '1': { label: 'M1.0 - M1.9', count: 0, min: 1, totalEnergy: 0 },
      '2': { label: 'M2.0 - M2.9', count: 0, min: 2, totalEnergy: 0 },
      '3': { label: 'M3.0 - M3.9', count: 0, min: 3, totalEnergy: 0 },
      '4': { label: 'M4.0 - M4.9', count: 0, min: 4, totalEnergy: 0 },
      '5': { label: 'M5.0 - M5.9', count: 0, min: 5, totalEnergy: 0 },
      '6': { label: 'M6.0 - M6.9', count: 0, min: 6, totalEnergy: 0 },
      '7': { label: 'M7.0+', count: 0, min: 7, totalEnergy: 0 }
    };

    earthquakes.forEach((eq) => {
      const fl = Math.floor(eq.magnitude);
      const key = fl >= 7 ? '7' : fl.toString();
      if (bins[key]) {
        bins[key].count++;
        bins[key].totalEnergy += eq.energyJoules;
      }
    });

    return Object.entries(bins).map(([key, val]) => ({ key, ...val }));
  }, [earthquakes]);

  // Gutenberg-Richter Cumulative Points: N(M >= m) vs m
  const grPoints = kpis.grPoints || [];

  // Depth Strata Breakdown
  const depthStrataStats = useMemo(() => {
    const strata = {
      shallow: { label: 'Shallow (<30 km)', count: 0, color: '#EF4444', desc: 'Highest surface destruction & ground shear' },
      intermediate: { label: 'Intermediate (30-70 km)', count: 0, color: '#F97316', desc: 'Widespread moderate regional shaking' },
      deep: { label: 'Deep (70-300 km)', count: 0, color: '#EAB308', desc: 'Subducting lithospheric oceanic slabs' },
      'ultra-deep': { label: 'Ultra-Deep (>300 km)', count: 0, color: '#06B6D4', desc: 'Mantle transition phase change dehydrations' }
    };
    filteredData.forEach((eq) => {
      strata[eq.depthCategory].count++;
    });
    return strata;
  }, [filteredData]);

  // Cumulative Energy Release Time Series
  const energyTimeline = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => a.time - b.time);
    let cumulative = 0;
    return sorted.map((eq) => {
      const eqTJ = (eq.energyJoules || 0) / 1e12;
      cumulative += eqTJ;
      return {
        id: eq.id,
        time: eq.time,
        formattedTime: eq.formattedTime ? eq.formattedTime.substring(0, 10) : new Date(eq.time).toISOString().substring(0, 10),
        magnitude: eq.magnitude,
        place: eq.place,
        energyTJ: eqTJ,
        cumulativeTJ: cumulative,
        eq
      };
    });
  }, [filteredData]);

  // Wadati-Benioff Scatter Data (Depth vs Longitude)
  const wadatiPoints = useMemo(() => {
    return filteredData.slice(0, 200).map((eq) => ({
      id: eq.id,
      lon: eq.longitude,
      lat: eq.latitude,
      depth: Math.min(650, eq.depth),
      mag: eq.magnitude,
      place: eq.place,
      eq
    }));
  }, [filteredData]);

  // Diurnal Hourly Distribution (UTC hour 0-23)
  const hourlyDistribution = useMemo(() => {
    const hours = new Array(24).fill(0);
    filteredData.forEach((eq) => {
      const d = new Date(eq.time);
      const h = d.getUTCHours();
      hours[h]++;
    });
    return hours.map((count, h) => ({ hour: h, count }));
  }, [filteredData]);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 text-slate-800 space-y-6 max-w-[1600px] mx-auto p-4 sm:p-6">
      {/* Power BI Workspace Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F2C811]" />
            <span>Power BI Business Intelligence Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Seismic Recurrence, Energy Trajectory &amp; Catastrophe Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-4xl">
            Interactive visual analytics, Gutenberg-Richter recurrence, focal depth profiling, and past disaster case studies.
          </p>
        </div>
      </div>

      {/* Interactive Country Select Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Country Select:</span>
            </span>

            {/* Country Dropdown */}
            <select
              value={selectedRegion || ''}
              onChange={(e) => setSelectedRegion(e.target.value ? e.target.value : null)}
              className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold px-3 py-1.5 text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
            >
              <option value="">🌐 All Regions (Show Total / Global)</option>
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>

            {/* Quick Slicer Button for Total */}
            <button
              type="button"
              onClick={() => setSelectedRegion(null)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !selectedRegion
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Show in Total (Global View)
            </button>
          </div>

          {/* Slicer Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['India', 'Japan', 'Indonesia', 'Chile', 'California', 'Turkey'].map((quickReg) => {
              const isSelected = selectedRegion?.toLowerCase() === quickReg.toLowerCase();
              return (
                <button
                  key={quickReg}
                  type="button"
                  onClick={() => setSelectedRegion(isSelected ? null : quickReg)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {quickReg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Banner with clear "Show Total" action */}
        {selectedRegion && (
          <div className="flex items-center justify-between bg-amber-50/90 border border-amber-300 px-3.5 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-amber-950">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <span>
                Currently showcasing specific dashboard for: <strong className="font-extrabold text-amber-900 underline">{selectedRegion}</strong> ({filteredData.length} events analyzed)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRegion(null)}
              className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-lg shadow-2xs transition-colors cursor-pointer text-xs ml-3 whitespace-nowrap"
            >
              ✕ Clear &amp; Show in Total
            </button>
          </div>
        )}
      </div>

      {/* DAX KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Event Count */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Total Quakes</div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{kpis.count}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {selectedRegion ? `${selectedRegion} events` : 'Global events analyzed'}
          </div>
        </div>

        {/* KPI 2: Max Magnitude */}
        <div className="p-4 bg-white rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-bold">Strongest Quake</div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 tabular-nums">
            M {kpis.maxMag.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Peak magnitude</div>
        </div>

        {/* KPI 3: Total Energy (Metric Compact Formatted) */}
        <div className="p-4 bg-white rounded-2xl border border-cyan-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-bold">Total Energy</div>
          <div className="text-3xl font-extrabold font-mono text-cyan-700 tabular-nums">
            {kpis.compactEnergy.value} <span className="text-xs text-slate-500 font-normal">{kpis.compactEnergy.unit}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono truncate" title={kpis.compactTnt}>
            {kpis.compactTnt}
          </div>
        </div>

        {/* KPI 4: Average Depth */}
        <div className="p-4 bg-white rounded-2xl border border-sky-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-700 font-bold">Average Depth</div>
          <div className="text-3xl font-extrabold font-mono text-sky-800 tabular-nums">
            {kpis.avgDepth.toFixed(1)} <span className="text-xs text-slate-500 font-normal">km</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Underground focus</div>
        </div>

        {/* KPI 5: Corrected Stress Index & Gutenberg b-value */}
        <div className="p-4 bg-white rounded-2xl border border-violet-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-violet-700 font-bold">Stress Index (b)</div>
          <div className="text-3xl font-extrabold font-mono text-violet-700 tabular-nums">
            {kpis.bValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono truncate" title={kpis.stressLabel}>
            {kpis.stressLabel}
          </div>
        </div>

        {/* KPI 6: Tsunami Flags */}
        <div className="p-4 bg-white rounded-2xl border border-rose-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold">Tsunami Alerts</div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 tabular-nums">{kpis.tsunamiAlerts}</div>
          <div className="text-[11px] text-slate-500 font-mono">Oceanic danger flags</div>
        </div>
      </div>

      {/* Main Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* Figure 3.1: Region-Wise Seismic Activity Leaderboard */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Figure 3.1 &mdash; Region-Wise Activity Leaderboard</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Top Global Seismic Hotspots Ranked
              </h2>
            </div>

            {/* Metric Toggle & Image Export Buttons */}
            <div className="flex items-center gap-1.5 self-start flex-wrap">
              {selectedRegion && (
                <button
                  type="button"
                  onClick={() => setSelectedRegion(null)}
                  className="px-2 py-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded cursor-pointer shadow-2xs"
                  title="Show all regions in total"
                >
                  ✕ Show Total
                </button>
              )}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setRegionRankMetric('count')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    regionRankMetric === 'count' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Rank by event frequency"
                >
                  Events
                </button>
                <button
                  type="button"
                  onClick={() => setRegionRankMetric('energy')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    regionRankMetric === 'energy' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Rank by radiated energy (TJ)"
                >
                  Energy
                </button>
                <button
                  type="button"
                  onClick={() => setRegionRankMetric('maxMag')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    regionRankMetric === 'maxMag' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Rank by maximum magnitude"
                >
                  Max M
                </button>
              </div>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-1', 'Figure_3_1_Region_Seismic_Leaderboard', 'Figure 3.1: Region-Wise Seismic Activity Leaderboard')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Ranks top geographic regions along tectonic fault margins. Shows disproportionate seismicity across Pacific subduction arcs (Indonesia, Japan, Chile, Fiji) versus intraplate belts. Click any bar to cross-filter.
          </p>

          {/* SVG Canvas for Figure 3.1 with pristine high-res vector rendering */}
          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-2 overflow-x-auto">
            <svg id="svg-figure-3-1" className="w-full min-w-[420px] h-64 overflow-visible" viewBox="0 0 500 240">
              {regionRankings.map((r, idx) => {
                const maxVal =
                  regionRankMetric === 'energy'
                    ? regionRankings[0]?.totalEnergyTJ || 1
                    : regionRankMetric === 'maxMag'
                    ? regionRankings[0]?.maxMag || 10
                    : regionRankings[0]?.count || 1;
                const curVal =
                  regionRankMetric === 'energy'
                    ? r.totalEnergyTJ
                    : regionRankMetric === 'maxMag'
                    ? r.maxMag
                    : r.count;
                const barWidth = Math.min(270, Math.max(20, (curVal / maxVal) * 270));
                const y = 10 + idx * 28;
                const isSelected = selectedRegion?.toLowerCase() === r.region.toLowerCase();

                return (
                  <g
                    key={r.region}
                    className="cursor-pointer group"
                    onClick={() => setSelectedRegion(isSelected ? null : r.region)}
                  >
                    {/* Rank Badge */}
                    <rect
                      x="8"
                      y={y}
                      width="18"
                      height="18"
                      rx="4"
                      fill={idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : idx === 2 ? '#B45309' : '#E2E8F0'}
                    />
                    <text
                      x="17"
                      y={y + 13}
                      textAnchor="middle"
                      fill={idx <= 2 ? '#FFFFFF' : '#334155'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>

                    {/* Region Label */}
                    <text
                      x="34"
                      y={y + 13}
                      fill={isSelected ? '#B45309' : '#0F172A'}
                      fontSize="11"
                      fontWeight={isSelected ? 'bold' : '600'}
                      fontFamily="sans-serif"
                    >
                      {r.region.length > 18 ? r.region.substring(0, 16) + '…' : r.region}
                    </text>

                    {/* Bar Background Track */}
                    <rect x="160" y={y + 3} width="270" height="13" rx="4" fill="#E2E8F0" opacity="0.6" />

                    {/* Colored Active Bar */}
                    <rect
                      x="160"
                      y={y + 3}
                      width={barWidth}
                      height="13"
                      rx="4"
                      fill={
                        isSelected
                          ? '#D97706'
                          : idx === 0
                          ? '#EA580C'
                          : idx === 1
                          ? '#F59E0B'
                          : '#0284C7'
                      }
                    />

                    {/* Measure Value Label on the right */}
                    <text
                      x="440"
                      y={y + 13}
                      fill="#334155"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {regionRankMetric === 'energy'
                        ? `${r.totalEnergyTJ.toFixed(1)} TJ`
                        : regionRankMetric === 'maxMag'
                        ? `M${r.maxMag.toFixed(1)}`
                        : `${r.count} quakes`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Ranked tectonic fault corridors</span>
            <span className="text-amber-700 font-semibold">Click any region to slice or use Country Slicer above</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.2: Catastrophe Benchmark Ranking (Deaths vs USD) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Figure 3.2 &mdash; Catastrophe Impact Disparity</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                History&apos;s Worst Quakes: Deaths vs Economic Loss
              </h2>
            </div>

            <div className="flex items-center gap-1.5 self-start">
              {/* Metric Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCatastropheMetric('deaths')}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    catastropheMetric === 'deaths'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Fatalities</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCatastropheMetric('economic')}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    catastropheMetric === 'economic'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <DollarSign className="w-3 h-3" />
                  <span>Economic ($ USD)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-2', 'Figure_3_2_Catastrophe_Impact_Disparity', 'Figure 3.2: Catastrophe Impact Disparity Benchmark')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {catastropheMetric === 'deaths'
              ? 'Fatalities benchmark highlights developing countries (Tangshan 242k, Haiti 220k), where unreinforced masonry failure caused massive human casualty rates.'
              : 'Economic damage benchmark highlights industrialized metropolitan zones (Tōhoku $360B, Kobe $100B, Northridge $49B), where modern asset density drives financial loss.'}
          </p>

          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-2 overflow-x-auto">
            <svg id="svg-figure-3-2" className="w-full min-w-[420px] h-64 overflow-visible" viewBox="0 0 500 240">
              {rankedCatastrophes.slice(0, 8).map((c, idx) => {
                const maxVal =
                  catastropheMetric === 'deaths'
                    ? rankedCatastrophes[0]?.deaths || 1
                    : rankedCatastrophes[0]?.economicLossUsdBn || 1;
                const curVal =
                  catastropheMetric === 'deaths' ? c.deaths : c.economicLossUsdBn;
                const barWidth = Math.min(240, Math.max(16, (curVal / maxVal) * 240));
                const y = 10 + idx * 28;

                return (
                  <g key={c.id}>
                    {/* Rank Badge */}
                    <rect
                      x="8"
                      y={y}
                      width="18"
                      height="18"
                      rx="4"
                      fill={catastropheMetric === 'deaths' ? '#E11D48' : '#059669'}
                    />
                    <text
                      x="17"
                      y={y + 13}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>

                    {/* Event Name */}
                    <text
                      x="34"
                      y={y + 13}
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {c.name.length > 20 ? c.name.substring(0, 18) + '…' : c.name} ({c.year})
                    </text>

                    {/* Magnitude Badge */}
                    <rect x="200" y={y + 2} width="32" height="15" rx="3" fill="#F1F5F9" stroke="#CBD5E1" />
                    <text x="216" y={y + 13} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      M{c.magnitude.toFixed(1)}
                    </text>

                    {/* Bar Track */}
                    <rect x="238" y={y + 3} width="240" height="13" rx="4" fill="#E2E8F0" opacity="0.6" />

                    {/* Bar Value */}
                    <rect
                      x="238"
                      y={y + 3}
                      width={barWidth}
                      height="13"
                      rx="4"
                      fill={
                        catastropheMetric === 'deaths'
                          ? idx === 0
                            ? '#BE123C'
                            : '#F43F5E'
                          : idx === 0
                          ? '#047857'
                          : '#10B981'
                      }
                    />

                    {/* Value text */}
                    <text
                      x="485"
                      y={y + 13}
                      textAnchor="end"
                      fill="#0F172A"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {catastropheMetric === 'deaths' ? c.deathDisplay.replace(' deaths', '') : `$${c.economicLossUsdBn}B`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Historical fatality vs. economic loss benchmarking</span>
            <span className="italic text-slate-600 truncate max-w-xs">Data verified: NOAA/NGDC Historic Archive</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.3: Gutenberg-Richter Recurrence Frequency-Mag Law */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Figure 3.3 &mdash; Gutenberg-Richter Recurrence Law</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                log₁₀ N = a - bM Empirical Model
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold">
                b = {kpis.bValue.toFixed(2)} (Recurrence Slope)
              </span>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-3', 'Figure_3_3_Gutenberg_Richter_Recurrence_Model', 'Figure 3.3: Gutenberg-Richter Recurrence Law (log10 N = a - bM)')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Empirical validation of the Gutenberg-Richter frequency-magnitude relation. For every 1-unit step up on the Richter scale, event frequency drops by a factor of 10. A lower calculated b-value indicates crustal shear stress concentration.
          </p>

          {/* SVG Chart for Gutenberg-Richter with high-res axes, regression line, and points */}
          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3 relative">
            <svg id="svg-figure-3-3" className="w-full h-64 overflow-visible" viewBox="0 0 460 220">
              {/* Plot Background Grid */}
              <rect x="45" y="15" width="395" height="165" fill="#FFFFFF" rx="4" stroke="#E2E8F0" />

              {/* Horizontal Log10 Grid Lines */}
              {[0, 1, 2, 3].map((val) => {
                const y = 180 - (val / 3) * 155;
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="440" y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                    <text x="38" y={y + 4} textAnchor="end" fill="#64748B" fontSize="10" fontFamily="monospace">
                      10^{val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Magnitude Ticks */}
              {[2, 3, 4, 5, 6, 7, 8].map((mag) => {
                const x = 45 + ((mag - 2) / 6) * 395;
                return (
                  <g key={mag}>
                    <line x1={x} y1="180" x2={x} y2="185" stroke="#94A3B8" />
                    <line x1={x} y1="15" x2={x} y2="180" stroke="#F1F5F9" />
                    <text x={x} y="198" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
                      M{mag}
                    </text>
                  </g>
                );
              })}

              {/* Axis Titles */}
              <text x="242" y="214" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Magnitude (Mw)
              </text>
              <text x="14" y="95" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 14,95)">
                log₁₀ Cumulative Events N(≥M)
              </text>

              {/* Fitted Linear Regression Line */}
              {grPoints.length >= 2 && (() => {
                const firstPt = grPoints[0];
                const lastPt = grPoints[grPoints.length - 1];
                const startMag = firstPt.mag;
                const endMag = lastPt.mag;
                const y1Log = kpis.aValue - kpis.bValue * startMag;
                const y2Log = kpis.aValue - kpis.bValue * endMag;
                const x1 = 45 + ((startMag - 2) / 6) * 395;
                const y1 = 180 - (Math.min(3, Math.max(0, y1Log)) / 3) * 155;
                const x2 = 45 + ((endMag - 2) / 6) * 395;
                const y2 = 180 - (Math.min(3, Math.max(0, y2Log)) / 3) * 155;
                return (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeDasharray="5,4"
                  />
                );
              })()}

              {/* Empirical Data Points */}
              {grPoints.map((pt, idx) => {
                const cx = 45 + ((pt.mag - 2) / 6) * 395;
                const cy = 180 - (Math.min(pt.logN, 3) / 3) * 155;
                return (
                  <g key={idx}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5.5"
                      fill="#10B981"
                      stroke="#065F46"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-7 transition-all"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          label: `M ≥ ${pt.mag.toFixed(1)}`,
                          value: `${pt.count} events (log₁₀ N = ${pt.logN.toFixed(2)})`
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text x={cx} y={cy - 8} textAnchor="middle" fill="#065F46" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {pt.count}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-800 shadow-lg">
                <span className="text-emerald-700 font-bold">{hoveredPoint.label}:</span> {hoveredPoint.value}
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Formula: log₁₀ N = {kpis.aValue.toFixed(2)} - {kpis.bValue.toFixed(2)} * M</span>
            <span className="text-emerald-700 font-semibold">Gutenberg & Richter (1944)</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.4: Hypocentral Focal Depth Stratification */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Figure 3.4 &mdash; Focal Depth Stratification</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Crustal, Subduction & Deep Mantle Ruptures
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-300 px-2 py-0.5 rounded font-bold">
                Avg: {kpis.avgDepth.toFixed(1)} km
              </span>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-4', 'Figure_3_4_Focal_Depth_Stratification', 'Figure 3.4: Focal Depth Stratification & Tsunami Risk')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-cyan-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Categorization by hypocenter depth. Shallow events (&lt;30 km) cause the highest ground accelerations. Oceanic shallow quakes (&lt;70 km, M&ge;7.0) constitute 100% of global tsunami trigger risks.
          </p>

          {/* SVG Visual for Focal Depth Breakdown */}
          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3">
            <svg id="svg-figure-3-4" className="w-full h-64 overflow-visible" viewBox="0 0 460 220">
              {Object.entries(depthStrataStats).map(([key, item], idx) => {
                const isSelected = selectedDepthStrata === key;
                const percent = filteredData.length > 0 ? (item.count / filteredData.length) * 100 : 0;
                const y = 20 + idx * 48;
                const barWidth = Math.min(260, Math.max(10, (percent / 100) * 260));

                return (
                  <g
                    key={key}
                    className="cursor-pointer group"
                    onClick={() => setSelectedDepthStrata(isSelected ? null : key)}
                  >
                    {/* Color Tag Indicator */}
                    <rect x="10" y={y} width="12" height="12" rx="3" fill={item.color} />

                    {/* Stratum Label */}
                    <text
                      x="28"
                      y={y + 10}
                      fill={isSelected ? '#0284C7' : '#0F172A'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {item.label}
                    </text>

                    {/* Scientific Hazard Description */}
                    <text x="28" y={y + 24} fill="#64748B" fontSize="9" fontFamily="sans-serif">
                      {item.desc}
                    </text>

                    {/* Bar Background Track */}
                    <rect x="230" y={y + 2} width="160" height="14" rx="4" fill="#E2E8F0" />

                    {/* Progress Bar */}
                    <rect
                      x="230"
                      y={y + 2}
                      width={(percent / 100) * 160}
                      height="14"
                      rx="4"
                      fill={item.color}
                      opacity={isSelected ? 1 : 0.85}
                    />

                    {/* Percentage & Count Label */}
                    <text x="400" y={y + 13} fill="#0F172A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {percent.toFixed(1)}% ({item.count})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Hypocentral focal depth stratification (USGS &amp; IRIS standards)</span>
            <span className="text-cyan-700 font-semibold">Click category to slice</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.5: Cumulative Seismic Energy Trajectory */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Figure 3.5 &mdash; Cumulative Seismic Energy Trajectory</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Seismic Moment Kinetic Release (Staircase Curve)
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono text-rose-800 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-lg font-bold">
                {kpis.compactEnergy.fullText} Total
              </span>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-5', 'Figure_3_5_Cumulative_Energy_Trajectory', 'Figure 3.5: Cumulative Seismic Moment Energy Release Trajectory')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Staircase trajectory illustrates the exponential 31.62x energy multiplier per magnitude unit (log₁₀ E = 4.8 + 1.5M). Co-seismic jumps demonstrate how rare giant ruptures account for over 90% of cumulative kinetic strain, punctuated by inter-seismic quiescence.
          </p>

          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3 relative">
            <svg id="svg-figure-3-5" className="w-full h-64 overflow-visible" viewBox="0 0 490 230">
              {/* Plot Background */}
              <rect x="58" y="15" width="415" height="165" fill="#FFFFFF" rx="4" stroke="#E2E8F0" />

              {/* Horizontal Grid & Metric Y-axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
                const y = 180 - frac * 165;
                const val = frac * Math.max(kpis.totalEnergyTJ, 0.1);
                const compactLabel = formatEnergyCompact(val).fullText;
                return (
                  <g key={frac}>
                    <line x1="58" y1={y} x2="473" y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                    <text x="52" y={y + 3.5} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {compactLabel}
                    </text>
                  </g>
                );
              })}

              {/* Time Milestones along bottom axis */}
              {energyTimeline.length > 0 && (() => {
                const indices = [0, Math.floor(energyTimeline.length * 0.5), energyTimeline.length - 1];
                return indices.map((idx, i) => {
                  const item = energyTimeline[idx];
                  if (!item) return null;
                  const x = 58 + (idx / Math.max(energyTimeline.length - 1, 1)) * 415;
                  return (
                    <g key={i}>
                      <line x1={x} y1="180" x2={x} y2="185" stroke="#94A3B8" />
                      <text
                        x={x}
                        y="198"
                        textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
                        fill="#64748B"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {item.formattedTime}
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Step-Wise Staircase Energy Trajectory */}
              {(() => {
                if (energyTimeline.length < 2) return null;
                const maxTJ = Math.max(kpis.totalEnergyTJ, 0.1);

                // Build staircase points (step-after)
                const stepPoints: string[] = [];
                let prevY = 180;

                energyTimeline.forEach((item, idx) => {
                  const x = 58 + (idx / (energyTimeline.length - 1)) * 415;
                  const y = 180 - (item.cumulativeTJ / maxTJ) * 165;
                  if (idx === 0) {
                    stepPoints.push(`${x},${y}`);
                  } else {
                    stepPoints.push(`${x},${prevY}`);
                    stepPoints.push(`${x},${y}`);
                  }
                  prevY = y;
                });

                const firstX = 58;
                const lastX = 473;

                return (
                  <>
                    {/* Shaded Area under staircase */}
                    <polygon
                      points={`${firstX},180 ${stepPoints.join(' ')} ${lastX},180`}
                      fill="rgba(244, 63, 94, 0.12)"
                    />
                    {/* Stepped line */}
                    <polyline
                      points={stepPoints.join(' ')}
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />

                    {/* Highlight Significant Step Markers */}
                    {energyTimeline
                      .filter((eq) => eq.magnitude >= 7.0 || eq.energyTJ / maxTJ > 0.12)
                      .slice(0, 5)
                      .map((eq, i) => {
                        const idx = energyTimeline.indexOf(eq);
                        const cx = 58 + (idx / (energyTimeline.length - 1)) * 415;
                        const cy = 180 - (eq.cumulativeTJ / maxTJ) * 165;
                        return (
                          <g
                            key={i}
                            className="cursor-pointer group"
                            onMouseEnter={() =>
                              setHoveredEnergy({
                                title: eq.place,
                                mag: eq.magnitude,
                                released: formatEnergyCompact(eq.energyTJ).fullText,
                                cum: formatEnergyCompact(eq.cumulativeTJ).fullText,
                                date: eq.formattedTime
                              })
                            }
                            onMouseLeave={() => setHoveredEnergy(null)}
                          >
                            <circle cx={cx} cy={cy} r="4.5" fill="#BE123C" stroke="#FFFFFF" strokeWidth="1.5" />
                            <rect x={cx - 15} y={cy - 20} width="30" height="15" rx="3" fill="#BE123C" opacity="0.9" />
                            <text x={cx} y={cy - 9} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                              M{eq.magnitude.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                  </>
                );
              })()}

              {/* Axis Titles */}
              <text x="265" y="214" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Chronological Sequence &amp; Major Co-Seismic Rupture Steps
              </text>
              <text x="16" y="98" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 16,98)">
                Cumulative Energy Released
              </text>
            </svg>

            {/* Hover Tooltip Overlay for Figure 3.5 */}
            {hoveredEnergy && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-rose-300 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 shadow-xl pointer-events-none">
                <div className="text-rose-700 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>M{hoveredEnergy.mag.toFixed(1)} &mdash; {hoveredEnergy.title}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Released: <strong className="text-rose-900">{hoveredEnergy.released}</strong> · Total: {hoveredEnergy.cum}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{hoveredEnergy.date}</div>
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Formula: log₁₀ E = 4.8 + 1.5 * M (Joules)</span>
            <span className="text-rose-700 font-semibold">{kpis.compactTnt} equivalent</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.6: Wadati-Benioff Subduction Zone Cross-Section */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-bold flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Figure 3.6 &mdash; Wadati-Benioff Subduction Profile</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Hypocentral Depth vs Epicentral Longitude Cross-Section
              </h2>
            </div>

            <button
              type="button"
              onClick={() => exportSvgAsPng('svg-figure-3-6', 'Figure_3_6_Wadati_Benioff_Subduction_Profile', 'Figure 3.6: Wadati-Benioff Subduction Zone Cross-Section')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer self-start"
              title="Download PNG for report document"
            >
              <FileImage className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export for Report</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Cross-sectional projection illustrating how hypocenters plunge into the asthenosphere along descending oceanic lithospheric slabs. Deep events (&gt;300 km) cluster exclusively along subduction trenches (Tonga, Japan, Kuril, Sunda).
          </p>

          {/* Geological Depth Strata Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 flex-wrap">
            <span className="text-slate-500 font-bold">Lithosphere Strata:</span>
            <span className="flex items-center gap-1 text-red-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              Crustal (&lt;70 km)
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              Subducting Slab (70–300 km)
            </span>
            <span className="flex items-center gap-1 text-indigo-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
              Deep Mantle Wadati-Benioff (&gt;300 km)
            </span>
          </div>

          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3 relative">
            <svg id="svg-figure-3-6" className="w-full h-64 overflow-visible" viewBox="0 0 490 230">
              {/* Background */}
              <rect x="52" y="24" width="420" height="156" fill="#FFFFFF" rx="4" stroke="#CBD5E1" />

              {/* Shaded Geological Strata Bands */}
              {/* Band 1: Shallow Crustal (0 to 70 km) */}
              <rect x="52" y="24" width="420" height="17" fill="rgba(239, 68, 68, 0.06)" />
              <text x="56" y="36" fill="#DC2626" fontSize="8" fontFamily="sans-serif" fontWeight="600" opacity="0.8">
                CRUSTAL ZONE (&lt;70 km)
              </text>

              {/* Band 2: Intermediate Slab (70 to 300 km) */}
              <rect x="52" y="41" width="420" height="55" fill="rgba(245, 158, 11, 0.04)" />
              <text x="56" y="55" fill="#D97706" fontSize="8" fontFamily="sans-serif" fontWeight="600" opacity="0.8">
                SUBDUCTING LITHOSPHERIC SLAB (70 - 300 km)
              </text>

              {/* Band 3: Deep Asthenosphere (300 to 650 km) */}
              <rect x="52" y="96" width="420" height="84" fill="rgba(79, 70, 229, 0.04)" />
              <text x="56" y="112" fill="#4F46E5" fontSize="8" fontFamily="sans-serif" fontWeight="600" opacity="0.8">
                MANTLE TRANSITION ZONE (&gt;300 km - Phase Change Dehydration)
              </text>

              {/* Major Subduction Trenches Annotated at Top */}
              {[
                { lon: -115, label: 'Cascadia / Andes' },
                { lon: 0, label: 'Mid-Atlantic' },
                { lon: 88, label: 'Himalayas / Sunda' },
                { lon: 142, label: 'Japan / Marianas' },
                { lon: 175, label: 'Tonga Trench' }
              ].map((trench, idx) => {
                const x = 52 + ((trench.lon + 180) / 360) * 420;
                return (
                  <g key={idx}>
                    <line x1={x} y1="20" x2={x} y2="24" stroke="#6366F1" strokeWidth="1.5" />
                    <text x={x} y="16" textAnchor="middle" fill="#4338CA" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      ▼ {trench.label}
                    </text>
                  </g>
                );
              })}

              {/* Depth Grid Lines & Ticks */}
              {[0, 70, 150, 300, 450, 600].map((d) => {
                const y = 24 + (d / 650) * 156;
                return (
                  <g key={d}>
                    <line
                      x1="52"
                      y1={y}
                      x2="472"
                      y2={y}
                      stroke={d === 70 || d === 300 ? '#94A3B8' : '#E2E8F0'}
                      strokeDasharray={d === 70 || d === 300 ? '4,2' : '3,3'}
                    />
                    <text x="46" y={y + 3.5} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {d} km
                    </text>
                  </g>
                );
              })}

              {/* Longitude Grid Lines & Ticks */}
              {[-180, -120, -60, 0, 60, 120, 180].map((lon) => {
                const x = 52 + ((lon + 180) / 360) * 420;
                return (
                  <g key={lon}>
                    <line x1={x} y1="180" x2={x} y2="185" stroke="#94A3B8" />
                    <line x1={x} y1="24" x2={x} y2="180" stroke="#F1F5F9" />
                    <text x={x} y="197" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {lon > 0 ? `+${lon}°` : `${lon}°`}
                    </text>
                  </g>
                );
              })}

              {/* Scatter Points */}
              {wadatiPoints.map((pt, idx) => {
                const cx = 52 + ((pt.lon + 180) / 360) * 420;
                const cy = 24 + (pt.depth / 650) * 156;
                const r = Math.max(3.2, Math.min(9, pt.mag * 0.95));
                const color = pt.depth > 300 ? '#4F46E5' : pt.depth > 70 ? '#D97706' : '#DC2626';

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={color}
                    opacity="0.8"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    className="cursor-pointer hover:opacity-100 hover:scale-125 transition-transform"
                    onClick={() => {
                      if (pt.eq) onSelectQuake(pt.eq);
                    }}
                    onMouseEnter={() =>
                      setHoveredWadati({
                        place: pt.place,
                        mag: pt.mag,
                        depth: pt.depth,
                        lon: pt.lon,
                        lat: pt.lat
                      })
                    }
                    onMouseLeave={() => setHoveredWadati(null)}
                  />
                );
              })}

              {/* Axis Titles */}
              <text x="262" y="215" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Epicentral Longitude (-180° to +180° W/E) &mdash; Subduction Trench Cross-Sections
              </text>
              <text x="14" y="102" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 14,102)">
                Focal Depth (0 to 650 km)
              </text>
            </svg>

            {/* Hover Tooltip Overlay for Figure 3.6 */}
            {hoveredWadati && (
              <div className="absolute top-8 right-6 bg-white/95 backdrop-blur-sm border border-indigo-200 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 shadow-xl pointer-events-none">
                <div className="text-indigo-700 font-bold">
                  M{hoveredWadati.mag.toFixed(1)} &mdash; {hoveredWadati.place}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Focal Depth: <strong className="text-indigo-900">{hoveredWadati.depth.toFixed(1)} km</strong> · Coord: {hoveredWadati.lat.toFixed(2)}°, {hoveredWadati.lon.toFixed(2)}°
                </div>
                <div className="text-[10px] text-indigo-500 font-sans mt-0.5">Click point to view epicenter on Map</div>
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Subduction Slab Geometry: Wadati (1927) &amp; Benioff (1949)</span>
            <span className="text-indigo-700 font-semibold">Trench &rarr; Benioff Zone</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Figure 3.7: Past Disasters & Historical Case Studies */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-600" />
              <span>Figure 3.7 &mdash; Past Disasters &amp; Historical Case Studies</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Major Catastrophes &amp; Structural Engineering Lessons (India &amp; Global)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {HISTORICAL_QUAKES.length} Historical Case Studies
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Disaster Selection List (5 cols) */}
          <div className="lg:col-span-5 space-y-2 overflow-y-auto max-h-[520px] pr-1">
            {HISTORICAL_QUAKES.map((hq) => {
              const isSelected = selectedHistoricalQuake.id === hq.id;
              return (
                <button
                  key={hq.id}
                  type="button"
                  onClick={() => setSelectedHistoricalQuake(hq)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-medium">
                      {hq.year} · {hq.country}
                    </span>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] border ${
                        hq.magnitude >= 8.5
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      M {hq.magnitude.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">{hq.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {hq.fatalities} deaths · {hq.damageUsd}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Analytical Dossier (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/70 rounded-xl border border-slate-200 p-4.5 space-y-4">
            <div className="border-b border-slate-200 pb-3 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-amber-800 font-bold">
                <span>{selectedHistoricalQuake.date} · {selectedHistoricalQuake.location}</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {selectedHistoricalQuake.coordinates[0]}°N, {selectedHistoricalQuake.coordinates[1]}°E
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{selectedHistoricalQuake.name}</h3>
              <div className="text-xs text-slate-600 font-mono">
                Fault Mechanism: <span className="text-slate-900 font-semibold">{selectedHistoricalQuake.faultMechanism}</span>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Magnitude</div>
                <div className="text-base font-bold text-amber-600 mt-0.5">M {selectedHistoricalQuake.magnitude.toFixed(1)}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Fatalities</div>
                <div className="text-base font-bold text-rose-600 mt-0.5">{selectedHistoricalQuake.fatalities}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Loss (USD)</div>
                <div className="text-xs font-bold text-slate-900 mt-1 truncate">{selectedHistoricalQuake.damageUsd}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Rupture Length</div>
                <div className="text-base font-bold text-sky-700 mt-0.5">{selectedHistoricalQuake.ruptureLengthKm} km</div>
              </div>
            </div>

            {/* Event Summary */}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Disaster Summary</div>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {selectedHistoricalQuake.summary}
              </p>
            </div>

            {/* Lessons Learned */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Structural Engineering &amp; Building Code Lessons
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedHistoricalQuake.lessonsLearned.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-[11px] leading-relaxed">{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Interactive Power BI Telemetry Records Ledger */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              FactEarthquakeEvents Dimension Explorer
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Active Ingested Telemetry Records ({filteredData.length} records)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Click any row to locate on Map
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Magnitude</th>
                <th className="py-2.5 px-3 font-semibold">Epicenter / Country</th>
                <th className="py-2.5 px-3 font-semibold">Focal Depth</th>
                <th className="py-2.5 px-3 font-semibold">Energy (TJ)</th>
                <th className="py-2.5 px-3 font-semibold">Shaking (MMI)</th>
                <th className="py-2.5 px-3 font-semibold">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-semibold">Tsunami Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredData.slice(0, 15).map((eq) => (
                <tr
                  key={eq.id}
                  onClick={() => onSelectQuake(eq)}
                  className="hover:bg-amber-50/60 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        eq.magnitude >= 6.0
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : eq.magnitude >= 4.5
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      M {eq.magnitude.toFixed(1)} {eq.magType.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 truncate max-w-xs font-medium text-slate-900 group-hover:text-amber-800">
                    {eq.place}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-700 font-semibold">{eq.depth.toFixed(1)} km</td>
                  <td className="py-2.5 px-3">{(eq.energyJoules / 1e12).toFixed(2)} TJ</td>
                  <td className="py-2.5 px-3">MMI {eq.mmi ?? 'N/A'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{eq.formattedTime}</td>
                  <td className="py-2.5 px-3">
                    {eq.tsunami === 1 ? (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Alert Triggered
                      </span>
                    ) : (
                      <span className="text-slate-400">0 (Normal)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
