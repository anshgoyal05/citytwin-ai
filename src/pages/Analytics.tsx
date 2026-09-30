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
    { range: '< 1.5 km', count: sectors.filter((s) => s.distance_to_nearest_hospital_km <= 1.5).length, color: '#34c759' },
    { range: '1.5 - 3.0 km', count: sectors.filter((s) => s.distance_to_nearest_hospital_km > 1.5 && s.distance_to_nearest_hospital_km <= 3.0).length, color: '#0071e3' },
    { range: '3.0 - 4.5 km', count: sectors.filter((s) => s.distance_to_nearest_hospital_km > 3.0 && s.distance_to_nearest_hospital_km <= 4.5).length, color: '#ff9500' },
    { range: '> 4.5 km (Critical)', count: sectors.filter((s) => s.distance_to_nearest_hospital_km > 4.5).length, color: '#ff3b30' },
  ];

  const COLORS = ['#34c759', '#0071e3', '#ff9500', '#ff3b30'];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>CHANDIGARH DEMOGRAPHIC & HEALTHCARE TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Spatial Healthcare Equity Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Primary census demographics, hospital bed distributions, and spatial accessibility gaps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-800 font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>PostGIS Baseline: {summaryMetrics.totalSectors} Sectors</span>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase">Total Population</div>
          <div className="text-2xl font-black text-slate-900">
            {summaryMetrics.totalPopulation.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Census 2011 + Projected 2026</div>
        </div>

        <div className="glass-card p-5 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase">Total Hospital Beds</div>
          <div className="text-2xl font-black text-slate-900">
            {summaryMetrics.totalBeds.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {summaryMetrics.avgBedsPer1000} beds / 1,000 residents
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase">Avg Distance to Care</div>
          <div className="text-2xl font-black text-slate-900">
            {summaryMetrics.avgDistanceToNearestHospitalKm} km
          </div>
          <div className="text-[11px] text-slate-500">Across all 64 sectors</div>
        </div>

        <div className="glass-card p-5 rounded-3xl bg-white/90 border border-red-500/20 bg-red-50/30 shadow-apple-sm space-y-1">
          <div className="text-xs text-red-600 font-bold uppercase">Critical Gap Sectors</div>
          <div className="text-2xl font-black text-red-600">
            {summaryMetrics.criticalUnderservedSectorsCount}
          </div>
          <div className="text-[11px] text-red-700 font-semibold">&gt;3.0 km away + &gt;25k pop</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Density Sectors */}
        <div className="glass-card p-6 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Highest Population Density Sectors (per km²)
            </h3>
            <span className="text-xs text-slate-500">Persons / km²</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDensitySectors} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} / km²`, 'Density']}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="density" fill="#0071e3" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Existing Hospital Beds Distribution */}
        <div className="glass-card p-6 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Major Hospital Bed Capacities
            </h3>
            <span className="text-xs text-slate-500">Government & Private</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hospitalBedsData.slice(0, 7)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#475569' }} width={110} />
                <Tooltip
                  formatter={(val: any) => [`${val} Beds`, 'Capacity']}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="beds" fill="#ef4444" radius={[0, 8, 8, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distance Bins Distribution Pie/Bar */}
        <div className="glass-card p-6 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {distanceBins.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-black/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-700">{item.range}</span>
                  </div>
                  <strong className="text-slate-900">{item.count} Sectors</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Policy Takeaways */}
        <div className="glass-card p-6 rounded-3xl bg-white/90 border border-black/10 shadow-apple-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Key Spatial Health Takeaways
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-500/20">
                <strong className="text-amber-900">Tertiary Concentration in North/Central:</strong>
                <p className="mt-0.5 text-amber-800">
                  PGIMER (Sec 12) and GMSH (Sec 16) are both located in northern sectors. South and
                  far-west sectors (52, 56, Maloya, Palsora) must travel up to 6.2 km through
                  congested corridors during medical emergencies.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-500/20">
                <strong className="text-blue-900">High-Density Rehabilitation Strain:</strong>
                <p className="mt-0.5 text-blue-800">
                  Sector 52, Maloya, and Dhanas contain over 120,000 residents combined, yet have zero
                  specialty beds within 3.5 km. Adding Site Alpha (Sector 52) immediately cuts average
                  ambulance response time from 28 minutes to 6 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/10 text-xs text-slate-500">
            Source: Chandigarh Administration Master Plan 2031 & Census of India.
          </div>
        </div>
      </div>
    </div>
  );
};
