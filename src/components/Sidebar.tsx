import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Bot,
  GitCompare,
  Cpu,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const menuItems = [
    { path: '/', label: 'Overview', icon: Sparkles },
    { path: '/dashboard', label: '3D Spatial Twin', icon: Layers },
    { path: '/simulation', label: 'Scenario Comparison', icon: GitCompare },
    { path: '/analytics', label: 'Demographics & Health', icon: BarChart3 },
    { path: '/reports', label: 'Executive Reports', icon: FileText },
    { path: '/assistant', label: 'Spatial AI Copilot', icon: Bot },
    { path: '/agents', label: 'Pipeline & ML Models', icon: Cpu },
  ];

  return (
    <aside
      className={`h-full transition-all duration-300 glass-nav border-r border-apple-border-light dark:border-apple-border-dark flex flex-col justify-between p-3 z-30 shadow-apple-subtle shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="space-y-4">
        {/* Header with Minimize Toggle (< or >) */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2.5 text-apple-accent truncate">
            <Layers className="w-5 h-5 flex-shrink-0 animate-pulse" />
            {!isCollapsed && (
              <span className="font-sans text-xs font-bold tracking-wider text-apple-text-primary-light dark:text-apple-text-primary-dark truncate">
                CHANDIGARH TWIN
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-apple-sm text-apple-text-secondary-light hover:text-apple-text-primary-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand Navigation (>)' : 'Minimize Navigation (<)'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-apple-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-apple-accent text-white shadow-apple-subtle font-semibold'
                      : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Badge */}
      {!isCollapsed ? (
        <div className="p-3 bg-black/[0.03] dark:bg-white/[0.03] rounded-apple-md border border-apple-border-light dark:border-apple-border-dark text-[11px] font-sans space-y-1">
          <div className="font-semibold text-emerald-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GIS Engine Active</span>
          </div>
          <div className="text-[10px] text-apple-text-tertiary">
            UT Admin Primary Data (64 Sectors)
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-2" title="GIS PostGIS Active">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </aside>
  );
};
