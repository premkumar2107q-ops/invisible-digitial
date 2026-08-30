/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06080c',
          900: '#0a0e14',
          850: '#0c1118',
          800: '#0f141c',
          750: '#131923',
          700: '#1a212d',
          600: '#222b39',
          500: '#2c3747',
          400: '#3b4859',
          300: '#5a6b80',
          200: '#8b9bb0',
          100: '#b8c4d4',
          50: '#e6edf6',
        },
        flux: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a5f',
          900: '#172a44',
        },
        warn: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        fault: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        ok: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        techy: '0.14em',
      },
      animation: {
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
