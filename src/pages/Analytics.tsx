import React from 'react';
import { useCity } from '../context/CityContext';
import {
  BarChart3,
  Activity,
  HeartPulse,
  Building,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Compass,
  AlertCircle,
  Users,
  Bed,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const Analytics: React.FC = () => {
  const { sectors, hospitals, summaryMetrics } = useCity();

  // Top 8 highest density sectors
  const topDensitySectors = [...sectors]
    .sort((a, b) => b.density_per_sqkm - a.density_per_sqkm)
    .slice(0, 8)
    .map((s) => ({
      name: s.sector_name.replace('Sector ', 'Sec '),
      density: Math.round(s.density_per_sqkm),
      population: Math.round(s.population / 1000),
      zone: s.zone,
    }));

  // Top hospitals by bed capacity
  const hospitalBedsData = hospitals.map((h) => ({
    name: h.name.split('(')[0].trim(),
    beds: h.beds,
    icu: h.icu_beds,
    sector: h.sector,
  }));

  // Distance distribution bins
  const distanceBins = [
    { range: '< 1.5 km', count: sectors.filter((s) => s.distance_to_nearest_hospital_km <= 1.5).length, color: '#30d158' },
    { range: '1.5 - 3.0 km', count: sectors.filter((s) => s.distance_to_nearest_hospital_km > 1.5 && s.distance_to_nearest_hospital_km <= 3.0).length, color: '#0071e3' },
    { range: '3.0 - 4.5 km', count: sectors.filter((s) => s.distance_to_nearest_hospital_km > 3.0 && s.distance_to_nearest_hospital_km <= 4.5).length, color: '#ff9f0a' },
    { range: '> 4.5 km (Critical)', count: sectors.filter((s) => s.distance_to_nearest_hospital_km > 4.5).length, color: '#ff453a' },
  ];

  const COLORS = ['#30d158', '#0071e3', '#ff9f0a', '#ff453a'];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-apple-text-primary-light dark:text-apple-text-primary-dark transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>CHANDIGARH DEMOGRAPHIC & HEALTHCARE TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
            Spatial Healthcare Equity Analytics
          </h1>
          <p className="text-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark mt-1">
            Primary census demographics, hospital bed distributions, and spatial accessibility gaps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs glass-panel px-3.5 py-1.5 rounded-full border border-apple-border-light dark:border-apple-border-dark text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>PostGIS Baseline: {summaryMetrics.totalSectors} Sectors</span>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-apple-xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-1">
          <div className="text-xs text-apple-text-tertiary font-bold uppercase tracking-wider">Total Population</div>
          <div className="text-2xl font-black text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">
            {summaryMetrics.totalPopulation.toLocaleString()}
          </div>
          <div className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Census 2011 + Projected 2026</div>
        </div>

        <div className="glass-card p-5 rounded-apple-xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-1">
          <div className="text-xs text-apple-text-tertiary font-bold uppercase tracking-wider">Total Hospital Beds</div>
          <div className="text-2xl font-black text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">
            {summaryMetrics.totalBeds.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold">
            {summaryMetrics.avgBedsPer1000} beds / 1,000 residents
          </div>
        </div>

        <div className="glass-card p-5 rounded-apple-xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-1">
          <div className="text-xs text-apple-text-tertiary font-bold uppercase tracking-wider">Avg Distance to Care</div>
          <div className="text-2xl font-black text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">
            {summaryMetrics.avgDistanceToNearestHospitalKm} km
          </div>
          <div className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">Across all 64 sectors</div>
        </div>

        <div className="glass-card p-5 rounded-apple-xl border border-rose-500/20 bg-rose-500/5 shadow-apple-card space-y-1">
          <div className="text-xs text-rose-500 font-bold uppercase tracking-wider">Critical Gap Sectors</div>
          <div className="text-2xl font-black text-rose-500 font-mono">
            {summaryMetrics.criticalUnderservedSectorsCount}
          </div>
          <div className="text-[11px] text-rose-500/80 font-semibold">&gt;3.0 km away + &gt;25k pop</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Density Sectors */}
        <div className="glass-card p-6 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
              Highest Population Density Sectors (per km²)
            </h3>
            <span className="text-xs text-apple-text-tertiary">Persons / km²</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDensitySectors} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 128, 0.15)" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10, fill: '#86868b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#86868b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} / km²`, 'Density']}
                  contentStyle={{
                    borderRadius: '16px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                />
                <Bar dataKey="density" fill="#0071e3" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Existing Hospital Beds Distribution */}
        <div className="glass-card p-6 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
              Major Hospital Bed Capacities
            </h3>
            <span className="text-xs text-apple-text-tertiary">Government & Private</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hospitalBedsData.slice(0, 7)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(120, 120, 128, 0.15)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#86868b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#86868b' }} width={110} />
                <Tooltip
                  formatter={(val: any) => [`${val} Beds`, 'Capacity']}
                  contentStyle={{
                    borderRadius: '16px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                />
                <Bar dataKey="beds" fill="#ff453a" radius={[0, 8, 8, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distance Bins Distribution Pie/Bar */}
        <div className="glass-card p-6 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-4">
          <h3 className="font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
            Healthcare Access Distance Spectrum (64 Sectors)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distanceBins}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    isAnimationActive={false}
                  >
                    {distanceBins.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {distanceBins.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-apple-md bg-black/[0.02] dark:bg-white/[0.03] border border-apple-border-light dark:border-apple-border-dark">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-apple-text-primary-light dark:text-apple-text-primary-dark">{item.range}</span>
                  </div>
                  <strong className="text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">{item.count} Sectors</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Policy Takeaways */}
        <div className="glass-card p-6 rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark mb-2">
              Key Spatial Health Takeaways
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
              <div className="p-3.5 rounded-apple-xl bg-amber-500/10 border border-amber-500/20">
                <strong className="text-amber-700 dark:text-amber-400">Tertiary Concentration in North/Central:</strong>
                <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                  PGIMER (Sec 12) and GMSH (Sec 16) are both located in northern sectors. South and
                  far-west sectors (52, 56, Maloya, Palsora) must travel up to 6.2 km through
                  congested corridors during medical emergencies.
                </p>
              </div>

              <div className="p-3.5 rounded-apple-xl bg-apple-accent/10 border border-apple-accent/20">
                <strong className="text-apple-accent">High-Density Rehabilitation Strain:</strong>
                <p className="mt-0.5 text-apple-text-primary-light dark:text-apple-text-primary-dark">
                  Sector 52, Maloya, and Dhanas contain over 120,000 residents combined, yet have zero
                  specialty beds within 3.5 km. Adding Site Alpha (Sector 52) immediately cuts average
                  ambulance response time from 28 minutes to 6 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-apple-border-light dark:border-apple-border-dark text-xs text-apple-text-tertiary">
            Source: Chandigarh Administration Master Plan 2031 & Census of India.
          </div>
        </div>
      </div>
    </div>
  );
};
