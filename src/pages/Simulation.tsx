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
  Scale,
  Award,
  Layers,
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

  // Detailed comparative metrics for the Recon-Bot style Comparison Table
  const tableRows = [
    {
      label: 'Suitability Score',
      valA: `${siteA.suitability_score} / 100`,
      valB: `${siteB.suitability_score} / 100`,
      delta: `${(siteA.suitability_score - siteB.suitability_score).toFixed(1)} pts`,
      winner: siteA.suitability_score >= siteB.suitability_score ? 'siteA' : 'siteB',
      format: 'score',
    },
    {
      label: 'Population Catchment (2km)',
      valA: `${siteA.population_within_2km.toLocaleString()} residents`,
      valB: `${siteB.population_within_2km.toLocaleString()} residents`,
      delta: `${Math.abs(siteA.population_within_2km - siteB.population_within_2km).toLocaleString()} diff`,
      winner: siteA.population_within_2km >= siteB.population_within_2km ? 'siteA' : 'siteB',
      format: 'number',
    },
    {
      label: 'Distance to Nearest Hospital',
      valA: `${siteA.distance_to_nearest_hospital_km} km`,
      valB: `${siteB.distance_to_nearest_hospital_km} km`,
      delta: `${Math.abs(siteA.distance_to_nearest_hospital_km - siteB.distance_to_nearest_hospital_km).toFixed(1)} km`,
      winner: siteA.distance_to_nearest_hospital_km >= siteB.distance_to_nearest_hospital_km ? 'siteA' : 'siteB',
      format: 'gap', // Larger distance = bigger unserved gap resolved
    },
    {
      label: 'Vacant Land Available',
      valA: `${siteA.vacant_land_acres} Acres`,
      valB: `${siteB.vacant_land_acres} Acres`,
      delta: `${Math.abs(siteA.vacant_land_acres - siteB.vacant_land_acres).toFixed(1)} Acres`,
      winner: siteA.vacant_land_acres >= siteB.vacant_land_acres ? 'siteA' : 'siteB',
      format: 'number',
    },
    {
      label: 'Projected Capital Outlay',
      valA: `₹${siteA.estimated_cost_cr} Cr`,
      valB: `₹${siteB.estimated_cost_cr} Cr`,
      delta: `₹${Math.abs(siteA.estimated_cost_cr - siteB.estimated_cost_cr)} Cr`,
      winner: siteA.estimated_cost_cr <= siteB.estimated_cost_cr ? 'siteA' : 'siteB',
      format: 'cost', // Lower cost is better
    },
    {
      label: 'Primary Road Connectivity',
      valA: siteA.road_access,
      valB: siteB.road_access,
      delta: 'Corridor Class',
      winner: siteA.road_connectivity_score >= siteB.road_connectivity_score ? 'siteA' : 'siteB',
      format: 'text',
    },
    {
      label: 'Target Facility Classification',
      valA: siteA.recommended_type,
      valB: siteB.recommended_type,
      delta: 'Capacity Tier',
      winner: 'neutral',
      format: 'text',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-bold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>INFRASTRUCTURE SCENARIO COMPARISON ENGINE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
            Compare Candidate Hospital Scenarios
          </h1>
          <p className="text-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-1">
            Side-by-side trade-off analysis of population coverage, land availability, capital
            expenditure, and emergency accessibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark hidden sm:flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Monte Carlo Simulation v2.4</span>
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="glass-panel p-5 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark grid grid-cols-1 md:grid-cols-2 gap-5 shadow-apple-card">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-apple-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-apple-accent" />
            <span className="tracking-wide uppercase text-[11px]">Primary Scenario (Site A)</span>
          </label>
          <select
            value={siteAId}
            onChange={(e) => setSiteAId(e.target.value)}
            className="w-full bg-black/[0.02] dark:bg-white/[0.05] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] border border-apple-border-light dark:border-apple-border-dark rounded-apple-md px-4 py-2.5 text-xs font-medium text-apple-text-primary-light dark:text-apple-text-primary-dark focus:outline-none focus:ring-2 focus:ring-apple-accent cursor-pointer transition-colors"
          >
            {candidateSites.map((c) => (
              <option key={c.id} value={c.id} className="bg-white dark:bg-[#161617] text-apple-text-primary-light dark:text-apple-text-primary-dark">
                Rank #{c.rank}: {c.name} ({c.sector}) — Score {c.suitability_score}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400" />
            <span className="tracking-wide uppercase text-[11px]">Comparison Scenario (Site B)</span>
          </label>
          <select
            value={siteBId}
            onChange={(e) => setSiteBId(e.target.value)}
            className="w-full bg-black/[0.02] dark:bg-white/[0.05] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] border border-apple-border-light dark:border-apple-border-dark rounded-apple-md px-4 py-2.5 text-xs font-medium text-apple-text-primary-light dark:text-apple-text-primary-dark focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-colors"
          >
            {candidateSites.map((c) => (
              <option key={c.id} value={c.id} className="bg-white dark:bg-[#161617] text-apple-text-primary-light dark:text-apple-text-primary-dark">
                Rank #{c.rank}: {c.name} ({c.sector}) — Score {c.suitability_score}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site A Card */}
        <div className="glass-card p-6 sm:p-7 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark space-y-5 shadow-apple-card hover:shadow-apple-card-hover transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-apple-accent text-white font-semibold text-xs shadow-apple-subtle inline-flex items-center gap-1.5">
                <span>SITE A</span>
                <span>•</span>
                <span>RANK #{siteA.rank}</span>
              </span>
              <h2 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark mt-2.5 tracking-tight">{siteA.name}</h2>
              <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-0.5">{siteA.sector} • {siteA.road_access}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-apple-accent font-mono tracking-tight">{siteA.suitability_score}</div>
              <div className="text-[10px] font-bold text-apple-text-tertiary uppercase tracking-wider">Suitability</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-xs">
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Population Catchment (2km)</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono mt-0.5">
                {siteA.population_within_2km.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Vacant Land</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm mt-0.5">
                {siteA.vacant_land_acres} Acres
              </div>
            </div>
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Distance to Nearest Hospital</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono mt-0.5">
                {siteA.distance_to_nearest_hospital_km} km
              </div>
            </div>
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Projected Capital Outlay</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono mt-0.5">
                ₹{siteA.estimated_cost_cr} Cr
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">Recommended Facility:</span>
            <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{siteA.recommended_type}</p>
          </div>

          <div className="p-4 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed">
            <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-medium">Planning Context:</strong> {siteA.rationale}
          </div>
        </div>

        {/* Site B Card */}
        <div className="glass-card p-6 sm:p-7 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark space-y-5 shadow-apple-card hover:shadow-apple-card-hover transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-semibold text-xs shadow-apple-subtle inline-flex items-center gap-1.5">
                <span>SITE B</span>
                <span>•</span>
                <span>RANK #{siteB.rank}</span>
              </span>
              <h2 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark mt-2.5 tracking-tight">{siteB.name}</h2>
              <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-0.5">{siteB.sector} • {siteB.road_access}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight">{siteB.suitability_score}</div>
              <div className="text-[10px] font-bold text-apple-text-tertiary uppercase tracking-wider">Suitability</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-xs">
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Population Catchment (2km)</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono mt-0.5">
                {siteB.population_within_2km.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Vacant Land</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm mt-0.5">
                {siteB.vacant_land_acres} Acres
              </div>
            </div>
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Distance to Nearest Hospital</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono mt-0.5">
                {siteB.distance_to_nearest_hospital_km} km
              </div>
            </div>
            <div>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Projected Capital Outlay</span>
              <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono mt-0.5">
                ₹{siteB.estimated_cost_cr} Cr
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">Recommended Facility:</span>
            <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{siteB.recommended_type}</p>
          </div>

          <div className="p-4 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed">
            <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-medium">Planning Context:</strong> {siteB.rationale}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          RECON-BOT INSPIRED COMPARISON TABLE
      ------------------------------------------------------------- */}
      <div className="rounded-apple-2xl glass-card border border-apple-border-light dark:border-apple-border-dark overflow-hidden shadow-apple-card">
        <div className="p-4 border-b border-apple-border-light dark:border-apple-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-apple-accent" />
            <h3 className="font-semibold text-sm text-apple-text-primary-light dark:text-apple-text-primary-dark">
              Head-to-Head Telemetry Comparison
            </h3>
          </div>
          <span className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
            Direct variance computed across 7 municipal factors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-apple-border-light dark:border-apple-border-dark bg-black/[0.02] dark:bg-white/[0.02] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Criterion / Metric</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-left">
                  Site A: {siteA.name.split('(')[0]}
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-left">
                  Site B: {siteB.name.split('(')[0]}
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-center">Variance / Delta</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-border-light dark:divide-apple-border-dark font-sans">
              {tableRows.map((row, idx) => {
                const isAWinner = row.winner === 'siteA';
                const isBWinner = row.winner === 'siteB';

                return (
                  <tr
                    key={idx}
                    className="hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Metric Label */}
                    <td className="py-3.5 px-4 font-medium text-apple-text-primary-light dark:text-apple-text-primary-dark">
                      {row.label}
                    </td>

                    {/* Site A Value */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`${
                          isAWinner
                            ? 'font-bold text-apple-accent font-mono'
                            : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark'
                        }`}
                      >
                        {row.valA}
                      </span>
                    </td>

                    {/* Site B Value */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`${
                          isBWinner
                            ? 'font-bold text-purple-600 dark:text-purple-400 font-mono'
                            : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark'
                        }`}
                      >
                        {row.valB}
                      </span>
                    </td>

                    {/* Variance / Delta */}
                    <td className="py-3.5 px-4 text-center font-mono text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      {row.delta}
                    </td>

                    {/* Advantage Badge */}
                    <td className="py-3.5 px-4 text-right">
                      {isAWinner ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-apple-accent bg-apple-accent/10 px-2 py-0.5 rounded-full border border-apple-accent/20">
                          <CheckCircle2 className="w-3 h-3" /> Site A Leads
                        </span>
                      ) : isBWinner ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Site B Leads
                        </span>
                      ) : (
                        <span className="text-[11px] text-apple-text-tertiary">Neutral</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Overlay Comparison */}
        <div className="glass-card p-6 rounded-apple-2xl space-y-4 shadow-apple-card border border-apple-border-light dark:border-apple-border-dark">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
              5-Factor Radar Suitability Overlay
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-apple-accent font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-apple-accent" /> Site A
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Site B
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarComparisonData}>
                <PolarGrid stroke="rgba(120, 120, 128, 0.2)" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fill: '#86868b', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis domain={[0, 100]} stroke="rgba(120, 120, 128, 0.2)" tick={false} />
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
        <div className="glass-card p-6 rounded-apple-2xl space-y-4 shadow-apple-card border border-apple-border-light dark:border-apple-border-dark flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark mb-2">
              Decision Synthesis & Policy Trade-offs
            </h3>
            <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed mb-4">
              Comparing <strong>{siteA.name}</strong> vs <strong>{siteB.name}</strong> based on
              Chandigarh Master Plan 2031 objectives.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-apple-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-700 dark:text-emerald-400">Population Catchment Advantage:</strong>
                  <p className="text-emerald-800 dark:text-emerald-300 text-[11px] mt-0.5">
                    {siteA.population_within_2km > siteB.population_within_2km
                      ? `${siteA.name} serves ${(siteA.population_within_2km - siteB.population_within_2km).toLocaleString()} more residents within 2km.`
                      : `${siteB.name} serves ${(siteB.population_within_2km - siteA.population_within_2km).toLocaleString()} more residents within 2km.`}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-apple-xl bg-apple-accent/10 border border-apple-accent/20 flex items-start gap-2.5">
                <Coins className="w-4 h-4 text-apple-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-apple-accent">Capital Expenditure Difference:</strong>
                  <p className="text-apple-text-primary-light dark:text-apple-text-primary-dark text-[11px] mt-0.5">
                    {siteA.estimated_cost_cr < siteB.estimated_cost_cr
                      ? `${siteA.name} saves ₹${siteB.estimated_cost_cr - siteA.estimated_cost_cr} Crore in estimated initial capital outlay.`
                      : `${siteB.name} saves ₹${siteA.estimated_cost_cr - siteB.estimated_cost_cr} Crore in estimated initial capital outlay.`}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-apple-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                <Building className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-700 dark:text-amber-400">Expansion Space & Scalability:</strong>
                  <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
                    {siteA.vacant_land_acres > siteB.vacant_land_acres
                      ? `${siteA.name} provides ${siteA.vacant_land_acres} acres (larger plot for future super-specialty wings).`
                      : `${siteB.name} provides ${siteB.vacant_land_acres} acres (larger plot for future super-specialty wings).`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-apple-border-light dark:border-apple-border-dark flex items-center justify-between text-xs">
            <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Recommendation Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
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
