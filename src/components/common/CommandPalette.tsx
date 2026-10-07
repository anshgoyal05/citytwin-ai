import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Layers,
  GitCompare,
  BarChart3,
  FileText,
  Bot,
  Cpu,
  Home,
  Navigation,
  CloudRain,
  Car,
  X,
  Sparkles,
  Command,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { flyToLocation, toggleLayer, setSelectedSector, sectors, candidateSites } = useCity();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const navigationActions = [
    {
      title: '3D Spatial Twin & Digital Simulation',
      subtitle: 'Interactive 64-sector grid with 3D buildings, live traffic & weather',
      icon: <Layers className="w-4 h-4 text-apple-accent" />,
      action: () => { onClose(); navigate('/dashboard'); },
    },
    {
      title: 'Scenario Comparison & Trade-off Sandbox',
      subtitle: 'Compare candidate hospital sites side-by-side with radar charts',
      icon: <GitCompare className="w-4 h-4 text-purple-500" />,
      action: () => { onClose(); navigate('/simulation'); },
    },
    {
      title: 'Demographics & Health Equity Analytics',
      subtitle: '64-sector census population, beds/1k ratio & underserved gap index',
      icon: <BarChart3 className="w-4 h-4 text-red-500" />,
      action: () => { onClose(); navigate('/analytics'); },
    },
    {
      title: 'Executive Municipal Reports',
      subtitle: 'Print-ready feasibility dossier formatted for planning committees',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      action: () => { onClose(); navigate('/reports'); },
    },
    {
      title: 'Spatial AI Copilot',
      subtitle: 'Conversational multi-criteria decision assistant grounded in GIS',
      icon: <Bot className="w-4 h-4 text-emerald-500" />,
      action: () => { onClose(); navigate('/assistant'); },
    },
    {
      title: 'Data & Autonomous ML Pipeline',
      subtitle: 'PostGIS spatial database telemetry, Voronoi isochrones & AHP weights',
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
      action: () => { onClose(); navigate('/agents'); },
    },
    {
      title: 'Platform Overview & Strategy Showcase',
      subtitle: 'Return to Apple-grade command center overview',
      icon: <Home className="w-4 h-4 text-gray-500" />,
      action: () => { onClose(); navigate('/'); },
    },
  ];

  const cameraPresets = [
    {
      title: 'Fly to Top Pick: Sector 52 (Site Alpha)',
      subtitle: 'Score: 86.8 / 100 • Maloya Growth Corridor',
      icon: <Navigation className="w-4 h-4 text-emerald-500" />,
      action: () => {
        onClose();
        navigate('/dashboard');
        setTimeout(() => flyToLocation(76.7325, 30.7185, 15.2, 58), 200);
      },
    },
    {
      title: 'Fly to PGIMER Research Hub (Sector 12)',
      subtitle: '1,948 Tertiary Beds • Regional Medical Epicenter',
      icon: <Navigation className="w-4 h-4 text-blue-500" />,
      action: () => {
        onClose();
        navigate('/dashboard');
        setTimeout(() => flyToLocation(76.7765, 30.7645, 15.0, 60), 200);
      },
    },
    {
      title: 'Fly to GMCH 32 Regional Center',
      subtitle: '800 Beds • South Corridor Trauma Care',
      icon: <Navigation className="w-4 h-4 text-indigo-500" />,
      action: () => {
        onClose();
        navigate('/dashboard');
        setTimeout(() => flyToLocation(76.7925, 30.7085, 15.0, 60), 200);
      },
    },
    {
      title: 'Reset to Full Chandigarh Grid Overview',
      subtitle: 'Le Corbusier 64-sector orthogonal master plan view',
      icon: <Navigation className="w-4 h-4 text-slate-500" />,
      action: () => {
        onClose();
        navigate('/dashboard');
        setTimeout(() => flyToLocation(76.7794, 30.7333, 12.4, 52), 200);
      },
    },
  ];

  // Search filtered items
  const allItems = [...navigationActions, ...cameraPresets];
  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-apple-surface-dark border border-apple-border-light dark:border-apple-border-dark rounded-apple-2xl shadow-apple-elevated overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-apple-border-light dark:border-apple-border-dark flex items-center space-x-3">
          <Search className="w-4 h-4 text-apple-text-secondary-light dark:text-apple-text-secondary-dark flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, navigate module, or fly to sector... (ESC to close)"
            className="flex-1 bg-transparent border-none text-sm text-apple-text-primary-light dark:text-apple-text-primary-dark placeholder-apple-text-tertiary focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-secondary-light"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-2 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-apple-text-tertiary uppercase tracking-wider">
            Quick Actions & Modules
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-apple-text-secondary-light">
              No actions found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-apple-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-apple-sm bg-black/5 dark:bg-white/5 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-apple-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  Enter ↵
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer Shortcut Info */}
        <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-apple-border-light dark:border-apple-border-dark flex items-center justify-between text-[11px] text-apple-text-tertiary">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center space-x-1">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
