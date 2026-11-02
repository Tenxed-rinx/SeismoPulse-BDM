import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Earthquake, FilterState, MapTileLayer } from '../types/seismic';
import { TECTONIC_PLATES_GEOJSON, RING_OF_FIRE_VOLCANOES } from '../data/tectonicPlates';
import { INDIAN_CITY_DATABASE, IndianCityProfile, THOROUGH_INDIAN_EARTHQUAKES, INDIAN_EARTHQUAKES_AS_EQ } from '../data/indianSeismicData';
import {
  Layers,
  Search,
  SlidersHorizontal,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Compass,
  MapPin,
  Mountain,
  RefreshCw,
  Globe2,
  Building2,
  X,
  Navigation,
  Info,
  History
} from 'lucide-react';

interface SeismicMapProps {
  earthquakes: Earthquake[];
  selectedQuake: Earthquake | null;
  onSelectQuake: (quake: Earthquake | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeFeed: string;
  onChangeFeed: (feedKey: string) => void;
  isLoading: boolean;
  isActive?: boolean;
}

export const SeismicMap: React.FC<SeismicMapProps> = ({
  earthquakes,
  selectedQuake,
  onSelectQuake,
  filters,
  setFilters,
  activeFeed,
  onChangeFeed,
  isLoading,
  isActive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pastIndianLayerRef = useRef<L.LayerGroup | null>(null);
  const tectonicLayerRef = useRef<L.GeoJSON | null>(null);
  const volcanoesLayerRef = useRef<L.LayerGroup | null>(null);
  const selectedShakeRadiusLayerRef = useRef<L.LayerGroup | null>(null);
  const cityMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const cityMarkerMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Map Controls State
  const [tileLayer, setTileLayer] = useState<MapTileLayer>('topo');
  const [showTectonicPlates, setShowTectonicPlates] = useState<boolean>(true);
  const [showPastIndianQuakes, setShowPastIndianQuakes] = useState<boolean>(true);
  const [showVolcanoes, setShowVolcanoes] = useState<boolean>(false);
  const [showIndianCities, setShowIndianCities] = useState<boolean>(true);
  const [activeCityPopup, setActiveCityPopup] = useState<IndianCityProfile | null>(null);

  // Tile layer configuration (100% Free, NO API keys, NO watermarks!)
  const getTileConfig = (layerType: MapTileLayer): { url: string; options: L.TileLayerOptions } => {
    switch (layerType) {
      case 'topo':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: 'Tiles &copy; Esri &mdash; USGS, NOAA, DeLorme',
            maxZoom: 18
          }
        };
      case 'street':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            attribution: '&copy; OpenStreetMap contributors',
            subdomains: ['a', 'b', 'c'],
            maxZoom: 19
          }
        };
      case 'terrain':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: '&copy; Esri World Imagery &mdash; Earthstar Geographics',
            maxZoom: 18
          }
        };
      case 'dark':
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ',
            maxZoom: 16
          }
        };
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center on India / Himalayan seismic collision belt
    const map = L.map(mapContainerRef.current, {
      center: [23.5, 79.0],
      zoom: 4.6,
      minZoom: 1.8,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true,
      doubleClickZoom: false // disable default zoom-in on double click
    });

    // Custom user requirement: double click on the map zooms out
    map.on('dblclick', () => {
      map.zoomOut();
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer: Esri World Topo Map (Clean, zero watermarks)
    const tileConfig = getTileConfig('topo');
    const baseTile = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    currentTileLayerRef.current = baseTile;

    // Layer Groups
    markersLayerRef.current = L.layerGroup().addTo(map);
    pastIndianLayerRef.current = L.layerGroup().addTo(map);
    cityMarkersLayerRef.current = L.layerGroup().addTo(map);
    volcanoesLayerRef.current = L.layerGroup().addTo(map);
    selectedShakeRadiusLayerRef.current = L.layerGroup().addTo(map);

    // Tectonic Plates GeoJSON Layer
    const tectonicGeoJson = L.geoJSON(TECTONIC_PLATES_GEOJSON as any, {
      style: (feature) => {
        const type = feature?.properties?.Type;
        let color = '#0284C7';
        if (type === 'Convergent') color = '#DC2626'; // Red for subduction trenches (Himalayas)
        if (type === 'Transform') color = '#D97706'; // Amber for transform faults
        if (type === 'Divergent') color = '#059669'; // Emerald for spreading rifts
        return {
          color: color,
          weight: 2.5,
          opacity: 0.9,
          dashArray: '5, 5',
          lineCap: 'round',
          lineJoin: 'round'
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.PlateName) {
          layer.bindTooltip(
            `<div class="text-xs font-bold text-slate-900">${feature.properties.PlateName}</div><div class="text-[11px] text-sky-700 font-semibold">Type: ${feature.properties.Type} Fault Boundary</div>`,
            { sticky: true, className: 'leaflet-popup-content-wrapper' }
          );
        }
      }
    });

    tectonicGeoJson.addTo(map);
    tectonicLayerRef.current = tectonicGeoJson;

    mapInstanceRef.current = map;

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate size on tab change or mount
  useEffect(() => {
    if (isActive && mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 60);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 250);
    }
  }, [isActive]);

  // Tile layer switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (currentTileLayerRef.current && map.hasLayer(currentTileLayerRef.current)) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const tileConfig = getTileConfig(tileLayer);
    const newLayer = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    currentTileLayerRef.current = newLayer;
  }, [tileLayer]);

  // Toggle Tectonic Plates Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tectonicLayerRef.current) return;
    if (showTectonicPlates) {
      if (!mapInstanceRef.current.hasLayer(tectonicLayerRef.current)) {
        tectonicLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(tectonicLayerRef.current)) {
        mapInstanceRef.current.removeLayer(tectonicLayerRef.current);
      }
    }
  }, [showTectonicPlates]);

  // Toggle Volcanoes Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !volcanoesLayerRef.current) return;
    const layer = volcanoesLayerRef.current;
    layer.clearLayers();

    if (showVolcanoes) {
      RING_OF_FIRE_VOLCANOES.forEach((v) => {
        const volcanoIcon = L.divIcon({
          className: 'custom-volcano-icon',
          html: `<div style="transform: rotate(45deg); width: 8px; height: 8px; background: #EC4899; border: 1.5px solid #FFFFFF; box-shadow: 0 0 3px rgba(236,72,153,0.8);"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });

        const marker = L.marker([v.coordinates[0], v.coordinates[1]], { icon: volcanoIcon });
        marker.bindTooltip(
          `<div class="text-xs font-bold text-slate-900">🌋 ${v.name}</div><div class="text-[11px] text-pink-700 font-semibold">${v.country} · Elev ${v.elevationM}m (${v.type})</div>`,
          { className: 'leaflet-popup-content-wrapper' }
        );
        marker.addTo(layer);
      });
    }
  }, [showVolcanoes]);

  // Plot Indian Cities Directly on Map (With the 5 Specific Details in Popups)
  useEffect(() => {
    if (!mapInstanceRef.current || !cityMarkersLayerRef.current) return;
    const layer = cityMarkersLayerRef.current;
    layer.clearLayers();
    cityMarkerMapRef.current.clear();

    if (showIndianCities) {
      Object.entries(INDIAN_CITY_DATABASE).forEach(([cityKey, city]) => {
        const zoneColor =
          city.seismicZone.includes('Zone V')
            ? '#9333EA'
            : city.seismicZone.includes('Zone IV')
            ? '#DC2626'
            : city.seismicZone.includes('Zone III')
            ? '#D97706'
            : '#059669';

        const cityIcon = L.divIcon({
          className: 'custom-city-marker',
          html: `<div style="display: flex; align-items: center; gap: 4px; background: white; border: 1.5px solid ${zoneColor}; padding: 2px 6px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); font-family: sans-serif; cursor: pointer; white-space: nowrap;">
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: ${zoneColor}; display: inline-block;"></span>
                  <span style="font-size: 10px; font-weight: 700; color: #0F172A;">${city.name.split(' ')[0]}</span>
                </div>`,
          iconSize: [60, 20],
          iconAnchor: [30, 10]
        });

        const marker = L.marker(city.coordinates, { icon: cityIcon });

        // Rich Popup Containing the 5 Specific Details
        const popupContent = `
          <div style="font-family: sans-serif; max-width: 280px; padding: 4px 2px; color: #0F172A;">
            <div style="border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 6px;">
              <div style="font-size: 13px; font-weight: 800; color: #0F172A;">${city.name}</div>
              <div style="display: flex; gap: 4px; margin-top: 2px;">
                <span style="background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; border: 1px solid #FCD34D;">${city.seismicZone}</span>
                <span style="background: #F1F5F9; color: #475569; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px;">${city.riskLevel}</span>
              </div>
            </div>
            <div style="font-size: 11px; line-height: 1.4; display: flex; flex-direction: column; gap: 6px;">
              <div><strong>1. Earthquake Status:</strong> ${city.hasExperiencedEarthquake ? '⚠️ Recorded in Catalog' : '✓ No Direct Rupture'}<br/><span style="color: #64748B; font-size: 10px;">${city.epicenterStatus}</span></div>
              <div><strong>2. BIS Hazard Zone:</strong> <span style="color: #B45309; font-weight: 700;">${city.seismicZone}</span> (${city.zoneFactor})</div>
              <div><strong>3. Tectonic Fault:</strong> <span style="color: #0284C7; font-weight: 600;">${city.primaryFault}</span></div>
              <div><strong>4. Peak Historical Mag:</strong> <strong>${city.historicalMaxMag}</strong><br/><span style="color: #64748B; font-size: 10px;">${city.historicalImpact}</span></div>
              <div style="background: #F8FAFC; padding: 6px; border-radius: 6px; border: 1px solid #E2E8F0;">
                <strong>5. Action Plan:</strong>
                <ul style="margin: 2px 0 0 14px; padding: 0; font-size: 10px; color: #334155;">
                  ${city.safetyActions.slice(0, 2).map((a) => `<li>${a}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300 });
        marker.on('click', () => {
          setActiveCityPopup(city);
        });
        marker.addTo(layer);
        cityMarkerMapRef.current.set(cityKey.toLowerCase(), marker);
      });
    }
  }, [showIndianCities]);

  // Handler to focus on any Indian city, fly to it, and open its 5-detail popup
  const handleFocusCity = (cityKey: string, city: IndianCityProfile) => {
    if (!mapInstanceRef.current) return;
    if (!showIndianCities) setShowIndianCities(true);
    mapInstanceRef.current.flyTo(city.coordinates, 8, { duration: 1.2 });
    setActiveCityPopup(city);
    const marker = cityMarkerMapRef.current.get(cityKey.toLowerCase());
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
  };

  // Color mapper based on magnitude
  const getMagColor = (mag: number): { fill: string; stroke: string } => {
    if (mag >= 7.5) return { fill: '#9333EA', stroke: '#581C87' }; // Purple Mega
    if (mag >= 6.0) return { fill: '#E11D48', stroke: '#9F1239' }; // Rose Major
    if (mag >= 4.5) return { fill: '#EA580C', stroke: '#9A3412' }; // Orange Moderate
    if (mag >= 3.0) return { fill: '#D97706', stroke: '#92400E' }; // Amber Light
    return { fill: '#059669', stroke: '#065F46' }; // Emerald Micro
  };

  // Render Past Indian Earthquakes Dotted on Map with Normal Specifications
  useEffect(() => {
    if (!mapInstanceRef.current || !pastIndianLayerRef.current) return;
    const layer = pastIndianLayerRef.current;
    layer.clearLayers();

    if (!showPastIndianQuakes) return;

    // Filter past Indian earthquakes
    const matchingPast = THOROUGH_INDIAN_EARTHQUAKES.filter((rec) => {
      if (rec.magnitude < filters.minMagnitude || rec.magnitude > filters.maxMagnitude) return false;
      if (rec.depthKm > filters.maxDepth) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          rec.name.toLowerCase().includes(q) ||
          rec.stateOrRegion.toLowerCase().includes(q) ||
          rec.tectonicFault.toLowerCase().includes(q) ||
          rec.summary.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    matchingPast.forEach((rec) => {
      // Normal dot radius (standard, non-overlapping circular marker)
      const radiusPx = rec.magnitude >= 8.0 ? 11 : rec.magnitude >= 7.0 ? 9.5 : rec.magnitude >= 6.0 ? 8 : 6.5;

      // Color mapping based on magnitude severity
      const fillColor =
        rec.magnitude >= 8.0
          ? '#991B1B'
          : rec.magnitude >= 7.0
          ? '#DC2626'
          : rec.magnitude >= 6.0
          ? '#EA580C'
          : '#D97706';

      // Crisp circle marker dot with white border
      const marker = L.circleMarker([rec.latitude, rec.longitude], {
        radius: radiusPx,
        fillColor: fillColor,
        color: '#FFFFFF',
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.9
      });

      // Normal Specifications in Popup
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 270px; max-width: 320px; color: #0F172A; padding: 4px 2px;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.25;">${rec.name}</div>
              <div style="font-size: 10.5px; color: #64748B; margin-top: 2px;">${rec.stateOrRegion}</div>
            </div>
            <span style="background: #FEE2E2; color: #991B1B; font-weight: 800; font-size: 11px; padding: 2px 7px; border-radius: 6px; border: 1px solid #FCA5A5; white-space: nowrap;">
              M ${rec.magnitude.toFixed(1)}
            </span>
          </div>

          <table style="width: 100%; font-size: 11px; border-collapse: collapse; line-height: 1.5;">
            <tbody>
              <tr>
                <td style="color: #64748B; padding: 2px 0; width: 40%;"><strong>📅 Date:</strong></td>
                <td style="color: #0F172A; font-weight: 600; padding: 2px 0;">${rec.date} (${rec.year})</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 2px 0;"><strong>📉 Focal Depth:</strong></td>
                <td style="color: #0369A1; font-weight: 700; padding: 2px 0;">${rec.depthKm} km</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 2px 0;"><strong>🌐 Coordinates:</strong></td>
                <td style="color: #334155; font-family: monospace; font-size: 10px; padding: 2px 0;">${rec.latitude.toFixed(2)}°N, ${rec.longitude.toFixed(2)}°E</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 2px 0;"><strong>⚡ Intensity (MMI):</strong></td>
                <td style="color: #B45309; font-weight: 700; padding: 2px 0;">${rec.mmi}</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 2px 0;"><strong>🛡️ BIS Seismic Zone:</strong></td>
                <td style="color: #7C2D12; font-weight: 700; padding: 2px 0;">${rec.seismicZone}</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 2px 0;"><strong>🪨 Primary Fault:</strong></td>
                <td style="color: #0284C7; font-weight: 600; padding: 2px 0;">${rec.tectonicFault}</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 2px 0;"><strong>⚠️ Casualties / Losses:</strong></td>
                <td style="color: #DC2626; font-weight: 700; padding: 2px 0;">${rec.fatalities}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 8px; padding: 6px 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 10px; color: #334155; line-height: 1.4;">
            <strong>Impact Summary:</strong> ${rec.summary}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 320 });

      // Fast tooltip on hover
      marker.bindTooltip(
        `<div class="text-xs font-bold text-slate-900">🏛️ ${rec.name}</div>
         <div class="text-[11px] font-mono text-slate-700">Magnitude: <strong class="text-rose-700">M ${rec.magnitude.toFixed(1)}</strong> · Depth: <span class="text-sky-700 font-semibold">${rec.depthKm} km</span></div>
         <div class="text-[10px] text-slate-500 font-sans">${rec.date} · ${rec.stateOrRegion}</div>`,
        { className: 'leaflet-popup-content-wrapper' }
      );

      marker.on('click', () => {
        const matchingEq = INDIAN_EARTHQUAKES_AS_EQ.find((e) => e.id === rec.id);
        if (matchingEq) {
          onSelectQuake(matchingEq);
        }
      });

      marker.addTo(layer);
    });
  }, [showPastIndianQuakes, filters]);

  // Matching Indian Cities based on search query
  const matchingIndianCities = filters.searchQuery.trim().length > 1
    ? Object.entries(INDIAN_CITY_DATABASE).filter(([key, city]) => {
        const q = filters.searchQuery.toLowerCase();
        return (
          city.name.toLowerCase().includes(q) ||
          city.state.toLowerCase().includes(q) ||
          key.toLowerCase().includes(q) ||
          city.primaryFault.toLowerCase().includes(q)
        );
      })
    : [];

  // Combine feed earthquakes with Indian Historical Earthquakes so they can always be searched and selected
  const allAvailableQuakes = React.useMemo(() => {
    const map = new Map<string, Earthquake>();
    earthquakes.forEach((eq) => map.set(eq.id, eq));
    INDIAN_EARTHQUAKES_AS_EQ.forEach((eq) => {
      if (!map.has(eq.id)) {
        map.set(eq.id, eq);
      }
    });
    return Array.from(map.values());
  }, [earthquakes]);

  // Filter Earthquakes
  const filteredQuakes = allAvailableQuakes.filter((eq) => {
    if (eq.magnitude < filters.minMagnitude || eq.magnitude > filters.maxMagnitude) return false;
    if (eq.depth > filters.maxDepth) return false;
    if (filters.tsunamiOnly && eq.tsunami !== 1) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchPlace = eq.place.toLowerCase().includes(q);
      const matchTitle = eq.title.toLowerCase().includes(q);
      if (!matchPlace && !matchTitle) return false;
    }
    return true;
  });

  // Render Earthquake Markers on Map (NO massive overlapping pink circles!)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const markersGroup = markersLayerRef.current;

    filteredQuakes.forEach((eq) => {
      const colors = getMagColor(eq.magnitude);
      const radiusPx = Math.max(5, Math.min(22, Math.pow(eq.magnitude, 1.4) * 1.2));

      // Crisp circle marker
      const marker = L.circleMarker([eq.latitude, eq.longitude], {
        radius: radiusPx,
        fillColor: colors.fill,
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 0.95,
        fillOpacity: 0.85
      });

      marker.on('click', () => {
        onSelectQuake(eq);
      });

      marker.bindTooltip(
        `<div class="text-xs font-bold text-slate-900">${eq.place}</div>
         <div class="text-[11px] font-mono text-slate-700">Magnitude: <strong class="text-amber-700">M ${eq.magnitude.toFixed(1)}</strong> · Depth: <span class="text-sky-700 font-semibold">${eq.depth.toFixed(1)} km</span></div>
         <div class="text-[10px] text-slate-500 font-mono">${eq.formattedTime}</div>`,
        { className: 'leaflet-popup-content-wrapper' }
      );

      marker.addTo(markersGroup);
    });
  }, [filteredQuakes]);

  // Handle Selected Earthquake: Fly to and Draw a SINGLE Subtle Shake Radius ONLY for this Quake
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedShakeRadiusLayerRef.current) return;
    selectedShakeRadiusLayerRef.current.clearLayers();

    if (selectedQuake) {
      mapInstanceRef.current.flyTo([selectedQuake.latitude, selectedQuake.longitude], 6, {
        duration: 1.2
      });

      // Draw single subtle shake radius for the selected earthquake ONLY
      if (selectedQuake.magnitude >= 4.5) {
        const shakeKm = Math.pow(10, 0.5 * selectedQuake.magnitude - 0.7) * 16;
        const circle = L.circle([selectedQuake.latitude, selectedQuake.longitude], {
          radius: shakeKm * 1000,
          color: '#E11D48',
          fillColor: '#E11D48',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '5, 5'
        });
        circle.addTo(selectedShakeRadiusLayerRef.current);
      }
    }
  }, [selectedQuake]);

  // Jump to Presets
  const handleJumpToIndia = () => {
    mapInstanceRef.current?.flyTo([23.5, 79.0], 4.8, { duration: 1.2 });
  };

  const handleJumpToGlobal = () => {
    mapInstanceRef.current?.flyTo([20, 10], 2.2, { duration: 1.2 });
  };

  return (
    <div className="h-[calc(100vh-57px)] w-full flex flex-col md:flex-row overflow-hidden relative font-sans bg-slate-100">
      {/* ========================================================================= */}
      {/* MAIN INTERACTIVE MAP AREA (Fills Screen) */}
      {/* ========================================================================= */}
      <div className="flex-1 h-full relative overflow-hidden">
        {/* The Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* FLOATING MAP CONTROLS & BUTTONS (Clean, prominent, z-[1000] above all Leaflet panes) */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 max-w-[calc(100%-24px)] pointer-events-auto">
          {/* Basemap Switcher Buttons */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200/90 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTileLayer('topo')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileLayer === 'topo' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Topographic terrain contours"
            >
              🏔️ Topo
            </button>
            <button
              type="button"
              onClick={() => setTileLayer('street')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileLayer === 'street' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Street map view"
            >
              🏙️ Street
            </button>
            <button
              type="button"
              onClick={() => setTileLayer('terrain')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileLayer === 'terrain' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="High-resolution satellite imagery"
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => setTileLayer('dark')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileLayer === 'dark' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Dark cartography"
            >
              🌑 Dark
            </button>
          </div>

          {/* Layer Toggle Buttons */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200/90 flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setShowPastIndianQuakes(!showPastIndianQuakes)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                showPastIndianQuakes ? 'bg-rose-100 text-rose-950 border border-rose-300 font-bold shadow-2xs' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle Past Indian Earthquakes Dotted with Normal Specifications"
            >
              <History className="w-3.5 h-3.5 text-rose-600" />
              <span>Past Indian Quakes</span>
              <span className="text-[10px] bg-rose-600 text-white rounded-full px-1.5 py-0.2 font-mono">
                {THOROUGH_INDIAN_EARTHQUAKES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowIndianCities(!showIndianCities)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                showIndianCities ? 'bg-orange-100 text-orange-950 border border-orange-300 font-bold shadow-2xs' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle Indian Cities with 5-Detail Seismic Risk on Map"
            >
              <Building2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Indian Cities</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTectonicPlates(!showTectonicPlates)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                showTectonicPlates ? 'bg-sky-100 text-sky-900 border border-sky-300 font-bold shadow-2xs' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle Tectonic Fault Boundary Lines"
            >
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Fault Lines</span>
            </button>

            <button
              type="button"
              onClick={() => setShowVolcanoes(!showVolcanoes)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                showVolcanoes ? 'bg-pink-100 text-pink-900 border border-pink-300 font-bold shadow-2xs' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle Pacific Ring of Fire Volcanoes"
            >
              <Mountain className="w-3.5 h-3.5 text-pink-600" />
              <span>Volcanoes</span>
            </button>
          </div>

          {/* Quick Preset Jumps & Zoom Buttons */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200/90 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={handleJumpToIndia}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Center on Indian Subcontinent & Himalayan Collision Zone"
            >
              🇮🇳 India Focus
            </button>
            <button
              type="button"
              onClick={handleJumpToGlobal}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="View entire planet"
            >
              🌏 Global View
            </button>
            <div className="w-px h-4 bg-slate-300 mx-0.5" />
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-800 rounded-lg font-mono font-bold text-sm cursor-pointer border border-slate-200"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-800 rounded-lg font-mono font-bold text-sm cursor-pointer border border-slate-200"
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute top-16 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2 text-xs text-slate-700 font-medium">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>Syncing telemetry stream...</span>
          </div>
        )}

        {/* Bottom Floating Legend & Double-Click Zoom Out Hint */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
            <span className="text-slate-500 font-normal">Richter:</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> &lt;3.0
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> 3.0–4.5
            </span>
            <span className="flex items-center gap-1 text-orange-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" /> 4.5–6.0
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" /> 6.0–7.5
            </span>
            <span className="flex items-center gap-1 text-purple-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" /> 7.5+
            </span>
          </div>

          <div className="hidden sm:inline-block w-px h-3 bg-slate-300" />

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white inline-block shadow-2xs" />
            <span>Past Indian Epicenters ({THOROUGH_INDIAN_EARTHQUAKES.length})</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDEBAR: SEARCH, FILTERS & SEISMIC LEDGER */}
      {/* ========================================================================= */}
      <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col h-72 md:h-full overflow-hidden shrink-0 z-20 shadow-md">
        {/* Top Header & Feed Selector */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Seismic Catalog
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {filteredQuakes.length} quakes
            </span>
          </div>

          {/* Feed Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 font-bold font-mono">Feed:</span>
            <select
              value={activeFeed}
              onChange={(e) => onChangeFeed(e.target.value)}
              className="w-full bg-transparent text-slate-800 font-semibold outline-none cursor-pointer text-xs"
            >
              <option value="all_time">★ All-Time Global &amp; Indian Catalog</option>
              <option value="ncs_live">🇮🇳 NCS Official Bulletin (Latest 150+ Events)</option>
              <option value="india_catalog">🇮🇳 National Indian Network (NCS Live + Historical)</option>
              <option value="month_25">Past 30 Days (M2.5+ Global)</option>
              <option value="month_45">Past 30 Days (M4.5+ Heavy)</option>
              <option value="week_25">Past 7 Days (M2.5+)</option>
              <option value="day_all">Past 24 Hours (All Quakes)</option>
            </select>
          </div>
        </div>

        {/* Search & Sliders */}
        <div className="p-3.5 border-b border-slate-200 space-y-3 bg-white">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search city, region, or fault..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Matching Indian Cities (When user searches for a city) */}
          {matchingIndianCities.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-2 space-y-1.5 shadow-2xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between">
                <span>📍 Indian Cities ({matchingIndianCities.length}):</span>
                <span className="text-[9px] text-amber-700">Click to Fly &amp; Show 5 Details</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1">
                {matchingIndianCities.map(([key, city]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleFocusCity(key, city)}
                    className="w-full text-left bg-white hover:bg-amber-100/70 border border-amber-200 rounded p-1.5 transition-colors flex items-center justify-between text-xs cursor-pointer shadow-2xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-bold text-slate-900 truncate">{city.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{city.state}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        city.seismicZone.includes('Zone V')
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : city.seismicZone.includes('Zone IV')
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {city.seismicZone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Indian Cities Bar (When search is empty) */}
          {!filters.searchQuery && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center justify-between">
                <span>⚡ Quick City 5-Details:</span>
                <span className="text-[9px] text-slate-400">Click to locate on map</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {[
                  { key: 'delhi', label: 'Delhi-NCR' },
                  { key: 'mumbai', label: 'Mumbai' },
                  { key: 'bhuj', label: 'Bhuj' },
                  { key: 'guwahati', label: 'Guwahati' },
                  { key: 'srinagar', label: 'Srinagar' },
                  { key: 'patna', label: 'Patna' },
                  { key: 'kolkata', label: 'Kolkata' },
                  { key: 'ahmedabad', label: 'Ahmedabad' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      const c = INDIAN_CITY_DATABASE[item.key];
                      if (c) handleFocusCity(item.key, c);
                    }}
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:border-amber-300 border border-slate-200 rounded font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Min Magnitude Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1">
              <span>Minimum Magnitude:</span>
              <span className="text-amber-700 font-bold tabular-nums">M {filters.minMagnitude.toFixed(1)}+</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.5"
              step="0.1"
              value={filters.minMagnitude}
              onChange={(e) => setFilters((prev) => ({ ...prev, minMagnitude: parseFloat(e.target.value) }))}
              className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Max Depth Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1">
              <span>Max Hypocenter Depth:</span>
              <span className="text-sky-700 font-bold tabular-nums">{filters.maxDepth} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="700"
              step="10"
              value={filters.maxDepth}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxDepth: parseInt(e.target.value, 10) }))}
              className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Tsunami Filter Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={filters.tsunamiOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, tsunamiOnly: e.target.checked }))}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 bg-white cursor-pointer"
            />
            <span className="text-rose-700 font-semibold">Tsunami Threat Alerts Only</span>
          </label>
        </div>

        {/* Selected Quake Details Box (When an earthquake is clicked) */}
        {selectedQuake && (
          <div className="p-3 bg-amber-50/90 border-b border-amber-300 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-800">
                Selected Event
              </span>
              <button
                type="button"
                onClick={() => onSelectQuake(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="font-bold text-slate-900 leading-snug">{selectedQuake.place}</div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-bold text-amber-700">M {selectedQuake.magnitude.toFixed(1)}</span>
              <span>·</span>
              <span className="text-sky-700">{selectedQuake.depth.toFixed(1)} km depth</span>
              <span>·</span>
              <span className="text-slate-500">{(selectedQuake.energyJoules / 1e12).toFixed(1)} TJ</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">{selectedQuake.formattedTime}</div>
          </div>
        )}

        {/* Scrollable Earthquake List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Loading earthquakes...</span>
            </div>
          ) : filteredQuakes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No earthquakes match these filter criteria.
            </div>
          ) : (
            filteredQuakes.slice(0, 100).map((eq) => {
              const isSelected = selectedQuake?.id === eq.id;
              const isIndian = /india|assam|delhi|gujarat|bhuj|kutch|kashmir|chamoli|himalaya|uttarakhand|maharashtra|latur|koyna/i.test(eq.place);

              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => onSelectQuake(eq)}
                  className={`w-full text-left p-2.5 transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/70 border-l-4 border-amber-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                      {isIndian && (
                        <span className="text-[10px] font-mono px-1 rounded bg-orange-100 text-orange-800 border border-orange-300 shrink-0">
                          IN
                        </span>
                      )}
                      <span className="truncate">{eq.place}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                      <span>{eq.formattedTime.substring(0, 16)}</span>
                      <span>·</span>
                      <span className="text-sky-700 font-semibold">{eq.depth.toFixed(1)} km</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-bold shadow-2xs ${
                        eq.magnitude >= 7.5
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : eq.magnitude >= 6.0
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : eq.magnitude >= 4.5
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      M {eq.magnitude.toFixed(1)}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
