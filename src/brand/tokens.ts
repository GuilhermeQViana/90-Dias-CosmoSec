// Tokens da marca CosmoSec, guia v2.0 (abril 2026). Fonte unica de verdade
// para cor e tipografia. Usados pelo shell React (Tailwind) e pelas cenas
// Phaser (valores hex 0x).

export const colors = {
  ink: '#0B1220',
  blue900: '#0A1B3D',
  blue700: '#1A3A8C',
  blue500: '#3B82F6',
  blue300: '#8FCBFF',
  cyan: '#22D3EE', // acento, nunca protagonista de fundo
  paper: '#F6F8FB',
  line: '#E4E8EF',
  white: '#FFFFFF',
  ok: '#10B981',
  warn: '#F59E0B',
  danger: '#EF4444',
} as const

// Versao numerica das cores para o Phaser, que pede 0x. Mantida em sincronia
// com as strings acima (ver tokens.test.ts).
export const colorsHex = {
  ink: 0x0b1220,
  blue900: 0x0a1b3d,
  blue700: 0x1a3a8c,
  blue500: 0x3b82f6,
  blue300: 0x8fcbff,
  cyan: 0x22d3ee,
  paper: 0xf6f8fb,
  line: 0xe4e8ef,
  white: 0xffffff,
  ok: 0x10b981,
  warn: 0xf59e0b,
  danger: 0xef4444,
} as const

export const fonts = {
  display: "'Space Grotesk', system-ui, sans-serif", // titulos, compacta e tecnologica
  body: "'Inter', system-ui, sans-serif", // corpo, alta legibilidade em relatorios
  mono: "'JetBrains Mono', ui-monospace, monospace", // dados, IDs de controle, hashes
} as const

export type BrandColor = keyof typeof colors
