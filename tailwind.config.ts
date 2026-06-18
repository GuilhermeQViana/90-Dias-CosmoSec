import type { Config } from 'tailwindcss'

// Tokens da marca espelhados aqui. Mantenha em sincronia com src/brand/tokens.ts.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        blue900: '#0A1B3D',
        blue700: '#1A3A8C',
        blue500: '#3B82F6',
        blue300: '#8FCBFF',
        cyan: '#22D3EE',
        paper: '#F6F8FB',
        line: '#E4E8EF',
        ok: '#10B981',
        warn: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        display: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
        body: ["'Inter'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'deep-space': 'radial-gradient(circle at 50% 0%, #0A1B3D 0%, #0B1220 60%)',
      },
    },
  },
  plugins: [],
} satisfies Config
