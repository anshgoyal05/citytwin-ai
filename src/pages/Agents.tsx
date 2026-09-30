import React, { useState } from 'react';
import type { Agent, ActivityLog } from '../types';
import { Cpu, Terminal, Network, CheckCircle2, ShieldCheck, Database, Layers, Sparkles } from 'lucide-react';

export const Agents: React.FC = () => {
  const [agents] = useState<Agent[]>([
    {
      id: 'agent-spatial-data',
      name: 'Spatial Data Ingestion Agent',
      role: 'Census of India & OGD Data Pipeline',
      status: 'Monitoring',
      avatar: '🌐',
      activeTasks: 64,
      confidence: 99.4,
      lastAction: 'Synchronized 64 Chandigarh sector boundaries and demographics',
    },
    {
      id: 'agent-postgis',
      name: 'PostGIS Spatial Query Engine',
      role: 'Euclidean & Network Catchment Calculator',
      status: 'Analyzing',
      avatar: '🗺️',
      activeTasks: 18,
      confidence: 99.8,
      lastAction: 'Calculated 5/10/15-min emergency travel isochrones for 6 candidate sites',
    },
    {
      id: 'agent-mcda',
      name: 'MCDA Suitability Scorer',
      role: 'Multi-Factor Explainable Scoring',
      status: 'Evaluating',
      avatar: '⚖️',
      activeTasks: 6,
      confidence: 98.7,
      lastAction: 'Re-evaluated candidate site composite rankings with active weights',
    },
    {
      id: 'agent-ml-regressor',
      name: 'Spatial ML Validation Agent',
      role: 'Scikit-learn Spatial Cross-Validation',
      status: 'Calculating',
      avatar: '🤖',
      activeTasks: 12,
      confidence: 97.9,
      lastAction: 'Completed 1,000 Monte Carlo benchmark runs across sector subsets',
    },
  ]);

  const [logs] = useState<ActivityLog[]>([
    { id: '1', timestamp: '10:04:12', agentName: 'Spatial Data Agent', message: 'Validated Chandigarh sector geometry CRS (urn:ogc:def:crs:OGC:1.3:CRS84)', severity: 'success' },
    { id: '2', timestamp: '10:04:18', agentName: 'PostGIS Engine', message: 'Indexed 11 existing healthcare institutions with spatial GIST', severity: 'info' },
    { id: '3', timestamp: '10:04:25', agentName: 'MCDA Scorer', message: 'Site Alpha (Sector 52) assigned Rank #1 with suitability score 93.4', severity: 'success' },
    { id: '4', timestamp: '10:04:32', agentName: 'Spatial ML Agent', message: 'Leave-One-Out Ground Truth Backtest recovered PGIMER and GMCH 32 in 95th percentile', severity: 'info' },
    { id: '5', timestamp: '10:04:45', agentName: 'PostGIS Engine', message: 'Generated 15-minute emergency buffer: 142,000 citizens served', severity: 'success' },
  ]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-bold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AUTONOMOUS PIPELINE ORCHESTRATION</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Data & Spatial ML Agents
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time status of data ingestion, spatial indexing, suitability scoring, and ML validation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>4 Active Modular Agents</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="glass-card p-6 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-4 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-black/5">{agent.avatar}</span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{agent.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{agent.role}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                {agent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/5 text-xs">
              <div>
                <span className="text-slate-500">Pipeline Confidence:</span>
                <div className="font-black text-slate-900 text-sm">{agent.confidence}%</div>
              </div>
              <div>
                <span className="text-slate-500">Active Records:</span>
                <div className="font-black text-slate-900 text-sm">{agent.activeTasks}</div>
              </div>
            </div>

            <div className="text-xs text-slate-600">
              <strong className="text-slate-700">Latest Action:</strong> {agent.lastAction}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Activity Log */}
      <div className="glass-card p-6 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Spatial Data Pipeline Activity Log</span>
          </div>
          <span className="text-xs text-slate-500">System Nominal</span>
        </div>

        <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-black/5 text-slate-800"
            >
              <span className="text-slate-400 shrink-0">[{log.timestamp}]</span>
              <span className="font-semibold text-blue-600 shrink-0">{log.agentName}:</span>
              <span className="text-slate-700">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
