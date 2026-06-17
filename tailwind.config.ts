import type { Config } from 'tailwindcss'

// Tokens da marca espelhados aqui. Mantenha em sincronia com src/brand/tokens.ts.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        blue900: '#0A1B3D',
        blue500: '#3B82F6',
        cyan: '#22D3EE',
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
