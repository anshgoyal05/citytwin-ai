import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Layers,
  HeartPulse,
  GitCompare,
  ShieldCheck,
  Building,
  Navigation,
  Compass,
  CheckCircle2,
  Activity,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  const pillars = [
    {
      title: 'Virtual Decision Sandbox',
      desc: 'Test and compare future infrastructure decisions on a virtual digital twin of Chandigarh before pouring thousands of crores of concrete.',
      icon: Layers,
      accent: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Healthcare Gap Analytics',
      desc: 'Pinpoint critical underserved demographic clusters across all 60+ sectors based on distance to nearest tertiary hospital and population density.',
      icon: HeartPulse,
      accent: 'text-red-600 bg-red-500/10 border-red-500/20',
    },
    {
      title: 'Explainable AI Scoring',
      desc: 'Transparent, configurable multi-criteria weighting. Planners see exactly why a site scored higher across population demand, road access, and land parcel size.',
      icon: ShieldCheck,
      accent: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Scenario Trade-off Engine',
      desc: 'Direct side-by-side comparison of candidate locations with 5/10/15-minute emergency isochrone catchments, population coverage delta, and capital ROI.',
      icon: GitCompare,
      accent: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
    },
  ];

  const cityHighlights = [
    { metric: '64', label: 'Sectors & Admin Zones', sub: 'Corbusier Grid Mapped' },
    { metric: '11', label: 'Ground-Truth Hospitals', sub: 'PGIMER, GMCH 32, GMSH 16' },
    { metric: '4,755', label: 'Total Hospital Beds', sub: 'Census & NHM Registry' },
    { metric: '6', label: 'Ranked Candidate Sites', sub: 'Phase 1 Recommended Sites' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white/80 to-[#f5f5f7] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-black/10 text-blue-600 text-xs font-bold backdrop-blur-2xl shadow-apple-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>CHANDIGARH URBAN DIGITAL TWIN PLATFORM</span>
            </div>

            {/* Core Apple Hero Headline */}
            <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 leading-[1.08]">
              Predict before building. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smarter cities start here.
              </span>
            </h1>

            {/* Rationale Quote from FA-1 Presentation */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              If we compare multiple options before buying a ₹1 Lakh laptop, shouldn’t governments
              do the same before investing thousands of crores in building a city’s future?
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-apple-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Launch Chandigarh 3D Twin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/simulation"
                className="px-8 py-4 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-black/10 font-bold text-sm shadow-apple-sm transition-all hover:scale-105"
              >
                <span>Compare Scenarios</span>
              </Link>
            </div>
          </motion.div>

          {/* Interactive Preview Teaser Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="pt-10"
          >
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-black/10 bg-white/90 shadow-apple-lg text-left grid grid-cols-2 md:grid-cols-4 gap-6">
              {cityHighlights.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {item.metric}
                  </div>
                  <div className="text-xs font-bold text-slate-700">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Decision-Support Philosophy Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">
            Built for Urban Planners & Authorities
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Decision-support, not decision-replacement.
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Every recommendation is backed by primary official government data (Census of India,
            OGD India, Chandigarh Health Department) with explainable multi-factor scoring.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl bg-white/80 border border-black/10 space-y-4 hover:border-blue-500/30 transition-all shadow-apple-sm"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{p.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chandigarh Focus Callout */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-apple-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold backdrop-blur-xl">
            <Building className="w-3.5 h-3.5" />
            <span>PHASE 1 GEOGRAPHICAL FOCUS</span>
          </div>

          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Why Chandigarh First?
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Designed by Le Corbusier, Chandigarh’s world-renowned orthogonal sector grid represents
            one of the most structured urban layouts on Earth. As the tri-city region grows past 1.5
            million residents, peripheral rehabilitation corridors (such as Sector 52, Maloya, and
            Dhanas) face severe tertiary healthcare shortages while PGIMER and GMCH 32 operate at
            capacity. CityTwin AI provides the spatial intelligence to solve this crisis.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-apple-sm flex items-center gap-2"
            >
              <span>Explore 3D Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
