import type { Verbo } from '@/game/scenario/types'

const VERBOS: ReadonlyArray<Verbo> = ['Diagnosticar', 'Planejar', 'Operar', 'Monitorar', 'Demonstrar']

// Trilha dos cinco verbos. O atual acende em ciano, os passados ficam azuis.
export function Stepper({ step }: { step: number }): JSX.Element {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {VERBOS.map((v, i) => {
        const estado = i === step ? 'on' : i < step ? 'done' : 'off'
        const cls =
          estado === 'on'
            ? 'bg-cyan text-ink border-cyan shadow-[0_0_14px_rgba(34,211,238,0.4)] font-medium'
            : estado === 'done'
              ? 'border-blue500/55 bg-blue500/15 text-blue300'
              : 'border-blue500/25 bg-blue900/35 text-slate-400'
        return (
          <span
            key={v}
            className={`whitespace-nowrap rounded-full border px-2.5 py-1.5 font-mono text-[10px] tracking-wide transition-all duration-300 ${cls}`}
          >
            {v}
          </span>
        )
      })}
    </div>
  )
}
