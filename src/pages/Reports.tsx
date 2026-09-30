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
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { candidateSites, summaryMetrics, weights } = useCity();
  const [reportDate] = useState('October 2026');
  const topCandidate = candidateSites[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-6 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>MUNICIPAL DECISION SUPPORT SYSTEM</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Executive Site Feasibility Report
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Official decision brief for Chandigarh Hospital Location Selection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-apple-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Container */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-black/10 shadow-apple-md space-y-8 font-sans">
        {/* Document Header */}
        <div className="border-b border-black/10 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">
              CHANDIGARH ADMINISTRATION • HEALTH & URBAN PLANNING DIRECTORATE
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Infrastructure Allocation Feasibility Brief
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Subject: Optimal Siting for New Secondary/Tertiary General Hospital
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div className="font-bold text-slate-900">Document Ref: CT-CHD-2026-09</div>
            <div>Date: {reportDate}</div>
            <div>Evaluation Engine: CityTwin AI v2.4</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            This study evaluates six candidate infrastructure parcels across the Union Territory of
            Chandigarh using spatial multi-criteria decision analysis (MCDA) and machine learning
            suitability modeling. Based on current population demand, distance gaps to existing
            tertiary healthcare facilities (PGIMER, GMCH 32, GMSH 16), road connectivity, and vacant
            land parcels, <strong>{topCandidate?.name}</strong> has been ranked as the #1 priority
            location with an overall suitability index of{' '}
            <strong>{topCandidate?.suitability_score} / 100</strong>.
          </p>
        </div>

        {/* Telemetry Baseline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/5 text-xs">
          <div>
            <span className="text-slate-500">Evaluated Sectors:</span>
            <div className="font-extrabold text-slate-900 text-sm">
              {summaryMetrics.totalSectors} Sectors
            </div>
          </div>
          <div>
            <span className="text-slate-500">Current Bed Capacity:</span>
            <div className="font-extrabold text-slate-900 text-sm">
              {summaryMetrics.totalBeds.toLocaleString()} Beds
            </div>
          </div>
          <div>
            <span className="text-slate-500">Avg Distance to Care:</span>
            <div className="font-extrabold text-slate-900 text-sm">
              {summaryMetrics.avgDistanceToNearestHospitalKm} km
            </div>
          </div>
          <div>
            <span className="text-slate-500">Underserved Pockets:</span>
            <div className="font-extrabold text-red-600 text-sm">
              {summaryMetrics.criticalUnderservedSectorsCount} Sectors
            </div>
          </div>
        </div>

        {/* Active Weighting Protocol */}
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            2. Multi-Criteria Spatial Weighting Protocol
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Population Demand</span>
              <strong className="text-slate-900 font-bold">{Math.round(weights.populationDemand * 100)}%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Coverage Gap (Distance)</span>
              <strong className="text-slate-900 font-bold">{Math.round(weights.healthcareGap * 100)}%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Road Connectivity</span>
              <strong className="text-slate-900 font-bold">{Math.round(weights.roadConnectivity * 100)}%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Public Transit Link</span>
              <strong className="text-slate-900 font-bold">{Math.round(weights.transitAccess * 100)}%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Land Availability</span>
              <strong className="text-slate-900 font-bold">{Math.round(weights.landAvailability * 100)}%</strong>
            </div>
          </div>
        </div>

        {/* Candidate Site Ranking Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            3. Candidate Site Ranking & Evaluation Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-slate-500 text-[11px] font-bold">
                  <th className="py-2.5 px-2">RANK</th>
                  <th className="py-2.5 px-2">CANDIDATE SITE</th>
                  <th className="py-2.5 px-2">SECTOR</th>
                  <th className="py-2.5 px-2">SCORE</th>
                  <th className="py-2.5 px-2">VACANT LAND</th>
                  <th className="py-2.5 px-2">POP (2KM)</th>
                  <th className="py-2.5 px-2">EST. COST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {candidateSites.map((c) => (
                  <tr key={c.id} className={c.rank === 1 ? 'bg-emerald-50/70 font-semibold' : ''}>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.rank === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        #{c.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-2 text-slate-600">{c.sector}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-900">{c.suitability_score}</td>
                    <td className="py-2.5 px-2 text-slate-600">{c.vacant_land_acres} Acres</td>
                    <td className="py-2.5 px-2 text-slate-600">
                      {c.population_within_2km.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-slate-900 font-bold">₹{c.estimated_cost_cr} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Recommendation for #1 */}
        {topCandidate && (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-500/20 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PRIMARY RECOMMENDATION: {topCandidate.name}</span>
            </div>
            <p className="text-emerald-950 leading-relaxed">
              <strong>Strategic Justification:</strong> {topCandidate.rationale}
            </p>
            <div className="text-emerald-900 text-[11px] pt-1">
              <strong>Proposed Scope:</strong> {topCandidate.recommended_type} • Budget Allocation:
              ₹{topCandidate.estimated_cost_cr} Crore.
            </div>
          </div>
        )}

        {/* Signatures & Approvals Block */}
        <div className="pt-8 border-t border-black/10 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <div className="h-12 border-b border-black/20 mb-2"></div>
            <div className="font-bold text-slate-900">Dr. Ashutosh Dubey</div>
            <div className="text-[10px] text-slate-500">Project Supervisor & Urban AI Advisor</div>
          </div>
          <div>
            <div className="h-12 border-b border-black/20 mb-2"></div>
            <div className="font-bold text-slate-900">Lead Planning Engineer</div>
            <div className="text-[10px] text-slate-500">Chitkara University Urban Lab</div>
          </div>
          <div className="hidden sm:block">
            <div className="h-12 border-b border-black/20 mb-2"></div>
            <div className="font-bold text-slate-900">Municipal Commissioner</div>
            <div className="text-[10px] text-slate-500">UT Chandigarh Administration</div>
          </div>
        </div>
      </div>
    </div>
  );
};
