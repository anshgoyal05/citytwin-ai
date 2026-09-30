/**
 * CityTwin AI — Apple-Grade Design System Tokens
 * Human Interface Guidelines compliant:
 * Neutral monochromatic tones, precise contrast, progressive shadows,
 * authentic glassmorphism blur filters, and fluid spring curves.
 */

export const tokens = {
  colors: {
    // Canvas & backgrounds
    canvas: '#f5f5f7',
    canvasSecondary: '#ffffff',
    canvasDark: '#000000',
    canvasDarkSecondary: '#1c1c1e',

    // Apple Neutral Grays
    labelPrimary: '#1d1d1f',
    labelSecondary: '#86868b',
    labelTertiary: '#aeaeb2',
    labelQuaternary: '#d1d1d6',

    // System Accents
    blue: {
      default: '#0071e3',
      hover: '#0077ed',
      light: '#e8f2fd',
      border: 'rgba(0, 113, 227, 0.2)',
    },
    emerald: {
      default: '#34c759',
      light: '#eafaf0',
    },
    indigo: {
      default: '#5856d6',
      light: '#eeedf9',
    },
    amber: {
      default: '#ff9500',
      light: '#fff6e8',
    },
    red: {
      default: '#ff3b30',
      light: '#feebea',
    },
    purple: {
      default: '#af52de',
      light: '#f7eeff',
    },

    // Borders & Glass
    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderMedium: 'rgba(0, 0, 0, 0.14)',
    borderDarkSubtle: 'rgba(255, 255, 255, 0.12)',
    glassBg: 'rgba(255, 255, 255, 0.82)',
    glassDarkBg: 'rgba(28, 28, 30, 0.85)',
  },

  radii: {
    sm: '0.625rem',   // 10px
    md: '0.875rem',   // 14px
    lg: '1.25rem',    // 20px
    xl: '1.75rem',    // 28px
    full: '9999px',
  },

  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.04)',
    card: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
    elevated: '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)',
    glow: '0 0 24px rgba(0, 113, 227, 0.25)',
  },

  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", sans-serif',
    mono: '"SF Mono", Menlo, Monaco, "Courier New", monospace',
  },

  transitions: {
    spring: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'all 0.25s ease-out',
  }
} as const;
