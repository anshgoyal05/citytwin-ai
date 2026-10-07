import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Clear any stale recon_theme dark setting
    if (localStorage.getItem('recon_theme') === 'dark') {
      localStorage.removeItem('recon_theme');
    }

    const stored = localStorage.getItem('citytwin_theme');
    if (stored === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('citytwin_theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('citytwin_theme', 'light');
      setIsDark(false);
      window.dispatchEvent(new CustomEvent('theme-change', { detail: 'light' }));
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('citytwin_theme', 'dark');
      setIsDark(true);
      window.dispatchEvent(new CustomEvent('theme-change', { detail: 'dark' }));
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-apple-text-secondary-light dark:text-apple-text-secondary-dark"
      aria-label="Toggle Dark Mode"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-apple-text-primary-light hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
