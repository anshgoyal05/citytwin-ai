import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import {
  Cpu,
  Command,
  Sparkles,
  Layers,
  GitCompare,
  BarChart3,
  FileText,
  Bot,
  HeartPulse,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from './common/ThemeToggle';
import { CommandPalette } from './common/CommandPalette';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { summaryMetrics } = useCity();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Overview', icon: Sparkles },
    { path: '/dashboard', label: '3D Twin', icon: Layers },
    { path: '/simulation', label: 'Scenarios', icon: GitCompare },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/assistant', label: 'Copilot', icon: Bot },
    { path: '/agents', label: 'Agents', icon: Cpu },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo & Brand matching Apple.com simplicity */}
          <div className="flex items-center space-x-6 shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-apple-sm bg-apple-text-primary-light dark:bg-white flex items-center justify-center text-white dark:text-black shadow-apple-subtle group-hover:scale-105 transition-transform shrink-0">
                <Cpu className="w-4 h-4 text-apple-accent" />
              </div>
              <div className="flex flex-col shrink-0">
                <span className="font-semibold text-sm tracking-tight text-apple-text-primary-light dark:text-apple-text-primary-dark whitespace-nowrap">
                  CityTwin <span className="text-apple-accent">AI</span>
                </span>
                <span className="text-[9px] tracking-wider text-apple-text-secondary-light dark:text-apple-text-secondary-dark uppercase font-medium whitespace-nowrap">
                  Chandigarh UT
                </span>
              </div>
            </Link>

            {/* Primary Desktop Navigation Links (Clean Apple.com Horizontal Bar) */}
            <nav className="hidden lg:flex items-center space-x-1 shrink-0">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'bg-apple-accent text-white shadow-apple-subtle font-semibold'
                        : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Medium screen condensed navigation (tablets) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1 shrink-0">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-apple-accent text-white font-semibold shadow-apple-subtle'
                      : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Live Telemetry Pill */}
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-apple-border-light dark:border-apple-border-dark text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark font-mono whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">64 Sectors</span>
              <span className="text-apple-border-light dark:text-apple-border-dark shrink-0">•</span>
              <span className="text-apple-accent font-semibold whitespace-nowrap">{summaryMetrics.avgBedsPer1000} Beds/1k</span>
            </div>

            {/* Command Palette Trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors border border-apple-border-light dark:border-apple-border-dark shadow-apple-subtle whitespace-nowrap shrink-0"
              title="Command Palette (⌘K)"
            >
              <Command className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px] font-mono">⌘K</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-apple-border-light dark:border-apple-border-dark bg-white/95 dark:bg-[#161617]/95 backdrop-blur-2xl px-4 py-4 space-y-1 shadow-apple-card transition-all">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-apple-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-apple-accent text-white font-semibold'
                      : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 text-apple-text-primary-light dark:text-apple-text-primary-dark'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};
