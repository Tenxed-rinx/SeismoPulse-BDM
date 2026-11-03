/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SeismicMap } from './components/SeismicMap';
import { PowerBIDashboard } from './components/PowerBIDashboard';
import { MongoStudio } from './components/MongoStudio';
import { SafetyAndQuiz } from './components/SafetyAndQuiz';
import { EmergencyModal } from './components/EmergencyModal';
import { Earthquake, FilterState } from './types/seismic';
import { fetchLiveEarthquakes, ALL_TIME_SEED } from './services/usgsService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'powerbi' | 'mongo' | 'safety'>('map');
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(ALL_TIME_SEED);
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFeed, setActiveFeed] = useState<string>('all_time');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    minMagnitude: 1.0,
    maxMagnitude: 10.0,
    maxDepth: 700,
    timeRange: 'month',
    searchQuery: '',
    region: 'all',
    tsunamiOnly: false
  });

  // Fetch live earthquakes on mount or feed change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchLiveEarthquakes(activeFeed).then((result) => {
      if (!isMounted) return;
      setEarthquakes(result.earthquakes);
      setDataSource(result.source);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeFeed]);

  const handleSelectFromBI = (quake: Earthquake) => {
    setSelectedQuake(quake);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1-Row Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        dataSource={dataSource}
        quakeCount={earthquakes.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full relative overflow-hidden">
        {/* SeismicMap is kept alive in DOM to maintain map state and WebGL tiles without reloads */}
        <div className={activeTab === 'map' ? 'w-full h-full relative' : 'hidden'}>
          <SeismicMap
            earthquakes={earthquakes}
            selectedQuake={selectedQuake}
            onSelectQuake={setSelectedQuake}
            filters={filters}
            setFilters={setFilters}
            isLoading={isLoading}
            isActive={activeTab === 'map'}
          />
        </div>

        {activeTab === 'powerbi' && (
          <PowerBIDashboard
            earthquakes={earthquakes}
            onSelectQuake={handleSelectFromBI}
          />
        )}

        {activeTab === 'mongo' && (
          <MongoStudio earthquakes={earthquakes} />
        )}

        {activeTab === 'safety' && (
          <SafetyAndQuiz />
        )}
      </main>

      {/* Quick Emergency Helpline Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}

