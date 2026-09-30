import React from 'react';
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
    setComparisonSiteA,
    setComparisonSiteB,
    comparisonSiteA,
    flyToLocation,
  } = useCity();

  if (!selectedCandidate) return null;

  const radarData = [
    { factor: 'Pop Demand', value: Math.round(selectedCandidate.population_demand_score * 100) },
    { factor: 'Health Gap', value: Math.round(selectedCandidate.healthcare_gap_score * 100) },
    { factor: 'Road Access', value: Math.round(selectedCandidate.road_connectivity_score * 100) },
    { factor: 'Transit Link', value: Math.round(selectedCandidate.transit_access_score * 100) },
    { factor: 'Land Avail', value: Math.round(selectedCandidate.land_availability_score * 100) },
  ];

  const barData = [
    { factor: 'Population Demand', score: Math.round(selectedCandidate.population_demand_score * 100) },
    { factor: 'Coverage Gap', score: Math.round(selectedCandidate.healthcare_gap_score * 100) },
    { factor: 'Road Connectivity', score: Math.round(selectedCandidate.road_connectivity_score * 100) },
    { factor: 'Transit Access', score: Math.round(selectedCandidate.transit_access_score * 100) },
    { factor: 'Land Availability', score: Math.round(selectedCandidate.land_availability_score * 100) },
  ];

  const handleSetComparison = () => {
    if (!comparisonSiteA || comparisonSiteA.id === selectedCandidate.id) {
      setComparisonSiteA(selectedCandidate);
    } else {
      setComparisonSiteB(selectedCandidate);
    }
  };

  return (
    <div className="w-full lg:w-96 h-full bg-white/90 backdrop-blur-2xl border-l border-black/10 p-5 flex flex-col justify-between overflow-y-auto shadow-apple-lg z-20 font-sans text-slate-900 transition-all">
      <div className="space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI EXPLAINABILITY ENGINE</span>
          </div>
          <button
            onClick={() => setSelectedCandidate(null)}
            className="p-1.5 rounded-full hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Rank Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                selectedCandidate.rank === 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              RANK #{selectedCandidate.rank}
            </span>
            <span className="text-xs font-semibold text-slate-500">{selectedCandidate.sector}</span>
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 leading-snug">
            {selectedCandidate.name}
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {selectedCandidate.description}
          </p>
        </div>

        {/* Big Score Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-emerald-50/50 border border-blue-500/15 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Composite Suitability Score
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1 mt-0.5">
              <span>{selectedCandidate.suitability_score}</span>
              <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
            className="p-3 rounded-xl bg-white border border-black/10 text-blue-600 hover:bg-blue-50 transition-all shadow-apple-sm"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* Factor Breakdown Radar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>MULTI-FACTOR RADAR EVALUATION</span>
            <span className="text-[10px] text-blue-600 font-normal">5 Spatial Dimensions</span>
          </div>
          <div className="h-48 w-full -my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" tick={false} />
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

        {/* Detailed Horizontal Contribution Bars */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-700">FACTOR-BY-FACTOR PERFORMANCE</div>
          <div className="space-y-2 text-xs">
            {barData.map((item) => (
              <div key={item.factor} className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-600">
                  <span>{item.factor}</span>
                  <strong className="text-slate-900">{item.score} / 100</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor:
                        item.score > 90 ? '#10b981' : item.score > 80 ? '#0071e3' : '#f59e0b',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Municipal Specs */}
        <div className="p-3.5 rounded-2xl bg-black/5 border border-black/5 space-y-2 text-xs">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Site Infrastructure Specifications
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500">Vacant Land:</span>{' '}
              <strong>{selectedCandidate.vacant_land_acres} Acres</strong>
            </div>
            <div>
              <span className="text-slate-500">Est. Cost:</span>{' '}
              <strong>₹{selectedCandidate.estimated_cost_cr} Cr</strong>
            </div>
            <div>
              <span className="text-slate-500">Nearest Hosp:</span>{' '}
              <strong>{selectedCandidate.distance_to_nearest_hospital_km} km</strong>
            </div>
            <div>
              <span className="text-slate-500">Target Pop (2km):</span>{' '}
              <strong>{selectedCandidate.population_within_2km.toLocaleString()}</strong>
            </div>
          </div>
          <div className="pt-1 text-[11px] text-slate-600">
            <strong>Road Access:</strong> {selectedCandidate.road_access}
          </div>
        </div>

        {/* Why CityTwin AI Recommends This */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-500/15 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-800 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>EXPLAINABLE AI RATIONALE</span>
          </div>
          <p className="text-[11px] text-blue-950 leading-relaxed">
            {selectedCandidate.rationale}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-black/10 space-y-2">
        <button
          onClick={handleSetComparison}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-apple-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <span>Pin to Scenario Comparison</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
