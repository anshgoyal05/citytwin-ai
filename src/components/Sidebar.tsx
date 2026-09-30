import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Globe,
  LayoutDashboard,
  Bot,
  GitCompare,
  Cpu,
  BarChart3,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/', label: 'Overview', icon: Globe },
    { path: '/dashboard', label: '3D Spatial Twin', icon: LayoutDashboard },
    { path: '/simulation', label: 'Scenario Comparison', icon: GitCompare },
    { path: '/analytics', label: 'Demographics & Health', icon: BarChart3 },
    { path: '/reports', label: 'Executive Reports', icon: FileText },
    { path: '/assistant', label: 'Spatial AI Copilot', icon: Bot },
    { path: '/agents', label: 'Pipeline & ML Models', icon: Cpu },
  ];

  return (
    <aside className="w-16 hover:w-56 transition-all duration-300 bg-white/85 backdrop-blur-2xl border-r border-black/10 flex flex-col justify-between p-3 z-40 group shadow-apple-sm text-slate-800">
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2 py-1 text-blue-600">
          <Layers className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <span className="font-sans text-xs font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-slate-900">
            CHANDIGARH TWIN
          </span>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-apple-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-2.5 bg-black/5 rounded-2xl border border-black/10 text-[11px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
        <div className="font-bold text-emerald-600 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>GIS PostGIS Ready</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">UT Admin Data Active</div>
      </div>
    </aside>
  );
};
