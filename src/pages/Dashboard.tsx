import React, { useState, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Eye,
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
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const zones = ['All', 'North', 'Central', 'South', 'West', 'East', 'Periphery'];

  // Smart Sector Matcher: Handles "Sec 4", "sec 4", "4", "Sector 4", "pgi", etc.
  const filteredSectors = useMemo(() => {
    return sectors.filter((sec) => {
      const matchesZone =
        activeFilterZone === 'All' ||
        sec.zone.toLowerCase() === activeFilterZone.toLowerCase();
      if (!matchesZone) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      const name = sec.sector_name.toLowerCase();

      // Direct name match
      if (name.includes(q)) return true;

      // Normalize "sec 4", "sec. 4", "s4", "s-4" -> "sector 4"
      const normalizedQ = q
        .replace(/\bsec\b|\bsec\.\b|\bs-\b/g, 'sector')
        .replace(/\s+/g, ' ')
        .trim();
      if (name.includes(normalizedQ)) return true;

      // Extract number: if user types "4" or "sec 4"
      const numberMatches = q.match(/\d+/g);
      if (numberMatches) {
        const secNumber = name.replace(/[^0-9]/g, '');
        if (numberMatches.includes(secNumber)) return true;
      }

      // Match landmarks, zone, hospital, land use
      if (sec.zone.toLowerCase().includes(q)) return true;
      if (sec.nearest_hospital.toLowerCase().includes(q)) return true;
      if (sec.land_use.toLowerCase().includes(q)) return true;

      return false;
    });
  }, [sectors, searchQuery, activeFilterZone]);

  const handleSelectSector = (sec: SectorData) => {
    setSelectedSector(sec);
    setIsRightCollapsed(false);
    flyToLocation(sec.center[0], sec.center[1], 14.8, 55);
  };

  const handleSelectCandidate = (cand: CandidateSite) => {
    setSelectedCandidate(cand);
    setIsRightCollapsed(false);
    flyToLocation(cand.coordinates[0], cand.coordinates[1], 15.2, 58);
  };

  const hasRightPanelContent = Boolean(selectedCandidate || selectedSector);

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full bg-apple-bg-light dark:bg-apple-bg-dark text-apple-text-primary-light dark:text-apple-text-primary-dark flex flex-col lg:flex-row overflow-hidden relative font-sans transition-colors duration-300">
      {/* -------------------------------------------------------------
          LEFT PANEL: Planning Telemetry, Weights & Sector Inspector
      ------------------------------------------------------------- */}
      {!fullscreen3D && !isLeftCollapsed && (
        <aside className="w-full lg:w-[350px] h-auto lg:h-full glass-card border-r border-apple-border-light dark:border-apple-border-dark p-4 flex flex-col justify-between z-20 space-y-4 overflow-y-auto shadow-apple-elevated shrink-0 transition-all duration-300">
          <div className="space-y-4">
            {/* Header with Minimize Button (<) */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Layers className="w-3 h-3" />
                  <span>CHANDIGARH DIGITAL TWIN</span>
                </div>
                <h1 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark tracking-tight">
                  Hospital Spatial Planner
                </h1>
                <p className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-0.5">
                  Multi-criteria spatial decision intelligence
                </p>
              </div>

              {/* Minimize Sidebar Button with < */}
              <button
                onClick={() => setIsLeftCollapsed(true)}
                className="p-1.5 rounded-apple-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark transition-all"
                title="Minimize Sidebar (<)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-apple-lg bg-black/[0.03] dark:bg-white/[0.04] border border-apple-border-light dark:border-apple-border-dark text-[11px]">
              <div>
                <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[10px]">Total Population</span>
                <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">
                  {summaryMetrics.totalPopulation.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[10px]">Major Facilities</span>
                <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm">
                  {summaryMetrics.totalHospitals} ({summaryMetrics.totalBeds.toLocaleString()} Beds)
                </div>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                <span>3D TELEMETRY LAYERS</span>
                <span className="text-[10px] text-apple-accent font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  WebGL 60FPS
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { key: 'sectors', label: 'Sector Grid & Choropleth', icon: Building, color: 'text-apple-text-primary-light dark:text-apple-text-primary-dark' },
                  { key: 'extrudedDensity', label: '3D Population Density Columns', icon: Flame, color: 'text-amber-500' },
                  { key: 'existingHospitals', label: 'Existing Hospitals (Ground Truth)', icon: HeartPulse, color: 'text-rose-500' },
                  { key: 'candidateSites', label: 'AI Ranked Candidate Sites', icon: Sparkles, color: 'text-emerald-500' },
                  { key: 'isochrones', label: '5/10/15-min Catchment Isochrones', icon: Compass, color: 'text-purple-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = layers[item.key as keyof typeof layers];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleLayer(item.key as keyof typeof layers)}
                      className={`w-full flex items-center justify-between p-2 rounded-apple-md border text-xs font-semibold transition-all ${
                        active
                          ? 'bg-apple-accent text-white border-apple-accent shadow-apple-card'
                          : 'bg-black/[0.02] dark:bg-white/[0.03] border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : item.color}`} />
                        <span className="text-[11px]">{item.label}</span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          active ? 'bg-white border-white' : 'border-apple-border-light dark:border-apple-border-dark'
                        }`}
                      >
                        {active && <div className="w-1.5 h-1.5 bg-apple-accent rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suitability Weight Configuration Collapsible */}
            <div className="p-3 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowWeightSliders(!showWeightSliders)}
                  className="flex items-center gap-1.5 text-xs font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark hover:text-apple-accent transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-apple-accent" />
                  <span>SUITABILITY WEIGHT ENGINE</span>
                </button>
                <button
                  onClick={resetWeights}
                  title="Reset to Baseline Weights"
                  className="p-1 rounded-apple-sm text-apple-text-tertiary hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark text-[10px] transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isRecalculating ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {showWeightSliders ? (
                <div className="space-y-2 pt-1 text-[11px]">
                  <div>
                    <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      <span>Population Demand:</span>
                      <strong className="font-mono text-apple-text-primary-light dark:text-apple-text-primary-dark">{Math.round(weights.populationDemand * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.6"
                      step="0.05"
                      value={weights.populationDemand}
                      onChange={(e) => updateWeight('populationDemand', parseFloat(e.target.value))}
                      className="w-full accent-apple-accent cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      <span>Coverage Gap (Distance):</span>
                      <strong className="font-mono text-apple-text-primary-light dark:text-apple-text-primary-dark">{Math.round(weights.healthcareGap * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.6"
                      step="0.05"
                      value={weights.healthcareGap}
                      onChange={(e) => updateWeight('healthcareGap', parseFloat(e.target.value))}
                      className="w-full accent-apple-accent cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      <span>Road Connectivity:</span>
                      <strong className="font-mono text-apple-text-primary-light dark:text-apple-text-primary-dark">{Math.round(weights.roadConnectivity * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={weights.roadConnectivity}
                      onChange={(e) => updateWeight('roadConnectivity', parseFloat(e.target.value))}
                      className="w-full accent-apple-accent cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      <span>Public Transit Access:</span>
                      <strong className="font-mono text-apple-text-primary-light dark:text-apple-text-primary-dark">{Math.round(weights.transitAccess * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={weights.transitAccess}
                      onChange={(e) => updateWeight('transitAccess', parseFloat(e.target.value))}
                      className="w-full accent-apple-accent cursor-pointer h-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      <span>Vacant Land Availability:</span>
                      <strong className="font-mono text-apple-text-primary-light dark:text-apple-text-primary-dark">{Math.round(weights.landAvailability * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={weights.landAvailability}
                      onChange={(e) => updateWeight('landAvailability', parseFloat(e.target.value))}
                      className="w-full accent-apple-accent cursor-pointer h-1.5"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark flex items-center justify-between">
                  <span>Pop: 30% | Gap: 25% | Road: 15% | Land: 15%</span>
                  <span className="text-apple-accent cursor-pointer font-semibold hover:underline" onClick={() => setShowWeightSliders(true)}>
                    Edit
                  </span>
                </div>
              )}
            </div>

            {/* Candidate Sites Quick List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                <span>AI RANKED SITES</span>
                <span className="text-[10px] text-emerald-500 font-bold">TOP 6 PICKS</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {candidateSites.map((cand) => {
                  const isSelected = selectedCandidate && selectedCandidate.id === cand.id;
                  return (
                    <button
                      key={cand.id}
                      onClick={() => handleSelectCandidate(cand)}
                      className={`w-full text-left p-2 rounded-apple-md border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-apple-accent/10 border-apple-accent text-apple-text-primary-light dark:text-apple-text-primary-dark shadow-apple-card font-semibold'
                          : 'bg-black/[0.02] dark:bg-white/[0.03] border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            cand.rank === 1
                              ? 'bg-emerald-500 text-white'
                              : 'bg-apple-accent text-white'
                          }`}
                        >
                          #{cand.rank}
                        </span>
                        <div className="truncate">
                          <div className="font-semibold truncate text-[11px]">{cand.name}</div>
                          <div className="text-[10px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{cand.sector}</div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-xs text-apple-text-primary-light dark:text-apple-text-primary-dark shrink-0 ml-1">
                        {cand.suitability_score}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTOR INSPECTOR (Working Search, Filter & Result List)
            ------------------------------------------------------------- */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                <span>SECTOR INSPECTOR ({filteredSectors.length})</span>
                <select
                  value={activeFilterZone}
                  onChange={(e) => setActiveFilterZone(e.target.value)}
                  className="text-[10px] font-semibold bg-black/[0.03] dark:bg-white/[0.06] border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark rounded-apple-sm px-2 py-0.5 outline-none"
                >
                  {zones.map((z) => (
                    <option key={z} value={z} className="bg-white dark:bg-[#161617] text-apple-text-primary-light dark:text-apple-text-primary-dark">
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-apple-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search sector (e.g. Sec 4, 52, PGIMER)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark placeholder:text-apple-text-tertiary rounded-apple-md text-xs font-sans focus:outline-none focus:ring-1 focus:ring-apple-accent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-apple-text-tertiary hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sector Search Result Cards / List */}
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {filteredSectors.length === 0 ? (
                  <div className="p-3 text-center text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark bg-black/[0.02] dark:bg-white/[0.03] rounded-apple-md">
                    No sectors match &ldquo;{searchQuery}&rdquo;. Try &ldquo;4&rdquo; or &ldquo;North&rdquo;.
                  </div>
                ) : (
                  filteredSectors.slice(0, 12).map((sec) => {
                    const isSelected = selectedSector && selectedSector.sector_name === sec.sector_name;
                    return (
                      <button
                        key={sec.sector_name}
                        onClick={() => handleSelectSector(sec)}
                        className={`w-full text-left p-2 rounded-apple-md border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-apple-accent/10 border-apple-accent text-apple-text-primary-light dark:text-apple-text-primary-dark shadow-apple-card font-semibold'
                            : 'bg-black/[0.02] dark:bg-white/[0.03] border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-bold text-[11px] flex items-center gap-1.5">
                            <span>{sec.sector_name}</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                              {sec.zone}
                            </span>
                          </div>
                          <div className="text-[10px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark truncate">
                            Pop: {sec.population.toLocaleString()} • {sec.distance_to_nearest_hospital_km} km to {sec.nearest_hospital.split(' ')[0]}
                          </div>
                        </div>
                        <div className="shrink-0 text-apple-accent hover:opacity-80 p-1">
                          <Navigation className="w-3 h-3" />
                        </div>
                      </button>
                    );
                  })
                )}
                {filteredSectors.length > 12 && (
                  <div className="text-[10px] text-center text-apple-text-tertiary pt-1">
                    Showing top 12 of {filteredSectors.length} matching sectors
                  </div>
                )}
              </div>

              {/* Selected Sector Quick Card */}
              {selectedSector && (
                <div className="p-2.5 rounded-apple-lg bg-apple-accent/10 border border-apple-accent/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-apple-accent font-bold text-xs">
                      {selectedSector.sector_name} Active
                    </strong>
                    <button
                      onClick={() => setSelectedSector(null)}
                      className="text-apple-text-tertiary hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                    <div>Pop: {selectedSector.population.toLocaleString()}</div>
                    <div>Density: {selectedSector.density_per_sqkm.toLocaleString()}/km²</div>
                    <div>Nearest: {selectedSector.nearest_hospital.slice(0, 16)}...</div>
                    <div>Distance: {selectedSector.distance_to_nearest_hospital_km} km</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsRightCollapsed(false);
                      flyToLocation(selectedSector.center[0], selectedSector.center[1], 15.0, 52);
                    }}
                    className="w-full py-1.5 rounded-apple-sm bg-apple-accent text-white font-semibold text-[11px] flex items-center justify-center gap-1 hover:bg-apple-accent-hover transition-colors shadow-apple-card"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Open Detailed Sector Inspector</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Camera Fly Presets */}
          <div className="pt-2 border-t border-apple-border-light dark:border-apple-border-dark">
            <div className="text-[10px] font-bold text-apple-text-tertiary uppercase tracking-wider mb-1.5">STRATEGIC FLY PRESETS</div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => flyToLocation(76.7794, 30.7333, 12.4, 52)}
                className="p-1.5 rounded-apple-md bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark font-medium text-center transition-colors"
              >
                Chandigarh Grid
              </button>
              <button
                onClick={() => flyToLocation(76.7325, 30.7185, 15.2, 58)}
                className="p-1.5 rounded-apple-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-center transition-colors"
              >
                Top Pick (Sec 52)
              </button>
              <button
                onClick={() => flyToLocation(76.7765, 30.7645, 15.0, 60)}
                className="p-1.5 rounded-apple-md bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark font-medium text-center transition-colors"
              >
                PGIMER (Sec 12)
              </button>
              <button
                onClick={() => flyToLocation(76.7925, 30.7085, 15.0, 60)}
                className="p-1.5 rounded-apple-md bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark font-medium text-center transition-colors"
              >
                GMCH (Sec 32)
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* -------------------------------------------------------------
          CENTER VIEWPORT: 3D Chandigarh Digital Twin Map
      ------------------------------------------------------------- */}
      <main className="flex-1 h-full relative">
        <Chandigarh3DMap />

        {/* Floating Button to Restore Left Planner Panel if Collapsed */}
        {isLeftCollapsed && !fullscreen3D && (
          <button
            onClick={() => setIsLeftCollapsed(false)}
            className="absolute top-4 left-4 z-30 glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark shadow-apple-card flex items-center gap-1.5 text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark hover:text-apple-accent hover:scale-105 transition-all"
            title="Expand Planning Sidebar (>)"
          >
            <ChevronRight className="w-4 h-4 text-apple-accent" />
            <span>Planner Controls</span>
          </button>
        )}

        {/* Floating Button to Restore Right Inspector if Collapsed */}
        {isRightCollapsed && hasRightPanelContent && !fullscreen3D && (
          <button
            onClick={() => setIsRightCollapsed(false)}
            className="absolute top-4 right-28 z-30 glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark shadow-apple-card flex items-center gap-1.5 text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark hover:text-apple-accent hover:scale-105 transition-all"
            title="Expand Inspector Panel (<)"
          >
            <ChevronLeft className="w-4 h-4 text-apple-accent" />
            <span>Open Inspector</span>
          </button>
        )}

        {/* Floating Fullscreen / Reset View Controls */}
        <div className="absolute top-4 right-16 z-20 flex items-center gap-2">
          <button
            onClick={() => setFullscreen3D(!fullscreen3D)}
            className="p-2 rounded-full glass-panel border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark hover:text-apple-accent hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-apple-card"
            title={fullscreen3D ? 'Exit Fullscreen 3D' : 'Fullscreen 3D'}
          >
            {fullscreen3D ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </main>

      {/* -------------------------------------------------------------
          RIGHT PANEL: Explainability & Site/Sector Inspection Drawer
      ------------------------------------------------------------- */}
      {!fullscreen3D && !isRightCollapsed && hasRightPanelContent && (
        <ExplainabilityPanel />
      )}
    </div>
  );
};
