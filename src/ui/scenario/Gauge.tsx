// Medidor circular de Posture Score, inspirado na prova visual. SVG puro.
const R = 52
const C = 2 * Math.PI * R

export function Gauge({ score }: { score: number }): JSX.Element {
  const frac = Math.max(0, Math.min(100, score)) / 100
  return (
    <div className="relative h-[132px] w-[132px]">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="7" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
          transform="rotate(-90 60 60)"
          style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.55))', transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tabular-nums text-white">{Math.round(score)}</span>
        <span className="font-mono text-[10px] text-blue300">/100</span>
      </div>
    </div>
  )
}
