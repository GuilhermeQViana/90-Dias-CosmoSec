// Tokens da marca CosmoSec. Fonte unica de verdade para cor e tipografia.
// Usados pelo shell React (via Tailwind) e pelas cenas Phaser (via valores hex).

export const colors = {
  ink: '#0B1220',
  blue900: '#0A1B3D',
  blue500: '#3B82F6',
  cyan: '#22D3EE', // acento, nunca fundo
  white: '#F8FAFC',
} as const

// Versao numerica das cores para o Phaser, que pede 0x.
export const colorsHex = {
  ink: 0x0b1220,
  blue900: 0x0a1b3d,
  blue500: 0x3b82f6,
  cyan: 0x22d3ee,
  white: 0xf8fafc,
} as const

export const fonts = {
  display: "'Space Grotesk', system-ui, sans-serif", // titulos
  body: "'Inter', system-ui, sans-serif", // corpo
  mono: "'JetBrains Mono', ui-monospace, monospace", // dados, custos, hashes
} as const

export type BrandColor = keyof typeof colors
