// Logo star-compass da CosmoSec: a estrela em orbita, o movimento tecnico
// ascendente da jornada de maturidade. SVG vetorial, fiel ao guia v2.0.

interface StarCompassProps {
  size?: number
  // mostra a orbita tracejada com a constelacao em volta
  orbita?: boolean
}

// Estrela de 6 pontas, 12 vertices alternando raio externo e interno.
const STAR_POINTS = [
  [64, 18],
  [73, 48],
  [104, 41],
  [82, 64],
  [104, 87],
  [73, 80],
  [64, 110],
  [55, 80],
  [24, 87],
  [46, 64],
  [24, 41],
  [55, 48],
]
  .map((p) => p.join(','))
  .join(' ')

export function StarCompass({ size = 64, orbita = true }: StarCompassProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      role="img"
      aria-label="Logo star-compass da CosmoSec"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cs-star" x1="64" y1="14" x2="64" y2="114" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1A3A8C" />
        </linearGradient>
        <radialGradient id="cs-core" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#8FCBFF" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {orbita ? (
        <g>
          <circle cx="64" cy="64" r="58" stroke="#22D3EE" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="9 7" />
          <circle cx="64" cy="64" r="50" stroke="#3B82F6" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="26" y1="34" x2="104" y2="86" stroke="#22D3EE" strokeOpacity="0.25" strokeWidth="1" />
          <line x1="100" y1="30" x2="80" y2="112" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />
          <circle cx="26" cy="34" r="3.5" fill="#22D3EE" />
          <circle cx="104" cy="86" r="3" fill="#3B82F6" />
          <circle cx="80" cy="112" r="2.5" fill="#22D3EE" />
          <circle cx="100" cy="30" r="2.5" fill="#8FCBFF" />
        </g>
      ) : null}

      <polygon points={STAR_POINTS} fill="url(#cs-star)" />
      <circle cx="64" cy="64" r="16" fill="url(#cs-core)" />
      <circle cx="64" cy="64" r="5.5" fill="#FFFFFF" />
    </svg>
  )
}
