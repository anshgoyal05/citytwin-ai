import React, { useState } from 'react';
import { useCity } from '../context/CityContext';
import { Chandigarh3DMap } from '../components/map/Chandigarh3DMap';
import { ExplainabilityPanel } from '../components/ExplainabilityPanel';
import {
  Layers,
  Sliders,
  Sparkles,
  Building,
  HeartPulse,
  Navigation,
  Compass,
  Search,
  Filter,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Car,
  Bus,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import type { SectorData, CandidateSite } from '../types';

export const Dashboard: React.FC = () => {
  const {
    sectors,
    candidateSites,
    hospitals,
    layers,
    toggleLayer,
    weights,
    updateWeight,
    resetWeights,
    selectedSector,
    setSelectedSector,
    selectedCandidate,
    setSelectedCandidate,
    flyToLocation,
    summaryMetrics,
    isRecalculating,
    activeFilterZone,
    setActiveFilterZone,
  } = useCity();

  const [searchQuery, setSearchQuery] = useState('');
  const [fullscreen3D, setFullscreen3D] = useState(false);
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Filter sectors based on search query and active zone
  const filteredSectors = sectors.filter((sec) => {
    const matchesSearch = sec.sector_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = activeFilterZone === 'All' || sec.zone.includes(activeFilterZone);
    return matchesSearch && matchesZone;
  });

  const zones = ['All', 'North', 'Central', 'South', 'West', 'East', 'Periphery'];

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full bg-[#f5f5f7] text-[#1d1d1f] flex flex-col lg:flex-row overflow-hidden relative font-sans">
      {/* LEFT PANEL: Planning Telemetry & Layer Controls */}
      {!fullscreen3D && (
        <aside className="w-full lg:w-80 h-auto lg:h-full bg-white/85 backdrop-blur-2xl border-r border-black/10 p-4 flex flex-col justify-between z-20 space-y-4 overflow-y-auto shadow-apple-md">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-extrabold uppercase tracking-wider mb-0.5">
                <Layers className="w-3.5 h-3.5" />
                <span>CHANDIGARH DIGITAL TWIN</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Hospital Spatial Planner
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Multi-criteria decision support for healthcare infrastructure
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-black/5 border border-black/5 text-[11px]">
              <div>
                <span className="text-slate-500">Total Population:</span>
                <div className="font-extrabold text-slate-900 text-sm">
                  {summaryMetrics.totalPopulation.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Major Hospitals:</span>
                <div className="font-extrabold text-slate-900 text-sm">
                  {summaryMetrics.totalHospitals} ({summaryMetrics.totalBeds.toLocaleString()} Beds)
                </div>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>3D TELEMETRY LAYERS</span>
                <span className="text-[10px] text-blue-600 font-semibold">WebGL 60FPS</span>
              </div>
              <div className="space-y-1">
                {[
                  { key: 'sectors', label: 'Sector Grid & Choropleth', icon: Building, color: 'text-slate-700' },
                  { key: 'extrudedDensity', label: '3D Population Density Columns', icon: Flame, color: 'text-amber-600' },
                  { key: 'existingHospitals', label: 'Existing Hospitals (Ground Truth)', icon: HeartPulse, color: 'text-red-600' },
                  { key: 'candidateSites', label: 'AI Ranked Candidate Sites', icon: Sparkles, color: 'text-emerald-600' },
                  { key: 'isochrones', label: '5/10/15-min Catchment Isochrones', icon: Compass, color: 'text-purple-600' },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = layers[item.key as keyof typeof layers];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleLayer(item.key as keyof typeof layers)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all ${
                        active
                          ? 'bg-blue-600 text-white border-blue-500 shadow-apple-sm'
                          : 'bg-black/5 border-black/5 text-slate-700 hover:text-slate-900 hover:bg-black/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : item.color}`} />
                        <span className="text-[11px]">{item.label}</span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          active ? 'bg-white border-white' : 'border-slate-400'
                        }`}
                      >
                        {active && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suitability Weight Configuration Collapsible */}
            <div className="p-3 rounded-2xl bg-black/5 border border-black/5 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowWeightSliders(!showWeightSliders)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-blue-600"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>SUITABILITY WEIGHT ENGINE</span>
                </button>
                <button
                  onClick={resetWeights}
                  title="Reset to Baseline Weights"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 text-[10px]"
                >
                  <RefreshCw className={`w-3 h-3 ${isRecalculating ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {showWeightSliders ? (
                <div className="space-y-2 pt-1 text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Population Demand:</span>
                      <strong>{Math.round(weights.populationDemand * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.6"
                      step="0.05"
                      value={weights.populationDemand}
                      onChange={(e) => updateWeight('populationDemand', parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Coverage Gap (Distance):</span>
                      <strong>{Math.round(weights.healthcareGap * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.6"
                      step="0.05"
                      value={weights.healthcareGap}
                      onChange={(e) => updateWeight('healthcareGap', parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Road Connectivity:</span>
                      <strong>{Math.round(weights.roadConnectivity * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={weights.roadConnectivity}
                      onChange={(e) => updateWeight('roadConnectivity', parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Public Transit Access:</span>
                      <strong>{Math.round(weights.transitAccess * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={weights.transitAccess}
                      onChange={(e) => updateWeight('transitAccess', parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Vacant Land Availability:</span>
                      <strong>{Math.round(weights.landAvailability * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={weights.landAvailability}
                      onChange={(e) => updateWeight('landAvailability', parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Pop: 30% | Gap: 25% | Road: 15% | Land: 15%</span>
                  <span className="text-blue-600 cursor-pointer" onClick={() => setShowWeightSliders(true)}>
                    Edit
                  </span>
                </div>
              )}
            </div>

            {/* Candidate Sites Quick List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>AI RANKED SITES</span>
                <span className="text-[10px] text-emerald-600 font-bold">TOP 6 PICKS</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {candidateSites.map((cand) => {
                  const isSelected = selectedCandidate && selectedCandidate.id === cand.id;
                  return (
                    <button
                      key={cand.id}
                      onClick={() => {
                        setSelectedCandidate(cand);
                        flyToLocation(cand.coordinates[0], cand.coordinates[1], 14.8, 55);
                      }}
                      className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-apple-sm'
                          : 'bg-black/5 border-black/5 text-slate-700 hover:bg-black/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            cand.rank === 1
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          #{cand.rank}
                        </span>
                        <div className="truncate">
                          <div className="font-semibold truncate text-[11px]">{cand.name}</div>
                          <div className="text-[10px] text-slate-500">{cand.sector}</div>
                        </div>
                      </div>
                      <div className="font-black text-xs text-slate-900 shrink-0 ml-1">
                        {cand.suitability_score}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sector Quick Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>SECTOR INSPECTOR ({filteredSectors.length})</span>
                <select
                  value={activeFilterZone}
                  onChange={(e) => setActiveFilterZone(e.target.value)}
                  className="text-[10px] font-semibold bg-black/5 border border-black/10 rounded-lg px-2 py-0.5"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sector (e.g. 52, 12, Manimajra)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-black/5 border border-black/10 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {selectedSector && (
                <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-500/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-blue-900 text-sm">{selectedSector.sector_name}</strong>
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                      {selectedSector.zone}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                    <div>Pop: {selectedSector.population.toLocaleString()}</div>
                    <div>Density: {selectedSector.density_per_sqkm.toLocaleString()}/km²</div>
                    <div>Nearest: {selectedSector.nearest_hospital}</div>
                    <div>Dist: {selectedSector.distance_to_nearest_hospital_km} km</div>
                  </div>
                  <button
                    onClick={() => flyToLocation(selectedSector.center[0], selectedSector.center[1], 14.5)}
                    className="w-full mt-1 py-1 rounded-lg bg-blue-600 text-white font-semibold text-[11px] flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Focus Sector</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Camera Fly Presets */}
          <div className="pt-2 border-t border-black/10">
            <div className="text-[10px] font-bold text-slate-500 mb-1.5">STRATEGIC FLY PRESETS</div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => flyToLocation(76.7794, 30.7333, 12.4, 52)}
                className="p-1.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 text-slate-800 font-semibold text-center"
              >
                Chandigarh Grid
              </button>
              <button
                onClick={() => flyToLocation(76.7215, 30.7095, 15.0, 58)}
                className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-center"
              >
                Top Pick (Sec 52)
              </button>
              <button
                onClick={() => flyToLocation(76.7765, 30.7645, 14.8, 60)}
                className="p-1.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 text-slate-800 font-semibold text-center"
              >
                PGIMER (Sec 12)
              </button>
              <button
                onClick={() => flyToLocation(76.7725, 30.7085, 14.8, 60)}
                className="p-1.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 text-slate-800 font-semibold text-center"
              >
                GMCH (Sec 32)
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* CENTER VIEWPORT: 3D Chandigarh Digital Twin Map */}
      <main className="flex-1 h-full relative">
        <Chandigarh3DMap />

        {/* Floating Top Telemetry Pill */}
        <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 glass-panel px-4 py-2 rounded-full shadow-apple-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900">CHANDIGARH DIGITAL TWIN</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-600">
            64 Sectors Mapped • {candidateSites.length} Candidate Sites Scored
          </span>
        </div>

        {/* Floating Fullscreen / Reset View Controls */}
        <div className="absolute top-4 right-20 z-20 flex items-center gap-2">
          <button
            onClick={() => setFullscreen3D(!fullscreen3D)}
            className="p-2.5 rounded-full bg-white/90 border border-black/10 text-slate-700 hover:text-slate-900 hover:bg-white transition-all shadow-apple-md backdrop-blur-xl"
            title={fullscreen3D ? 'Exit Fullscreen 3D' : 'Fullscreen 3D'}
          >
            {fullscreen3D ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </main>

      {/* RIGHT PANEL: Explainability & Site Inspection Drawer */}
      {selectedCandidate && <ExplainabilityPanel />}
    </div>
  );
};
