import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Layers,
  HeartPulse,
  GitCompare,
  Building,
  Navigation,
  Compass,
  CheckCircle2,
  Bot,
  BarChart3,
  FileText,
  Cpu,
  Car,
  Users,
  Sun,
  CloudRain,
  Moon,
  CloudFog,
  Eye,
  Sliders,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  ShieldAlert,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

type HeroTab = '3d-twin' | 'mcda' | 'radar' | 'copilot';
type WeatherState = 'clear' | 'rain' | 'fog' | 'night';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // HERO INTERACTIVE EXPERIENCE CENTER STATES
  // -------------------------------------------------------------
  const [activeHeroTab, setActiveHeroTab] = useState<HeroTab>('3d-twin');

  // Tab 1: 3D Twin Interactive Preview Controls
  const [demoWeather, setDemoWeather] = useState<WeatherState>('clear');
  const [demo3DBuildings, setDemo3DBuildings] = useState(true);
  const [demoIsochrones, setDemoIsochrones] = useState(true);
  const [demoTraffic, setDemoTraffic] = useState(true);
  const [demoActiveCamera, setDemoActiveCamera] = useState<'sec52' | 'pgimer' | 'gmch'>('sec52');

  // Tab 2: MCDA Live Weights
  const [weightPop, setWeightPop] = useState(0.35);
  const [weightGap, setWeightGap] = useState(0.30);
  const [weightAccess, setWeightAccess] = useState(0.20);
  const [weightLand, setWeightLand] = useState(0.15);

  // Tab 3: Sector Radar Selector
  const [selectedRadarSector, setSelectedRadarSector] = useState<'sec52' | 'sec12' | 'sec32' | 'sec43'>('sec52');

  // Tab 4: Spatial Copilot Prompt Simulator
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Before & After Interactive Comparison Toggle
  const [comparisonMode, setComparisonMode] = useState<'traditional' | 'citytwin'>('citytwin');

  // Catchment Isochrone Ring Selector
  const [isochroneMinutes, setIsochroneMinutes] = useState<5 | 10 | 15>(15);

  // Dynamic MCDA Scores calculation
  const calculateScore = (basePop: number, baseGap: number, baseAccess: number, baseLand: number) => {
    const raw = (basePop * weightPop) + (baseGap * weightGap) + (baseAccess * weightAccess) + (baseLand * weightLand);
    return Math.min(99.4, Math.max(45.0, raw * 100)).toFixed(1);
  };

  const candidateScores = [
    {
      name: 'Site Alpha (Sector 52 Maloya Corridor)',
      rank: 1,
      score: calculateScore(0.95, 0.92, 0.90, 0.70),
      color: '#30D158',
      acres: '18.5 Acres',
      popCatchment: '140k Citizens',
    },
    {
      name: 'Site Beta (Sarangpur Institutional Reserve)',
      rank: 2,
      score: calculateScore(0.68, 0.74, 0.88, 0.96),
      color: '#0071E3',
      acres: '32.0 Acres',
      popCatchment: '62k Citizens',
    },
    {
      name: 'Site Gamma (Manimajra Housing Board)',
      rank: 3,
      score: calculateScore(0.82, 0.65, 0.75, 0.60),
      color: '#FF9F0A',
      acres: '12.4 Acres',
      popCatchment: '98k Citizens',
    },
    {
      name: 'Site Delta (Sector 26 Transport Hub)',
      rank: 4,
      score: calculateScore(0.60, 0.58, 0.82, 0.72),
      color: '#86868B',
      acres: '15.0 Acres',
      popCatchment: '45k Citizens',
    },
  ];

  // Sector Radar Data Map
  const sectorRadarConfigs = {
    sec52: {
      name: 'Sector 52 (Maloya Peripheral Cluster)',
      zone: 'South Zone • High Healthcare Desert',
      pop: '68,450',
      density: '15,200/km²',
      gapKm: '4.2 km to GMCH 32',
      reach15m: '380,000 citizens',
      verdict: 'Highest municipal healthcare priority. Peripheral colonies lack tertiary coverage within golden 15-minute emergency reach.',
      radar: [
        { factor: 'Pop Demand', score: 95 },
        { factor: 'Health Gap', score: 92 },
        { factor: 'Road Access', score: 88 },
        { factor: 'Transit Link', score: 86 },
        { factor: 'Land Avail', score: 76 },
      ],
    },
    sec12: {
      name: 'Sector 12 (PGIMER Medical Campus)',
      zone: 'North Zone • Tertiary Medical Hub',
      pop: '14,200',
      density: '5,800/km²',
      gapKm: '0.0 km (PGIMER On-Site)',
      reach15m: '420,000 citizens',
      verdict: 'Extreme outpatient overcrowding (>10,000 OPD visits/day). Secondary expansion cannot resolve peripheral accessibility gaps.',
      radar: [
        { factor: 'Pop Demand', score: 55 },
        { factor: 'Health Gap', score: 15 },
        { factor: 'Road Access', score: 94 },
        { factor: 'Transit Link', score: 92 },
        { factor: 'Land Avail', score: 25 },
      ],
    },
    sec32: {
      name: 'Sector 32 (GMCH Regional Hub)',
      zone: 'South-East Zone • Hospital Center',
      pop: '28,900',
      density: '8,400/km²',
      gapKm: '0.0 km (GMCH On-Site)',
      reach15m: '350,000 citizens',
      verdict: 'Major referral anchor for South Chandigarh. Operates at 112% bed occupancy; satellite peripheral relief recommended.',
      radar: [
        { factor: 'Pop Demand', score: 72 },
        { factor: 'Health Gap', score: 20 },
        { factor: 'Road Access', score: 90 },
        { factor: 'Transit Link', score: 88 },
        { factor: 'Land Avail', score: 40 },
      ],
    },
    sec43: {
      name: 'Sector 43 (ISBT South Gateway)',
      zone: 'South-West Zone • Intercity Transit',
      pop: '38,200',
      density: '9,800/km²',
      gapKm: '3.1 km to GMCH 32',
      reach15m: '310,000 citizens',
      verdict: 'Exceptional arterial connectivity via Himalaya Marg and ISBT terminal. High commercial land values favor mixed-use triage.',
      radar: [
        { factor: 'Pop Demand', score: 78 },
        { factor: 'Health Gap', score: 68 },
        { factor: 'Road Access', score: 96 },
        { factor: 'Transit Link', score: 98 },
        { factor: 'Land Avail', score: 55 },
      ],
    },
  };

  // Copilot Prompts
  const copilotPrompts = [
    {
      q: 'Where is Chandigarh’s highest healthcare deficiency cluster?',
      source: 'Census 2011 Registry & GMDA Health GIS',
      a: 'Spatial multi-criteria analysis confirms Sector 52, Maloya, and Dhanas form the most acute underserved corridor. Over 140,000 citizens have an average distance of 4.2 km to the nearest tertiary center (GMCH 32), with emergency transit exceeding 18 minutes.',
      rec: 'Deploy 500-Bed Tertiary Facility at Site Alpha (Sector 52)',
      score: 'Urgency: 94 / 100',
    },
    {
      q: 'Why does Site Alpha rank above Sarangpur (Site Beta)?',
      source: 'MCDA Multi-Criteria Matrix & AHP Weights',
      a: 'While Sarangpur provides 32 acres of vacant institutional reserve, Site Alpha scores 31% higher on immediate underserved demand (95 vs 68) and connects directly to Vikas Marg and the PR-7 expressway, reducing ambulance travel times by 42%.',
      rec: 'Prioritize Site Alpha for Phase 1 construction',
      score: 'Delta: +9.6 pts over Beta',
    },
    {
      q: 'What is the catchment coverage within a 15-minute isochrone?',
      source: 'Golden-Hour Isochrone Transit Network',
      a: 'A 500-bed hospital in Sector 52 captures 380,000 residents across the Mohali border and South Chandigarh within 15 minutes, absorbing 28% of current PGIMER outpatient traffic.',
      rec: 'Reduces PGIMER OPD load by ~2,800 patients/day',
      score: 'Catchment: 380k Citizens',
    },
    {
      q: 'Are there statutory clearance impediments on Site Alpha?',
      source: 'Chandigarh Master Plan 2031 & Forest Act',
      a: 'Site Alpha is designated as Public/Semi-Public institutional reserve under CMP 2031. No forest diversion required. Clear dual-carriageway access existing on Vikas Marg.',
      rec: 'No environmental red-flags detected. Statutory ready.',
      score: 'Clearance Risk: Minimal',
    },
  ];

  // Quick Module Links
  const quickLinks = [
    { name: '3D Spatial Twin', path: '/dashboard', icon: Layers, tag: 'Interactive 3D GIS', desc: 'WebGL 60FPS 3D buildings, dynamic rain/fog particle shaders, and live traffic.' },
    { name: 'Scenario Sandbox', path: '/simulation', icon: GitCompare, tag: 'Trade-off Engine', desc: 'Dynamic AHP weight configuration, side-by-side site trade-offs, and sensitivity curves.' },
    { name: 'Demographics & Health', path: '/analytics', icon: BarChart3, tag: '64 Sectors Mapped', desc: 'Sector-by-sector population density, hospital bed ratios, and healthcare gaps.' },
    { name: 'Spatial AI Copilot', path: '/assistant', icon: Bot, tag: 'Decision Support', desc: 'Cites official master plans, municipal registries, and golden-hour catchment data.' },
    { name: 'Executive Reports', path: '/reports', icon: FileText, tag: 'Dossier PDF', desc: 'One-click executive briefing PDFs with statutory checklists and radar charts.' },
    { name: 'Data & ML Pipeline', path: '/agents', icon: Cpu, tag: 'PostGIS / MCDA', desc: 'Inspect spatial processing pipeline, GeoJSON telemetry, and AHP scoring models.' },
  ];

  return (
    <div className="min-h-screen bg-apple-bg-light dark:bg-apple-bg-dark text-apple-text-primary-light dark:text-apple-text-primary-dark overflow-x-hidden font-sans selection:bg-apple-accent selection:text-white">
      {/* -------------------------------------------------------------
          1. HERO HEADER SECTION
      ------------------------------------------------------------- */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        {/* Soft Ambient Light Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-apple-accent/15 via-blue-400/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Apple Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-apple-accent/10 text-apple-accent border border-apple-accent/20 mb-6 shadow-apple-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span>Chandigarh Urban Digital Twin • Municipal Spatial Decision Intelligence</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark max-w-4xl mx-auto leading-[1.08]"
          >
            Predict before building.{' '}
            <span className="text-apple-accent block sm:inline">Smarter cities start here.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-apple-text-secondary-light dark:text-apple-text-secondary-dark max-w-2xl mx-auto mt-5 leading-relaxed font-normal"
          >
            If we compare multiple options before buying a ₹1 Lakh laptop, shouldn’t governments do the same before investing thousands of crores in public infrastructure?
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-semibold bg-apple-accent hover:bg-apple-accent-hover text-white shadow-apple-card hover:shadow-apple-glow-blue transition-all group flex items-center justify-center gap-2"
            >
              <span>Launch 3D Spatial Twin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/simulation"
              className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-medium border border-apple-border-light dark:border-apple-border-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-apple-text-primary-light dark:text-apple-text-primary-dark flex items-center justify-center gap-1.5"
            >
              <span>Scenario Sandbox</span>
              <ChevronRight className="w-4 h-4 text-apple-text-secondary-light" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. APPLE INTERACTIVE PRODUCT STUDIO (THE HERO SHOWCASE)
      ------------------------------------------------------------- */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="glass-card rounded-apple-2xl border border-apple-border-light dark:border-apple-border-dark shadow-apple-elevated overflow-hidden bg-white/90 dark:bg-[#161617]/90 backdrop-blur-2xl"
        >
          {/* Top Apple Studio Header & Interactive Segmented Switcher */}
          <div className="px-5 py-4 border-b border-apple-border-light dark:border-apple-border-dark flex flex-col lg:flex-row items-center justify-between gap-4 bg-black/[0.01] dark:bg-white/[0.02]">
            {/* Window Controls & Live State */}
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>
              <span className="text-xs font-mono font-medium text-apple-text-secondary-light dark:text-apple-text-secondary-dark flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>CHANDIGARH DIGITAL TWIN STUDIO</span>
              </span>
            </div>

            {/* Interactive 4-Tab Segmented Controller */}
            <div className="p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-apple-border-light dark:border-apple-border-dark flex items-center gap-1 overflow-x-auto max-w-full">
              {[
                { id: '3d-twin', label: '3D Spatial Twin', icon: Layers },
                { id: 'mcda', label: 'Live MCDA Simulator', icon: Sliders },
                { id: 'radar', label: 'Sector 360° Radar', icon: BarChart3 },
                { id: 'copilot', label: 'Spatial AI Copilot', icon: Bot },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeHeroTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHeroTab(tab.id as HeroTab)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-apple-accent text-white shadow-apple-card'
                        : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Launch Dedicated Workspace Button */}
            <Link
              to={activeHeroTab === '3d-twin' ? '/dashboard' : activeHeroTab === 'mcda' ? '/simulation' : activeHeroTab === 'radar' ? '/analytics' : '/assistant'}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-apple-accent hover:underline shrink-0"
            >
              <span>Full Screen Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Screen Body */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* -----------------------------------------------------------
                  TAB 1: 3D DIGITAL TWIN INTERACTIVE PREVIEW
              ----------------------------------------------------------- */}
              {activeHeroTab === '3d-twin' && (
                <motion.div
                  key="tab-3d-twin"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Interactive Map Visual Area */}
                  <div className="relative h-[360px] sm:h-[420px] rounded-apple-xl overflow-hidden border border-apple-border-light dark:border-apple-border-dark bg-gradient-to-b from-[#F5F5F7] to-[#E5E5EA] dark:from-[#1C1C1E] dark:to-[#000000] shadow-inner flex flex-col justify-between p-6">
                    {/* Simulated 3D Architectural City Grid Perspective */}
                    <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30">
                      <svg width="100%" height="100%" className="w-full h-full">
                        <defs>
                          <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-apple-accent/40" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#cityGrid)" />
                      </svg>
                    </div>

                    {/* Dynamic Simulated Weather Particle Overlays */}
                    {demoWeather === 'rain' && (
                      <div className="absolute inset-0 pointer-events-none bg-blue-900/10 backdrop-blur-[0.5px]">
                        <div className="w-full h-full animate-pulse opacity-70 bg-[radial-gradient(#0071E3_1px,transparent_1px)] [background-size:16px_16px]" />
                      </div>
                    )}
                    {demoWeather === 'fog' && (
                      <div className="absolute inset-0 pointer-events-none bg-slate-300/30 dark:bg-slate-700/30 backdrop-blur-sm transition-all" />
                    )}
                    {demoWeather === 'night' && (
                      <div className="absolute inset-0 pointer-events-none bg-blue-950/40 backdrop-blur-[0.2px] transition-all" />
                    )}

                    {/* Top Floating Mini HUD: Interactive Weather & Layers */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                      {/* Weather Switcher */}
                      <div className="p-1 rounded-full glass-panel border border-apple-border-light dark:border-apple-border-dark flex items-center gap-1 shadow-apple-card">
                        {[
                          { id: 'clear', label: 'Clear', icon: Sun },
                          { id: 'rain', label: 'Rain', icon: CloudRain },
                          { id: 'fog', label: 'Fog', icon: CloudFog },
                          { id: 'night', label: 'Night', icon: Moon },
                        ].map((w) => {
                          const Icon = w.icon;
                          const active = demoWeather === w.id;
                          return (
                            <button
                              key={w.id}
                              onClick={() => setDemoWeather(w.id as WeatherState)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                                active
                                  ? 'bg-apple-accent text-white shadow-apple-subtle'
                                  : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light hover:bg-black/5 dark:hover:bg-white/10'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{w.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Layer Switches */}
                      <div className="flex items-center gap-1.5 glass-panel p-1 rounded-full border border-apple-border-light dark:border-apple-border-dark shadow-apple-card text-xs">
                        <button
                          onClick={() => setDemo3DBuildings(!demo3DBuildings)}
                          className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                            demo3DBuildings ? 'bg-apple-accent/15 text-apple-accent font-semibold' : 'text-apple-text-secondary-light hover:bg-black/5'
                          }`}
                        >
                          3D Buildings {demo3DBuildings ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => setDemoIsochrones(!demoIsochrones)}
                          className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                            demoIsochrones ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold' : 'text-apple-text-secondary-light hover:bg-black/5'
                          }`}
                        >
                          15-Min Rings {demoIsochrones ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => setDemoTraffic(!demoTraffic)}
                          className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                            demoTraffic ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-apple-text-secondary-light hover:bg-black/5'
                          }`}
                        >
                          Live Traffic {demoTraffic ? '✓' : ''}
                        </button>
                      </div>
                    </div>

                    {/* Center Spatial Graphic representation */}
                    <div className="relative z-10 flex-1 flex items-center justify-center">
                      <div className="text-center space-y-2 p-4 rounded-apple-xl glass-panel border border-apple-border-light dark:border-apple-border-dark shadow-apple-card max-w-sm">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACTIVE FOCUS: {demoActiveCamera === 'sec52' ? 'SITE ALPHA (SECTOR 52)' : demoActiveCamera === 'pgimer' ? 'PGIMER (SECTOR 12)' : 'GMCH (SECTOR 32)'}</span>
                        </div>
                        <div className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                          {demoActiveCamera === 'sec52'
                            ? 'Maloya Peripheral Cluster • 140,000 citizens in 4.2 km healthcare gap'
                            : demoActiveCamera === 'pgimer'
                            ? 'Tertiary Medical Institute • 10,000+ OPD visits daily • Bed Deficit'
                            : 'South Regional Hospital • 112% Occupancy • Core South Hub'}
                        </div>
                        <div className="text-[10px] font-mono text-apple-text-tertiary">
                          Coordinates: 30.7333° N, 76.7794° E • WebGL 60FPS
                        </div>
                      </div>
                    </div>

                    {/* Bottom Camera Fly Quick Controls */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-apple-text-tertiary uppercase tracking-wider mr-1">
                          Fly Camera:
                        </span>
                        <button
                          onClick={() => setDemoActiveCamera('sec52')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            demoActiveCamera === 'sec52'
                              ? 'bg-emerald-500 text-white shadow-apple-subtle'
                              : 'glass-panel text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5'
                          }`}
                        >
                          Sector 52 (Top Pick)
                        </button>
                        <button
                          onClick={() => setDemoActiveCamera('pgimer')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            demoActiveCamera === 'pgimer'
                              ? 'bg-apple-accent text-white shadow-apple-subtle'
                              : 'glass-panel text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5'
                          }`}
                        >
                          PGIMER (Sec 12)
                        </button>
                        <button
                          onClick={() => setDemoActiveCamera('gmch')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            demoActiveCamera === 'gmch'
                              ? 'bg-apple-accent text-white shadow-apple-subtle'
                              : 'glass-panel text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5'
                          }`}
                        >
                          GMCH (Sec 32)
                        </button>
                      </div>

                      <Link
                        to="/dashboard"
                        className="px-4 py-1.5 rounded-full bg-apple-accent hover:bg-apple-accent-hover text-white text-xs font-semibold shadow-apple-card flex items-center gap-1.5 transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Open 3D Twin View</span>
                      </Link>
                    </div>
                  </div>

                  {/* Feature Telemetry Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                    <div className="p-3.5 rounded-apple-lg border border-apple-border-light dark:border-apple-border-dark glass-card">
                      <div className="text-[11px] text-apple-text-secondary-light font-medium">Mapped Sectors</div>
                      <div className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">64 Grid Sectors</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">100% Chandigarh UT</div>
                    </div>
                    <div className="p-3.5 rounded-apple-lg border border-apple-border-light dark:border-apple-border-dark glass-card">
                      <div className="text-[11px] text-apple-text-secondary-light font-medium">Render Engine</div>
                      <div className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">WebGL / 60 FPS</div>
                      <div className="text-[10px] text-apple-accent font-medium">3D Extruded Heights</div>
                    </div>
                    <div className="p-3.5 rounded-apple-lg border border-apple-border-light dark:border-apple-border-dark glass-card">
                      <div className="text-[11px] text-apple-text-secondary-light font-medium">Atmosphere Shaders</div>
                      <div className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">4 Conditions</div>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Clear, Rain, Fog, Night</div>
                    </div>
                    <div className="p-3.5 rounded-apple-lg border border-apple-border-light dark:border-apple-border-dark glass-card">
                      <div className="text-[11px] text-apple-text-secondary-light font-medium">Traffic Model</div>
                      <div className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">Live Avenues</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Jan Marg & Madhya Marg</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* -----------------------------------------------------------
                  TAB 2: REAL-TIME MCDA WEIGHT SIMULATOR
              ----------------------------------------------------------- */}
              {activeHeroTab === 'mcda' && (
                <motion.div
                  key="tab-mcda"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Dynamic Draggable Weight Sliders */}
                    <div className="lg:col-span-6 space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-apple-accent uppercase tracking-wider">
                          Interactive Weight Sliders
                        </span>
                        <button
                          onClick={() => {
                            setWeightPop(0.35);
                            setWeightGap(0.30);
                            setWeightAccess(0.20);
                            setWeightLand(0.15);
                          }}
                          className="text-[11px] text-apple-text-secondary-light hover:text-apple-accent flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Baseline</span>
                        </button>
                      </div>

                      {/* Slider 1: Population Demand */}
                      <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-apple-text-primary-light dark:text-apple-text-primary-dark">Population Demand Weight:</span>
                          <span className="font-mono text-apple-accent font-bold">{Math.round(weightPop * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.10"
                          max="0.60"
                          step="0.05"
                          value={weightPop}
                          onChange={(e) => setWeightPop(parseFloat(e.target.value))}
                          className="w-full accent-apple-accent cursor-pointer h-2"
                        />
                        <div className="text-[10px] text-apple-text-secondary-light">
                          Prioritizes sectors with dense, unserved population clusters.
                        </div>
                      </div>

                      {/* Slider 2: Healthcare Desert Gap */}
                      <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-apple-text-primary-light dark:text-apple-text-primary-dark">Healthcare Desert Gap (Distance):</span>
                          <span className="font-mono text-apple-accent font-bold">{Math.round(weightGap * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.10"
                          max="0.60"
                          step="0.05"
                          value={weightGap}
                          onChange={(e) => setWeightGap(parseFloat(e.target.value))}
                          className="w-full accent-apple-accent cursor-pointer h-2"
                        />
                        <div className="text-[10px] text-apple-text-secondary-light">
                          Rewards sites furthest from existing hospitals (PGIMER, GMCH 32, GMSH 16).
                        </div>
                      </div>

                      {/* Slider 3: Road & Transit Access */}
                      <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-apple-text-primary-light dark:text-apple-text-primary-dark">Road & Transit Connectivity:</span>
                          <span className="font-mono text-apple-accent font-bold">{Math.round(weightAccess * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.40"
                          step="0.05"
                          value={weightAccess}
                          onChange={(e) => setWeightAccess(parseFloat(e.target.value))}
                          className="w-full accent-apple-accent cursor-pointer h-2"
                        />
                        <div className="text-[10px] text-apple-text-secondary-light">
                          Dual carriageway, PR-7 expressway, and bus terminal reach.
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Dynamic Candidate Site Scores */}
                    <div className="lg:col-span-6 space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-apple-text-secondary-light uppercase tracking-wider">
                          Real-Time Candidate Site Rankings
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Dynamic MCDA Active
                        </span>
                      </div>

                      {candidateScores.map((c, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-apple-xl border transition-all ${
                            i === 0
                              ? 'bg-apple-accent/10 border-apple-accent shadow-apple-card'
                              : 'glass-card border-apple-border-light dark:border-apple-border-dark'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                                  i === 0 ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                              >
                                #{c.rank}
                              </span>
                              <strong className="text-xs text-apple-text-primary-light dark:text-apple-text-primary-dark font-semibold">
                                {c.name}
                              </strong>
                            </div>
                            <span className="font-mono font-bold text-sm text-apple-text-primary-light dark:text-apple-text-primary-dark">
                              {c.score} <span className="text-xs font-normal text-apple-text-tertiary">/ 100</span>
                            </span>
                          </div>

                          {/* Dynamic Progress Bar */}
                          <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mb-2">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: c.color }}
                              animate={{ width: `${c.score}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>

                          <div className="flex justify-between text-[11px] text-apple-text-secondary-light">
                            <span>Parcel: {c.acres}</span>
                            <span>Catchment: {c.popCatchment}</span>
                          </div>
                        </div>
                      ))}

                      <Link
                        to="/simulation"
                        className="w-full py-2.5 rounded-full bg-apple-accent hover:bg-apple-accent-hover text-white text-xs font-semibold shadow-apple-subtle flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Open Scenario Sandbox Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* -----------------------------------------------------------
                  TAB 3: SECTOR 360° RADAR & HEALTH EQUITY
              ----------------------------------------------------------- */}
              {activeHeroTab === 'radar' && (
                <motion.div
                  key="tab-radar"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Sector Selection Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                      { id: 'sec52', label: 'Sector 52 (Maloya Border)' },
                      { id: 'sec12', label: 'Sector 12 (PGIMER Hub)' },
                      { id: 'sec32', label: 'Sector 32 (GMCH Hub)' },
                      { id: 'sec43', label: 'Sector 43 (ISBT South)' },
                    ].map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedRadarSector(sec.id as any)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          selectedRadarSector === sec.id
                            ? 'bg-apple-accent text-white shadow-apple-subtle'
                            : 'glass-panel text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5'
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                    {/* Left: Sector Metrics Dossier */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-apple-accent uppercase tracking-wider">
                          {sectorRadarConfigs[selectedRadarSector].zone}
                        </div>
                        <h3 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                          {sectorRadarConfigs[selectedRadarSector].name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark">
                          <span className="text-apple-text-secondary-light">Population:</span>
                          <div className="text-base font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                            {sectorRadarConfigs[selectedRadarSector].pop}
                          </div>
                        </div>
                        <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark">
                          <span className="text-apple-text-secondary-light">Density:</span>
                          <div className="text-base font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                            {sectorRadarConfigs[selectedRadarSector].density}
                          </div>
                        </div>
                        <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark">
                          <span className="text-apple-text-secondary-light">Nearest Tertiary:</span>
                          <div className="text-sm font-bold text-red-500">
                            {sectorRadarConfigs[selectedRadarSector].gapKm}
                          </div>
                        </div>
                        <div className="p-3 rounded-apple-md glass-card border border-apple-border-light dark:border-apple-border-dark">
                          <span className="text-apple-text-secondary-light">15-Min Catchment:</span>
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {sectorRadarConfigs[selectedRadarSector].reach15m}
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-apple-lg bg-apple-accent/10 border border-apple-accent/20 text-xs text-apple-text-primary-light dark:text-apple-text-primary-dark leading-relaxed">
                        <strong>AI Spatial Verdict:</strong> {sectorRadarConfigs[selectedRadarSector].verdict}
                      </div>
                    </div>

                    {/* Right: Dynamic Radar Chart */}
                    <div className="lg:col-span-7 h-72 sm:h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={sectorRadarConfigs[selectedRadarSector].radar}>
                          <PolarGrid stroke="rgba(128,128,128,0.2)" />
                          <PolarAngleAxis dataKey="factor" tick={{ fill: '#86868B', fontSize: 11, fontWeight: 600 }} />
                          <PolarRadiusAxis domain={[0, 100]} stroke="rgba(128,128,128,0.2)" tick={false} />
                          <Radar
                            name={sectorRadarConfigs[selectedRadarSector].name}
                            dataKey="score"
                            stroke="#0071E3"
                            fill="#0071E3"
                            fillOpacity={0.35}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* -----------------------------------------------------------
                  TAB 4: SPATIAL AI COPILOT DIALOGUE SIMULATOR
              ----------------------------------------------------------- */}
              {activeHeroTab === 'copilot' && (
                <motion.div
                  key="tab-copilot"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-left"
                >
                  <div className="text-center max-w-xl mx-auto space-y-1">
                    <span className="text-xs font-bold text-apple-accent uppercase tracking-wider">
                      Interactive Query Simulator
                    </span>
                    <h3 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                      Click a municipal query to simulate AI Copilot reasoning
                    </h3>
                  </div>

                  {/* Clickable Prompt Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {copilotPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActivePromptIdx(idx);
                          setIsTyping(true);
                          setTimeout(() => setIsTyping(false), 200);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          activePromptIdx === idx
                            ? 'bg-apple-accent text-white shadow-apple-subtle font-semibold'
                            : 'glass-panel text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5'
                        }`}
                      >
                        {p.q}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Dialogue Card */}
                  <div className="max-w-3xl mx-auto p-6 rounded-apple-2xl glass-card border border-apple-border-light dark:border-apple-border-dark space-y-4">
                    {/* User Question */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                        MP
                      </div>
                      <div className="p-3 rounded-apple-lg bg-black/5 dark:bg-white/5 text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark flex-1">
                        &ldquo;{copilotPrompts[activePromptIdx].q}&rdquo;
                      </div>
                    </div>

                    {/* Copilot Answer */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-apple-accent text-white flex items-center justify-center shrink-0 shadow-apple-subtle">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="p-4 rounded-apple-lg bg-apple-accent/5 border border-apple-accent/20 text-xs text-apple-text-primary-light dark:text-apple-text-primary-dark leading-relaxed">
                          <div className="text-[10px] text-apple-accent font-mono font-semibold mb-1">
                            SOURCE: {copilotPrompts[activePromptIdx].source}
                          </div>
                          {copilotPrompts[activePromptIdx].a}
                        </div>

                        {/* Recommendation Pill */}
                        <div className="p-3 rounded-apple-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <span>
                            <strong>Decision Output:</strong> {copilotPrompts[activePromptIdx].rec}
                          </span>
                          <span className="font-mono text-[11px] font-bold">
                            {copilotPrompts[activePromptIdx].score}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <Link
                        to="/assistant"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-accent hover:underline"
                      >
                        <span>Launch Full Autonomous Copilot Conversation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------
          3. INTERACTIVE BEFORE VS. AFTER (APPLE COMPARISON SLIDER)
      ------------------------------------------------------------- */}
      <section className="py-20 border-t border-apple-border-light dark:border-apple-border-dark bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-bold text-apple-accent uppercase tracking-widest">
              PARADIGM SHIFT
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark">
              Traditional Master Planning vs. CityTwin AI
            </h2>
            <p className="text-apple-text-secondary-light text-sm sm:text-base max-w-2xl mx-auto">
              Compare how municipal capital investments of ₹500+ Crores have historically been decided versus real-time spatial intelligence.
            </p>
          </div>

          {/* Interactive Toggle */}
          <div className="inline-flex p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-apple-border-light dark:border-apple-border-dark">
            <button
              onClick={() => setComparisonMode('traditional')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                comparisonMode === 'traditional'
                  ? 'bg-red-500 text-white shadow-apple-subtle'
                  : 'text-apple-text-secondary-light hover:text-apple-text-primary-light'
              }`}
            >
              Legacy Municipal Approach
            </button>
            <button
              onClick={() => setComparisonMode('citytwin')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                comparisonMode === 'citytwin'
                  ? 'bg-apple-accent text-white shadow-apple-subtle'
                  : 'text-apple-text-secondary-light hover:text-apple-text-primary-light'
              }`}
            >
              CityTwin AI Spatial Platform
            </button>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Card 1: Time & Velocity */}
            <div className={`p-6 rounded-apple-2xl border transition-all ${
              comparisonMode === 'traditional'
                ? 'bg-red-500/5 border-red-500/30'
                : 'bg-emerald-500/5 border-emerald-500/30'
            }`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-apple-text-tertiary mb-1">
                EVALUATION VELOCITY
              </div>
              <h4 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark mb-2">
                {comparisonMode === 'traditional' ? '18 to 24 Months of Surveys' : 'Sub-Second Real-Time Scenarios'}
              </h4>
              <p className="text-xs text-apple-text-secondary-light leading-relaxed">
                {comparisonMode === 'traditional'
                  ? 'Static consultant reports, manual paper surveys, and outdated municipal censuses take over a year to assemble, becoming obsolete before construction begins.'
                  : 'Adjust weights across population demand, transit time, and land availability instantly. The AHP engine recalculates site feasibility in milliseconds.'}
              </p>
            </div>

            {/* Card 2: Explainability & Audit Trail */}
            <div className={`p-6 rounded-apple-2xl border transition-all ${
              comparisonMode === 'traditional'
                ? 'bg-red-500/5 border-red-500/30'
                : 'bg-emerald-500/5 border-emerald-500/30'
            }`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-apple-text-tertiary mb-1">
                PUBLIC ACCOUNTABILITY
              </div>
              <h4 className="text-xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark mb-2">
                {comparisonMode === 'traditional' ? 'Subjective Discretionary Decisions' : '100% Explainable Mathematical Scoring'}
              </h4>
              <p className="text-xs text-apple-text-secondary-light leading-relaxed">
                {comparisonMode === 'traditional'
                  ? 'Sites are often chosen without auditable scoring metrics, resulting in healthcare facilities built where land is cheap rather than where citizens need it.'
                  : 'Every recommendation is backed by a 5-dimension radar breakdown, Golden-Hour isochrone radii, and auditable official census datasets.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. INTERACTIVE 15-MIN ISOCHRONE MATRIX
      ------------------------------------------------------------- */}
      <section className="py-20 border-t border-apple-border-light dark:border-apple-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-apple-2xl p-8 sm:p-12 border border-apple-border-light dark:border-apple-border-dark flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Emergency Golden-Hour GIS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                Interactive 5 / 10 / 15-Minute Catchment Matrix
              </h3>
              <p className="text-xs sm:text-sm text-apple-text-secondary-light leading-relaxed">
                Click different transit thresholds to simulate how many citizens reach Site Alpha (Sector 52) during medical emergencies across the Chandigarh-Mohali corridor.
              </p>

              {/* Minute Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setIsochroneMinutes(mins as any)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isochroneMinutes === mins
                        ? 'bg-purple-600 text-white shadow-apple-card'
                        : 'glass-panel text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5'
                    }`}
                  >
                    {mins} Minutes Transit
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Telemetry Display */}
            <div className="p-6 rounded-apple-xl bg-purple-500/10 border border-purple-500/30 text-left min-w-[300px] sm:min-w-[360px] space-y-3">
              <div className="flex justify-between items-center text-xs text-purple-700 dark:text-purple-300 font-semibold">
                <span>CATCHMENT POPULATION CAPTURED</span>
                <span className="font-mono">{isochroneMinutes}m Ring</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-apple-text-primary-light dark:text-apple-text-primary-dark font-mono">
                {isochroneMinutes === 5 ? '120,000' : isochroneMinutes === 10 ? '285,000' : '380,000'}
                <span className="text-sm font-normal text-apple-text-secondary-light ml-1">Citizens</span>
              </div>
              <div className="text-xs text-apple-text-secondary-light pt-2 border-t border-purple-500/20">
                {isochroneMinutes === 5
                  ? 'Immediate neighborhood coverage: Sec 52, Maloya Rehabilitation colony, Kajheri.'
                  : isochroneMinutes === 10
                  ? 'Expanded South reach: Sec 43, 44, 51, and Phase 11 Mohali border transit.'
                  : 'Inter-state emergency radius: South Chandigarh, Mohali, and Dhanas peripheral corridor.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          5. DEDICATED WORKSPACES DIRECT NAVIGATION
      ------------------------------------------------------------- */}
      <section className="py-20 border-t border-apple-border-light dark:border-apple-border-dark bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
              Dive into Dedicated Workspaces
            </h3>
            <p className="text-apple-text-secondary-light text-sm">
              Each specialized module provides high-density analytics tailored for municipal engineers and decision-makers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="glass-card rounded-apple-xl p-6 border border-apple-border-light dark:border-apple-border-dark hover:border-apple-accent hover:shadow-apple-card-hover transition-all cursor-pointer group flex flex-col justify-between text-left"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-apple-sm bg-apple-accent/10 text-apple-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-apple-text-primary-light dark:text-apple-text-primary-dark">
                        {item.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-apple-accent">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-apple-border-light dark:border-apple-border-dark flex items-center justify-between text-xs font-semibold text-apple-accent">
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. FOOTER
      ------------------------------------------------------------- */}
      <footer className="py-10 border-t border-apple-border-light dark:border-apple-border-dark bg-white/50 dark:bg-black/50 text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">
              CityTwin AI
            </span>
            <span>•</span>
            <span>Chandigarh Urban Digital Twin Platform</span>
          </div>
          <div className="font-mono text-[11px]">
            Primary GIS: EPSG:4326 • Le Corbusier 64-Sector Orthogonal Grid
          </div>
        </div>
      </footer>
    </div>
  );
};
