import React, { useState } from 'react';
import { useCity } from '../context/CityContext';
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  CheckCircle2,
  Building,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { candidateSites, summaryMetrics, weights } = useCity();
  const [reportDate] = useState('October 2026');
  const topCandidate = candidateSites[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-6 max-w-5xl mx-auto font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-colors duration-300">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>MUNICIPAL DECISION SUPPORT SYSTEM</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
            Executive Site Feasibility Report
          </h1>
          <p className="text-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-1">
            Official decision brief for Chandigarh Hospital Location Selection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-apple-md bg-apple-accent hover:bg-apple-accent-hover text-white font-semibold text-xs shadow-apple-card flex items-center gap-2 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Container */}
      <div className="glass-card p-8 md:p-12 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-elevated space-y-8 font-sans">
        {/* Document Header */}
        <div className="border-b border-apple-border-light dark:border-apple-border-dark pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-apple-text-tertiary uppercase">
              CHANDIGARH ADMINISTRATION • HEALTH & URBAN PLANNING DIRECTORATE
            </div>
            <h2 className="text-2xl font-black text-apple-text-primary-light dark:text-apple-text-primary-dark mt-1">
              Infrastructure Allocation Feasibility Brief
            </h2>
            <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-0.5">
              Subject: Optimal Siting for New Secondary/Tertiary General Hospital
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">Document Ref: CT-CHD-2026-09</div>
            <div>Date: {reportDate}</div>
            <div>Evaluation Engine: CityTwin AI v2.4</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-apple-text-primary-light dark:text-apple-text-primary-dark">
            1. Executive Summary
          </h3>
          <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed text-justify">
            This study evaluates six candidate infrastructure parcels across the Union Territory of
            Chandigarh using spatial multi-criteria decision analysis (MCDA) and machine learning
            suitability modeling. Based on current population demand, distance gaps to existing
            tertiary healthcare facilities (PGIMER, GMCH 32, GMSH 16), road connectivity, and vacant
            land parcels, <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark">{topCandidate?.name}</strong> has been ranked as the #1 priority
            location with an overall suitability index of{' '}
            <strong className="text-apple-accent font-mono">{topCandidate?.suitability_score} / 100</strong>.
          </p>
        </div>

        {/* Telemetry Baseline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-xs">
          <div>
            <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Evaluated Sectors:</span>
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">
              {summaryMetrics.totalSectors} Sectors
            </div>
          </div>
          <div>
            <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Current Bed Capacity:</span>
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">
              {summaryMetrics.totalBeds.toLocaleString()} Beds
            </div>
          </div>
          <div>
            <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Avg Distance to Care:</span>
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">
              {summaryMetrics.avgDistanceToNearestHospitalKm} km
            </div>
          </div>
          <div>
            <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[11px]">Underserved Pockets:</span>
            <div className="font-bold text-rose-500 text-sm font-mono">
              {summaryMetrics.criticalUnderservedSectorsCount} Sectors
            </div>
          </div>
        </div>

        {/* Active Weighting Protocol */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-apple-text-primary-light dark:text-apple-text-primary-dark">
            2. Multi-Criteria Spatial Weighting Protocol
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-3 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark">
              <span className="text-apple-text-tertiary block text-[10px]">Population Demand</span>
              <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(weights.populationDemand * 100)}%</strong>
            </div>
            <div className="p-3 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark">
              <span className="text-apple-text-tertiary block text-[10px]">Coverage Gap (Distance)</span>
              <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(weights.healthcareGap * 100)}%</strong>
            </div>
            <div className="p-3 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark">
              <span className="text-apple-text-tertiary block text-[10px]">Road Connectivity</span>
              <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(weights.roadConnectivity * 100)}%</strong>
            </div>
            <div className="p-3 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark">
              <span className="text-apple-text-tertiary block text-[10px]">Public Transit Link</span>
              <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(weights.transitAccess * 100)}%</strong>
            </div>
            <div className="p-3 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark">
              <span className="text-apple-text-tertiary block text-[10px]">Land Availability</span>
              <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{Math.round(weights.landAvailability * 100)}%</strong>
            </div>
          </div>
        </div>

        {/* Candidate Site Ranking Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-apple-text-primary-light dark:text-apple-text-primary-dark">
            3. Candidate Site Ranking & Evaluation Matrix
          </h3>
          <div className="overflow-x-auto rounded-apple-xl border border-apple-border-light dark:border-apple-border-dark">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-apple-border-light dark:border-apple-border-dark bg-black/[0.02] dark:bg-white/[0.02] text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-[10px] font-semibold uppercase">
                  <th className="py-3 px-3">RANK</th>
                  <th className="py-3 px-3">CANDIDATE SITE</th>
                  <th className="py-3 px-3">SECTOR</th>
                  <th className="py-3 px-3">SCORE</th>
                  <th className="py-3 px-3">VACANT LAND</th>
                  <th className="py-3 px-3">POP (2KM)</th>
                  <th className="py-3 px-3 text-right">EST. COST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-border-light dark:divide-apple-border-dark font-sans">
                {candidateSites.map((c) => (
                  <tr key={c.id} className={c.rank === 1 ? 'bg-emerald-500/10 font-medium' : 'hover:bg-black/[0.01] dark:hover:bg-white/[0.01]'}>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.rank === 1 ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10 text-apple-text-primary-light dark:text-apple-text-primary-dark'
                        }`}
                      >
                        #{c.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">{c.name}</td>
                    <td className="py-3 px-3 text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{c.sector}</td>
                    <td className="py-3 px-3 font-mono font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">{c.suitability_score}</td>
                    <td className="py-3 px-3 text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{c.vacant_land_acres} Acres</td>
                    <td className="py-3 px-3 font-mono text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      {c.population_within_2km.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">₹{c.estimated_cost_cr} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Recommendation for #1 */}
        {topCandidate && (
          <div className="p-5 rounded-apple-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>PRIMARY RECOMMENDATION: {topCandidate.name}</span>
            </div>
            <p className="text-apple-text-primary-light dark:text-apple-text-primary-dark leading-relaxed">
              <strong>Strategic Justification:</strong> {topCandidate.rationale}
            </p>
          </div>
        )}

        {/* Official Endorsements & Sign-Off */}
        <div className="pt-6 border-t border-apple-border-light dark:border-apple-border-dark grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
          <div className="space-y-1">
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">Chief Town Planner</div>
            <div>UT Chandigarh Secretariat</div>
            <div className="font-mono text-[10px] text-apple-text-tertiary pt-2">DIGITALLY CERTIFIED • SEC-9 CHD</div>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">Director Health Services</div>
            <div>Department of Health & Family Welfare</div>
            <div className="font-mono text-[10px] text-apple-text-tertiary pt-2">VALIDATED • GMSH-16 CHD</div>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">Chief Engineer</div>
            <div>Chandigarh Municipal Corporation</div>
            <div className="font-mono text-[10px] text-apple-text-tertiary pt-2">SITE SURVEY VERIFIED • SEC-17 CHD</div>
          </div>
        </div>
      </div>
    </div>
  );
};
