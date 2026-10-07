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
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-bold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AUTONOMOUS PIPELINE ORCHESTRATION</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
            Data & Spatial ML Agents
          </h1>
          <p className="text-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-1">
            Real-time status of data ingestion, spatial indexing, suitability scoring, and ML validation.
          </p>
        </div>

        <div className="flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark text-apple-text-secondary-light dark:text-apple-text-secondary-dark text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>4 Modular Micro-Agents Active</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="glass-card p-6 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-4 hover:border-apple-accent/40 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-apple-xl bg-black/[0.03] dark:bg-white/[0.05] border border-apple-border-light dark:border-apple-border-dark">{agent.avatar}</span>
                <div>
                  <h3 className="font-bold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">{agent.name}</h3>
                  <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark font-medium">{agent.role}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-apple-accent/10 text-apple-accent border border-apple-accent/20">
                {agent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-apple-xl bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-xs">
              <div>
                <span className="text-apple-text-tertiary text-[11px]">Pipeline Confidence:</span>
                <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">{agent.confidence}%</div>
              </div>
              <div>
                <span className="text-apple-text-tertiary text-[11px]">Active Records:</span>
                <div className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark text-sm font-mono">{agent.activeTasks}</div>
              </div>
            </div>

            <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
              <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark">Latest Action:</strong> {agent.lastAction}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Activity Log */}
      <div className="glass-card p-6 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
            <Terminal className="w-4 h-4 text-apple-accent" />
            <span>Spatial Data Pipeline Activity Log</span>
          </div>
          <span className="text-xs text-apple-text-tertiary font-mono">System Nominal</span>
        </div>

        <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-2.5 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark text-apple-text-primary-light dark:text-apple-text-primary-dark"
            >
              <span className="text-apple-text-tertiary shrink-0">[{log.timestamp}]</span>
              <span className="font-semibold text-apple-accent shrink-0">{log.agentName}:</span>
              <span className="text-apple-text-secondary-light dark:text-apple-text-secondary-dark">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
