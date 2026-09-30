/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bgLight: '#F5F5F7',
          bgDark: '#0D0E12',
          cardLight: 'rgba(255, 255, 255, 0.75)',
          cardDark: 'rgba(28, 28, 30, 0.75)',
          blue: '#007AFF',
          indigo: '#5856D6',
          purple: '#AF52DE',
          pink: '#FF2D55',
          emerald: '#34C759',
          amber: '#FF9500',
          red: '#FF3B30',
          cyan: '#30B0C7',
          grayLight: '#E5E5EA',
          grayDark: '#2C2C2E',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-md': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'apple-glow': '0 0 25px rgba(0, 122, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
