import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import {
  X,
  Sparkles,
  MapPin,
  TrendingUp,
  Building,
  CheckCircle2,
  Share2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Zap,
  HeartPulse,
  Compass,
  AlertTriangle,
  Car,
  Bus,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const ExplainabilityPanel: React.FC = () => {
  const {
    selectedCandidate,
    setSelectedCandidate,
    selectedSector,
    setSelectedSector,
    candidateSites,
    sectors,
    setComparisonSiteA,
    setComparisonSiteB,
    comparisonSiteA,
    flyToLocation,
  } = useCity();

  // Active view tab: 'candidate' | 'sector'
  const [activeTab, setActiveTab] = useState<'candidate' | 'sector'>('candidate');

  // Automatically switch tab when selection changes
  useEffect(() => {
    if (selectedSector && !selectedCandidate) {
      setActiveTab('sector');
    } else if (selectedCandidate && !selectedSector) {
      setActiveTab('candidate');
    }
  }, [selectedCandidate, selectedSector]);

  if (!selectedCandidate && !selectedSector) return null;

  // Radar & Bar data for Candidate Site
  const radarData = selectedCandidate
    ? [
        { factor: 'Pop Demand', value: Math.round(selectedCandidate.population_demand_score * 100) },
        { factor: 'Health Gap', value: Math.round(selectedCandidate.healthcare_gap_score * 100) },
        { factor: 'Road Access', value: Math.round(selectedCandidate.road_connectivity_score * 100) },
        { factor: 'Transit Link', value: Math.round(selectedCandidate.transit_access_score * 100) },
        { factor: 'Land Avail', value: Math.round(selectedCandidate.land_availability_score * 100) },
      ]
    : [];

  const barData = selectedCandidate
    ? [
        { factor: 'Population Demand', score: Math.round(selectedCandidate.population_demand_score * 100) },
        { factor: 'Coverage Gap', score: Math.round(selectedCandidate.healthcare_gap_score * 100) },
        { factor: 'Road Connectivity', score: Math.round(selectedCandidate.road_connectivity_score * 100) },
        { factor: 'Transit Access', score: Math.round(selectedCandidate.transit_access_score * 100) },
        { factor: 'Land Availability', score: Math.round(selectedCandidate.land_availability_score * 100) },
      ]
    : [];

  const handleSetComparison = () => {
    if (!selectedCandidate) return;
    if (!comparisonSiteA || comparisonSiteA.id === selectedCandidate.id) {
      setComparisonSiteA(selectedCandidate);
    } else {
      setComparisonSiteB(selectedCandidate);
    }
  };

  const handleClose = () => {
    if (activeTab === 'sector') {
      setSelectedSector(null);
      if (selectedCandidate) setActiveTab('candidate');
    } else {
      setSelectedCandidate(null);
      if (selectedSector) setActiveTab('sector');
    }
  };

  // Find nearest candidate site to selected sector
  const nearestCandidate = selectedSector
    ? candidateSites.reduce((prev, curr) => {
        const dPrev = Math.hypot(
          prev.coordinates[0] - selectedSector.center[0],
          prev.coordinates[1] - selectedSector.center[1]
        );
        const dCurr = Math.hypot(
          curr.coordinates[0] - selectedSector.center[0],
          curr.coordinates[1] - selectedSector.center[1]
        );
        return dCurr < dPrev ? curr : prev;
      }, candidateSites[0])
    : null;

  return (
    <div className="w-full lg:w-96 h-full glass-card border-l border-apple-border-light dark:border-apple-border-dark p-5 flex flex-col justify-between overflow-y-auto shadow-apple-elevated z-20 font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-all">
      <div className="space-y-4">
        {/* Top Header & Tab Switcher */}
        <div className="flex items-center justify-between gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-apple-sm border border-apple-border-light dark:border-apple-border-dark text-xs font-semibold">
            {selectedCandidate && (
              <button
                onClick={() => setActiveTab('candidate')}
                className={`px-3 py-1 rounded-apple-sm transition-all ${
                  activeTab === 'candidate'
                    ? 'bg-white dark:bg-[#161617] text-apple-accent shadow-apple-card font-bold'
                    : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark'
                }`}
              >
                Candidate Site
              </button>
            )}
            {selectedSector && (
              <button
                onClick={() => setActiveTab('sector')}
                className={`px-3 py-1 rounded-apple-sm transition-all ${
                  activeTab === 'sector'
                    ? 'bg-white dark:bg-[#161617] text-apple-accent shadow-apple-card font-bold'
                    : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark'
                }`}
              >
                Sector Inspector
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-tertiary hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* -------------------------------------------------------------
            TAB 1: CANDIDATE SITE EXPLAINABILITY VIEW
        ------------------------------------------------------------- */}
        {activeTab === 'candidate' && selectedCandidate && (
          <div className="space-y-4">
            {/* Title & Rank Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedCandidate.rank === 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-apple-accent text-white'
                  }`}
                >
                  RANK #{selectedCandidate.rank}
                </span>
                <span className="text-xs font-semibold text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                  {selectedCandidate.sector}
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark leading-snug">
                {selectedCandidate.name}
              </h2>
              <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-1 leading-relaxed">
                {selectedCandidate.description}
              </p>
            </div>

            {/* Big Score Callout */}
            <div className="p-4 rounded-apple-xl bg-gradient-to-br from-apple-accent/10 to-emerald-500/10 border border-apple-accent/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                  Composite Suitability Score
                </div>
                <div className="text-3xl font-black text-apple-text-primary-light dark:text-apple-text-primary-dark tracking-tight flex items-baseline gap-1 mt-0.5 font-mono">
                  <span>{selectedCandidate.suitability_score}</span>
                  <span className="text-sm font-semibold text-apple-text-secondary-light dark:text-apple-text-secondary-dark">/ 100</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Recommended for Phase 1 Construction</span>
                </div>
              </div>
              <button
                onClick={() =>
                  flyToLocation(
                    selectedCandidate.coordinates[0],
                    selectedCandidate.coordinates[1],
                    15.2,
                    58
                  )
                }
                title="Fly to Site"
                className="p-3 rounded-apple-md bg-white dark:bg-[#161617] border border-apple-border-light dark:border-apple-border-dark text-apple-accent hover:opacity-80 transition-all shadow-apple-card"
              >
                <Navigation className="w-5 h-5" />
              </button>
            </div>

            {/* Factor Breakdown Radar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                <span>MULTI-FACTOR RADAR EVALUATION</span>
                <span className="text-[10px] text-apple-accent font-medium">5 Dimensions</span>
              </div>
              <div className="h-44 w-full -my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(120, 120, 128, 0.2)" />
                    <PolarAngleAxis
                      dataKey="factor"
                      tick={{ fill: '#86868b', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} stroke="rgba(120, 120, 128, 0.2)" tick={false} />
                    <Radar
                      name="Suitability"
                      dataKey="value"
                      stroke="#0071e3"
                      fill="#0071e3"
                      fillOpacity={0.35}
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Factor Bars */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">FACTOR-BY-FACTOR PERFORMANCE</div>
              <div className="space-y-1.5 text-xs">
                {barData.map((item) => (
                  <div key={item.factor} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-medium text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      <span>{item.factor}</span>
                      <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{item.score} / 100</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor:
                            item.score > 90 ? '#30d158' : item.score > 80 ? '#0071e3' : '#ff9f0a',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="p-3.5 rounded-apple-xl bg-black/[0.03] dark:bg-white/[0.04] border border-apple-border-light dark:border-apple-border-dark space-y-1.5 text-xs">
              <div className="text-[10px] font-bold text-apple-text-tertiary uppercase tracking-wider">
                Site Infrastructure Specifications
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Vacant Land:</span>{' '}
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark">{selectedCandidate.vacant_land_acres} Acres</strong>
                </div>
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Est. Cost:</span>{' '}
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">₹{selectedCandidate.estimated_cost_cr} Cr</strong>
                </div>
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Nearest Hosp:</span>{' '}
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark">{selectedCandidate.distance_to_nearest_hospital_km} km</strong>
                </div>
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Target Pop (2km):</span>{' '}
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{selectedCandidate.population_within_2km.toLocaleString()}</strong>
                </div>
              </div>
              <div className="pt-1 text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark">Road Access:</strong> {selectedCandidate.road_access}
              </div>
            </div>

            {/* Rationale */}
            <div className="p-3.5 rounded-apple-xl bg-apple-accent/10 border border-apple-accent/20 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-apple-accent text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-apple-accent" />
                <span>EXPLAINABLE AI RATIONALE</span>
              </div>
              <p className="text-[11px] text-apple-text-primary-light dark:text-apple-text-primary-dark leading-relaxed">
                {selectedCandidate.rationale}
              </p>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: SECTOR INSPECTOR DEEP DIVE VIEW
        ------------------------------------------------------------- */}
        {activeTab === 'sector' && selectedSector && (
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-apple-accent text-white">
                  {selectedSector.zone} ZONE
                </span>
                <span className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark font-semibold">
                  Le Corbusier Grid Block
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark leading-snug">
                {selectedSector.sector_name}
              </h2>
              <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-0.5">
                {selectedSector.land_use}
              </p>
            </div>

            {/* Quick Focus Button */}
            <div className="p-3.5 rounded-apple-xl bg-black/[0.03] dark:bg-white/[0.04] border border-apple-border-light dark:border-apple-border-dark flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-apple-text-tertiary uppercase tracking-wider">
                  3D Coordinates
                </div>
                <div className="font-mono text-xs font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                  {selectedSector.center[0].toFixed(4)}° E, {selectedSector.center[1].toFixed(4)}° N
                </div>
              </div>
              <button
                onClick={() =>
                  flyToLocation(selectedSector.center[0], selectedSector.center[1], 15.0, 52)
                }
                className="px-3 py-1.5 rounded-apple-md bg-apple-accent hover:bg-apple-accent-hover text-white text-xs font-semibold shadow-apple-card flex items-center gap-1.5 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Focus Sector</span>
              </button>
            </div>

            {/* Demographics Card */}
            <div className="p-3.5 rounded-apple-xl bg-black/[0.03] dark:bg-white/[0.04] border border-apple-border-light dark:border-apple-border-dark space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                <span>DEMOGRAPHIC TELEMETRY</span>
                <span className="text-[10px] font-normal text-apple-text-tertiary">Census & Spatial GIS</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Population:</span>
                  <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">
                    {selectedSector.population.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Density:</span>
                  <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">
                    {selectedSector.density_per_sqkm.toLocaleString()}/km²
                  </div>
                </div>
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Sector Area:</span>
                  <div className="font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    {selectedSector.area_sqkm} km²
                  </div>
                </div>
                <div>
                  <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Density Rating:</span>
                  <div
                    className={`font-semibold ${
                      selectedSector.density_per_sqkm > 35000
                        ? 'text-rose-500'
                        : selectedSector.density_per_sqkm > 20000
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {selectedSector.density_per_sqkm > 35000
                      ? 'Very High Density'
                      : selectedSector.density_per_sqkm > 20000
                      ? 'Medium Density'
                      : 'Low / Residential'}
                  </div>
                </div>
              </div>
            </div>

            {/* Healthcare Access & Critical Gap */}
            <div className="p-3.5 rounded-apple-xl bg-apple-accent/10 border border-apple-accent/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-apple-accent">
                  <HeartPulse className="w-3.5 h-3.5 text-apple-accent" />
                  <span>HEALTHCARE ACCESS GAP</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedSector.distance_to_nearest_hospital_km > 3.0
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      : selectedSector.distance_to_nearest_hospital_km > 1.8
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}
                >
                  {selectedSector.distance_to_nearest_hospital_km > 3.0
                    ? 'Critical Gap'
                    : selectedSector.distance_to_nearest_hospital_km > 1.8
                    ? 'Moderate Access'
                    : 'Optimal Access'}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                  <span>Nearest Tertiary Hospital:</span>
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark text-right truncate max-w-[160px]" title={selectedSector.nearest_hospital}>
                    {selectedSector.nearest_hospital}
                  </strong>
                </div>
                <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                  <span>Distance:</span>
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{selectedSector.distance_to_nearest_hospital_km} km</strong>
                </div>
                <div className="flex justify-between text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                  <span>Est. Emergency Ambulance:</span>
                  <strong className="text-apple-accent font-mono">
                    ~{(selectedSector.distance_to_nearest_hospital_km * 2.4).toFixed(1)} mins
                  </strong>
                </div>
              </div>

              {selectedSector.existing_hospitals_count > 0 ? (
                <div className="mt-2 pt-2 border-t border-apple-accent/20 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  🏥 {selectedSector.existing_hospitals_count} Major Healthcare Facility located within this sector ({selectedSector.existing_hospitals.join(', ')}).
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-apple-accent/20 text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                  ⚠️ No major tertiary government hospital located directly within this sector.
                </div>
              )}
            </div>

            {/* Infrastructure & Connectivity */}
            <div className="p-3.5 rounded-apple-xl bg-black/[0.03] dark:bg-white/[0.04] border border-apple-border-light dark:border-apple-border-dark space-y-2 text-xs">
              <div className="font-bold text-apple-text-tertiary text-[11px] uppercase tracking-wider">
                Corridor Accessibility
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark mb-0.5">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3 text-apple-text-tertiary" /> Road Connectivity Score
                    </span>
                    <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(selectedSector.road_connectivity_score * 100)}%</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-apple-accent rounded-full"
                      style={{ width: `${selectedSector.road_connectivity_score * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark mb-0.5">
                    <span className="flex items-center gap-1">
                      <Bus className="w-3 h-3 text-apple-text-tertiary" /> Public Transit Access
                    </span>
                    <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(selectedSector.public_transit_score * 100)}%</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${selectedSector.public_transit_score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nearest Recommended AI Candidate Site */}
            {nearestCandidate && (
              <div className="p-3.5 rounded-apple-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>NEAREST AI CANDIDATE SITE</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">{nearestCandidate.name}</div>
                    <div className="text-[10px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{nearestCandidate.sector} • Score: {nearestCandidate.suitability_score}/100</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCandidate(nearestCandidate);
                      setActiveTab('candidate');
                      flyToLocation(nearestCandidate.coordinates[0], nearestCandidate.coordinates[1], 15.2, 58);
                    }}
                    className="px-2.5 py-1 rounded-apple-sm bg-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-600 transition-colors shadow-apple-card"
                  >
                    View Site
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      {activeTab === 'candidate' && selectedCandidate && (
        <div className="pt-4 border-t border-apple-border-light dark:border-apple-border-dark space-y-2">
          <button
            onClick={handleSetComparison}
            className="w-full py-2.5 px-4 rounded-apple-md bg-apple-accent hover:bg-apple-accent-hover text-white font-semibold text-xs shadow-apple-card flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>Pin to Scenario Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
