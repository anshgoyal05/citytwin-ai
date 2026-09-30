import React, { useState } from 'react';
import { useCity } from '../context/CityContext';
import type { CandidateSite } from '../types';
import {
  GitCompare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building,
  TrendingUp,
  Clock,
  Coins,
  ShieldCheck,
  Zap,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const Simulation: React.FC = () => {
  const {
    candidateSites,
    comparisonSiteA,
    setComparisonSiteA,
    comparisonSiteB,
    setComparisonSiteB,
    flyToLocation,
  } = useCity();

  const [siteAId, setSiteAId] = useState<string>(
    comparisonSiteA ? comparisonSiteA.id : candidateSites[0]?.id || ''
  );
  const [siteBId, setSiteBId] = useState<string>(
    comparisonSiteB ? comparisonSiteB.id : candidateSites[1]?.id || ''
  );

  const siteA = candidateSites.find((c) => c.id === siteAId) || candidateSites[0];
  const siteB = candidateSites.find((c) => c.id === siteBId) || candidateSites[1];

  const radarComparisonData = [
    {
      factor: 'Pop Demand',
      siteA: Math.round(siteA.population_demand_score * 100),
      siteB: Math.round(siteB.population_demand_score * 100),
    },
    {
      factor: 'Health Gap',
      siteA: Math.round(siteA.healthcare_gap_score * 100),
      siteB: Math.round(siteB.healthcare_gap_score * 100),
    },
    {
      factor: 'Road Access',
      siteA: Math.round(siteA.road_connectivity_score * 100),
      siteB: Math.round(siteB.road_connectivity_score * 100),
    },
    {
      factor: 'Transit Link',
      siteA: Math.round(siteA.transit_access_score * 100),
      siteB: Math.round(siteB.transit_access_score * 100),
    },
    {
      factor: 'Land Avail',
      siteA: Math.round(siteA.land_availability_score * 100),
      siteB: Math.round(siteB.land_availability_score * 100),
    },
  ];

  const barComparisonData = [
    {
      metric: 'Population (2km)',
      siteA: siteA.population_within_2km / 1000,
      siteB: siteB.population_within_2km / 1000,
      unit: 'k people',
    },
    {
      metric: 'Cost (Cr)',
      siteA: siteA.estimated_cost_cr,
      siteB: siteB.estimated_cost_cr,
      unit: '₹ Cr',
    },
    {
      metric: 'Vacant Land',
      siteA: siteA.vacant_land_acres,
      siteB: siteB.vacant_land_acres,
      unit: 'Acres',
    },
    {
      metric: 'Hospital Gap',
      siteA: siteA.distance_to_nearest_hospital_km,
      siteB: siteB.distance_to_nearest_hospital_km,
      unit: 'km',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-bold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>INFRASTRUCTURE SCENARIO COMPARISON ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Compare Candidate Hospital Scenarios
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Side-by-side trade-off analysis of population coverage, land availability, capital
            expenditure, and emergency accessibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Simulate decisions in virtual Chandigarh before ground breaking
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-black/10 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-apple-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>PRIMARY SCENARIO (SITE A):</span>
          </label>
          <select
            value={siteAId}
            onChange={(e) => setSiteAId(e.target.value)}
            className="w-full bg-black/5 border border-black/10 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {candidateSites.map((c) => (
              <option key={c.id} value={c.id}>
                Rank #{c.rank}: {c.name} ({c.sector}) — Score {c.suitability_score}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>COMPARISON SCENARIO (SITE B):</span>
          </label>
          <select
            value={siteBId}
            onChange={(e) => setSiteBId(e.target.value)}
            className="w-full bg-black/5 border border-black/10 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {candidateSites.map((c) => (
              <option key={c.id} value={c.id}>
                Rank #{c.rank}: {c.name} ({c.sector}) — Score {c.suitability_score}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site A Card */}
        <div className="glass-card p-6 rounded-3xl border border-blue-500/20 bg-white/90 space-y-5 shadow-apple-md">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-xs">
                SITE A • RANK #{siteA.rank}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">{siteA.name}</h2>
              <div className="text-xs text-slate-500">{siteA.sector} • {siteA.road_access}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">{siteA.suitability_score}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Suitability</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-500/10 text-xs">
            <div>
              <span className="text-slate-500">Population Catchment (2km):</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {siteA.population_within_2km.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Vacant Land:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {siteA.vacant_land_acres} Acres
              </div>
            </div>
            <div>
              <span className="text-slate-500">Distance to Nearest Hospital:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {siteA.distance_to_nearest_hospital_km} km
              </div>
            </div>
            <div>
              <span className="text-slate-500">Projected Capital Outlay:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                ₹{siteA.estimated_cost_cr} Cr
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700">Recommended Facility:</span>
            <p className="text-xs text-slate-600">{siteA.recommended_type}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 text-xs text-slate-700 leading-relaxed">
            <strong>Planning Context:</strong> {siteA.rationale}
          </div>
        </div>

        {/* Site B Card */}
        <div className="glass-card p-6 rounded-3xl border border-purple-500/20 bg-white/90 space-y-5 shadow-apple-md">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-xs">
                SITE B • RANK #{siteB.rank}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">{siteB.name}</h2>
              <div className="text-xs text-slate-500">{siteB.sector} • {siteB.road_access}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-purple-600">{siteB.suitability_score}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Suitability</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-500/10 text-xs">
            <div>
              <span className="text-slate-500">Population Catchment (2km):</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {siteB.population_within_2km.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Vacant Land:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {siteB.vacant_land_acres} Acres
              </div>
            </div>
            <div>
              <span className="text-slate-500">Distance to Nearest Hospital:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {siteB.distance_to_nearest_hospital_km} km
              </div>
            </div>
            <div>
              <span className="text-slate-500">Projected Capital Outlay:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                ₹{siteB.estimated_cost_cr} Cr
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700">Recommended Facility:</span>
            <p className="text-xs text-slate-600">{siteB.recommended_type}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 text-xs text-slate-700 leading-relaxed">
            <strong>Planning Context:</strong> {siteB.rationale}
          </div>
        </div>
      </div>

      {/* Visual Analytics Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Overlay Comparison */}
        <div className="glass-card p-6 rounded-3xl bg-white/90 space-y-4 shadow-apple-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              5-Factor Radar Suitability Overlay
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Site A
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Site B
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarComparisonData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar
                  name={siteA.name}
                  dataKey="siteA"
                  stroke="#0071e3"
                  fill="#0071e3"
                  fillOpacity={0.3}
                  isAnimationActive={false}
                />
                <Radar
                  name={siteB.name}
                  dataKey="siteB"
                  stroke="#af52de"
                  fill="#af52de"
                  fillOpacity={0.3}
                  isAnimationActive={false}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade-off Summary Matrix */}
        <div className="glass-card p-6 rounded-3xl bg-white/90 space-y-4 shadow-apple-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Decision Synthesis & Policy Trade-offs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Comparing <strong>{siteA.name}</strong> vs <strong>{siteB.name}</strong> based on
              Chandigarh Master Plan 2031 objectives.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-900">Population Catchment Advantage:</strong>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    {siteA.population_within_2km > siteB.population_within_2km
                      ? `${siteA.name} serves ${(siteA.population_within_2km - siteB.population_within_2km).toLocaleString()} more residents within 2km.`
                      : `${siteB.name} serves ${(siteB.population_within_2km - siteA.population_within_2km).toLocaleString()} more residents within 2km.`}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-500/20 flex items-start gap-2.5">
                <Coins className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-900">Capital Expenditure Difference:</strong>
                  <p className="text-blue-800 text-[11px] mt-0.5">
                    {siteA.estimated_cost_cr < siteB.estimated_cost_cr
                      ? `${siteA.name} saves ₹${siteB.estimated_cost_cr - siteA.estimated_cost_cr} Crore in estimated initial capital outlay.`
                      : `${siteB.name} saves ₹${siteA.estimated_cost_cr - siteB.estimated_cost_cr} Crore in estimated initial capital outlay.`}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-500/20 flex items-start gap-2.5">
                <Building className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900">Expansion Space & Scalability:</strong>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    {siteA.vacant_land_acres > siteB.vacant_land_acres
                      ? `${siteA.name} provides ${siteA.vacant_land_acres} acres (larger plot for future super-specialty wings).`
                      : `${siteB.name} provides ${siteB.vacant_land_acres} acres (larger plot for future super-specialty wings).`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs">
            <span className="text-slate-500">Recommendation Status:</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {siteA.suitability_score >= siteB.suitability_score
                ? `Proceed with Site A (${siteA.name})`
                : `Proceed with Site B (${siteB.name})`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
