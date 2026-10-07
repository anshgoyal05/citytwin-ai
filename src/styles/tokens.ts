/**
 * CityTwin AI — Design System Tokens
 * Replicating Recon-Bot Design Architecture:
 * Apple HIG-compliant neutral monochromatic tones, glassmorphism blur filters,
 * dual-mode color scales, high-contrast typography, and fluid spring curves.
 */

export const tokens = {
  colors: {
    // Canvas & backgrounds
    bgLight: '#FBFBFD',
    bgDark: '#000000',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#161617',
    surfaceElevatedLight: '#FFFFFF',
    surfaceElevatedDark: '#1D1D1F',

    // Text hierarchy
    textPrimaryLight: '#1D1D1F',
    textPrimaryDark: '#F5F5F7',
    textSecondaryLight: '#6E6E73',
    textSecondaryDark: '#86868B',
    textTertiaryLight: '#A1A1A6',
    textTertiaryDark: '#6E6E73',

    // Accents & System
    accent: '#0071E3',
    accentHover: '#0077ED',
    accentDark: '#2997FF',

    status: {
      success: '#30D158',
      warning: '#FF9F0A',
      danger: '#FF453A',
      successLight: 'rgba(48, 209, 88, 0.12)',
      warningLight: 'rgba(255, 159, 10, 0.12)',
      dangerLight: 'rgba(255, 69, 58, 0.12)',
    },

    borderLight: 'rgba(0, 0, 0, 0.08)',
    borderDark: 'rgba(255, 255, 255, 0.12)',
  },

  radii: {
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '28px',
    full: '9999px',
  },

  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.04)',
    card: '0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
    cardHover: '0 12px 36px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.04)',
    elevated: '0 20px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
    glowBlue: '0 0 30px rgba(0, 113, 227, 0.35)',
  },

  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif',
    mono: 'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Mono", monospace',
  },

  transitions: {
    spring: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;
