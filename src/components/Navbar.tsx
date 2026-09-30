import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import {
  Sparkles,
  Layers,
  HeartPulse,
  Building,
  Activity,
  Cpu,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { summaryMetrics, selectedCity } = useCity();

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/dashboard', label: '3D Twin' },
    { path: '/simulation', label: 'Scenario Sandbox' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/reports', label: 'Executive Reports' },
    { path: '/assistant', label: 'AI Assistant' },
    { path: '/agents', label: 'Data & ML Agents' },
  ];

  return (
    <header className="h-14 bg-white/85 backdrop-blur-2xl border-b border-black/10 px-4 md:px-6 flex items-center justify-between z-50 sticky top-0 shadow-apple-sm text-slate-900 font-sans">
      {/* Brand Title & City Scope */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-apple-sm">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-slate-900">
              CityTwin <span className="text-blue-600">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              CHANDIGARH PROTOTYPE
            </span>
          </div>
        </Link>

        {/* City Scope Indicator */}
        <div className="hidden md:flex items-center pl-3 border-l border-black/10">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full border border-black/10 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Chandigarh (64 Sectors)</span>
          </div>
        </div>
      </div>

      {/* Main Nav Items (Pill Style) */}
      <nav className="hidden lg:flex items-center bg-black/5 p-1 rounded-full border border-black/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-apple-sm font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Quick Summary Pill & Status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 text-xs text-blue-900">
          <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">Beds/1k Pop:</span>
          <span className="font-black text-blue-700">{summaryMetrics.avgBedsPer1000}</span>
        </div>

        <Link
          to="/dashboard"
          className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-apple-sm transition-all hover:scale-105"
        >
          Open 3D Twin
        </Link>
      </div>
    </header>
  );
};
