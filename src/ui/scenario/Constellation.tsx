// Constelacao de postura: 12 estrelas que acendem proporcional ao score.
const N = 12

interface ConstellationProps {
  score: number
  width?: number
  height?: number
}

export function Constellation({ score, width = 600, height = 34 }: ConstellationProps): JSX.Element {
  const lit = Math.round(N * Math.max(0, Math.min(100, score)) / 100)
  const pts = Array.from({ length: N }, (_, i) => {
    const x = 18 + (width - 36) * (i / (N - 1))
    const y = height / 2 + Math.sin(i * 1.6) * (height * 0.24)
    return [x, y] as const
  })
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full">
      <polyline
        points={pts.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#2a4a86"
        strokeWidth="1"
        opacity="0.35"
      />
      {pts.map(([x, y], i) => {
        const aceso = i < lit
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={aceso ? 4.4 : 3.4}
            fill={aceso ? '#22D3EE' : '#16306b'}
            style={aceso ? { filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.9))', transition: 'all 0.5s ease' } : { transition: 'all 0.5s ease' }}
          />
        )
      })}
    </svg>
  )
}
