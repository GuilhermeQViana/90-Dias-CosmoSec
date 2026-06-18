import type { Rodada } from '@/game/scenario/types'

// Cartao de cenario: contexto, situacao, alerta de incidente e sugestao do
// aliado SiriusAI com humano no loop.
export function ScenarioCard({ rodada, etapa }: { rodada: Rodada; etapa: number }): JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue500/20 bg-gradient-to-br from-blue900/70 to-ink/55 p-6 backdrop-blur-md shadow-[0_18px_50px_-24px_rgba(0,0,0,0.7)]">
      <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-cyan to-blue500 opacity-80" />

      <div className="mb-3 flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.2em] text-cyan">
        ETAPA 0{etapa + 1} · {rodada.verbo.toUpperCase()}
        <span className="tracking-[0.06em] text-slate-400">{rodada.contexto}</span>
      </div>

      <h2 className="font-display text-xl font-medium leading-relaxed text-slate-100">{rodada.cenario}</h2>

      {rodada.alerta ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-3">
          <span className="mt-0.5 whitespace-nowrap rounded border border-danger/45 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.18em] text-danger">
            ALERTA
          </span>
          <p className="text-sm leading-snug text-red-200">{rodada.alerta}</p>
        </div>
      ) : null}

      {rodada.sirius ? (
        <div className="mt-3 flex items-center gap-2.5 text-sm text-blue300">
          <span className="h-[18px] w-[18px] flex-none rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#22D3EE_55%,#0a6_100%)] shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
          <span>
            <b className="font-semibold text-cyan">Sirius sugere:</b> {rodada.sirius}{' '}
            <i className="text-slate-500">voce aprova ou ignora</i>
          </span>
        </div>
      ) : null}
    </div>
  )
}
