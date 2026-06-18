import type { Escolha } from '@/game/scenario/types'
import { Button } from '@/ui/components/Button'

interface OutcomePanelProps {
  escolha: Escolha
  verbo: string
  ultima: boolean
  onContinuar: () => void
}

// Painel de resultado: o que aconteceu, o delta de Postura, as normas que
// acenderam e a licao da rodada.
export function OutcomePanel({ escolha, verbo, ultima, onContinuar }: OutcomePanelProps): JSX.Element {
  const d = escolha.deltaScore
  const corDelta = d > 0 ? 'text-ok' : d < 0 ? 'text-danger' : 'text-blue300'
  const txtDelta = `${d > 0 ? '+' : ''}${d} pts`

  return (
    <div className="animate-[pop_0.35s_ease] rounded-2xl border border-cyan bg-gradient-to-br from-blue900/80 to-ink/60 p-6 backdrop-blur-md shadow-[0_0_40px_-16px_rgba(34,211,238,0.5)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10.5px] tracking-[0.2em] text-cyan">RESULTADO · {verbo.toUpperCase()}</span>
        <span className={`font-display text-xl font-bold tabular-nums ${corDelta}`}>{txtDelta}</span>
      </div>

      <p className="text-sm leading-relaxed text-slate-200">{escolha.resultado}</p>

      {escolha.normas.length > 0 ? (
        <div className="mb-1 mt-3.5 flex flex-wrap gap-1.5">
          {escolha.normas.map((n, i) => (
            <span
              key={n}
              style={{ animationDelay: `${i * 90}ms` }}
              className="animate-[chipIn_0.4s_ease_forwards] rounded-md bg-cyan px-2 py-1 font-mono text-[9px] tracking-wide text-ink opacity-0 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
            >
              {n}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3.5 border-t border-blue500/20 pt-3.5 text-[13px] leading-relaxed text-blue300">
        {escolha.licao}
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="primary" onClick={onContinuar}>
          {ultima ? 'Ver resultado da auditoria' : 'Continuar'}
        </Button>
      </div>
    </div>
  )
}
