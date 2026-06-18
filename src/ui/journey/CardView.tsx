import type { CartaInstancia, TipoCarta } from '@/game/cards/types'
import { bonusCrosswalk } from '@/game/engine/duelController'

// Carta em HTML, no estilo cosmico da jornada. Serve para mao e campo.

const ACENTO: Record<TipoCarta, { stripe: string; border: string; texto: string }> = {
  controle: { stripe: 'bg-blue500', border: 'border-blue500/50', texto: 'text-blue300' },
  evidencia: { stripe: 'bg-cyan', border: 'border-cyan/55', texto: 'text-cyan' },
  framework: { stripe: 'bg-blue300', border: 'border-blue300/50', texto: 'text-blue300' },
  aliado: { stripe: 'bg-ok', border: 'border-ok/50', texto: 'text-ok' },
  jornada: { stripe: 'bg-warn', border: 'border-warn/50', texto: 'text-warn' },
}

interface CardViewProps {
  inst: CartaInstancia
  contexto: 'mao' | 'campo'
  jogavel?: boolean
  selecionada?: boolean
  alvo?: boolean
  onClick?: (() => void) | undefined
}

export function CardView({
  inst,
  contexto,
  jogavel = true,
  selecionada = false,
  alvo = false,
  onClick,
}: CardViewProps): JSX.Element {
  const c = inst.carta
  const ac = ACENTO[c.tipo]
  const selado = inst.selado
  const ganho = c.defesa + bonusCrosswalk(c.cobertura.length)

  const estado = selado
    ? 'border-cyan shadow-[0_0_18px_-4px_rgba(34,211,238,0.6)]'
    : alvo
      ? 'border-cyan ring-2 ring-cyan/60'
      : selecionada
        ? 'border-cyan'
        : ac.border
  const dim = !jogavel && contexto === 'mao' ? 'opacity-45' : ''

  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      style={contexto === 'mao' ? { width: 118, minHeight: 162 } : { width: 110, minHeight: 150 }}
      className={`pointer-events-auto relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br from-blue900/95 to-ink/90 p-2.5 text-left backdrop-blur transition ${estado} ${dim} ${onClick && jogavel ? 'hover:-translate-y-1.5 hover:border-cyan' : ''}`}
    >
      <span className={`absolute left-0 right-0 top-0 h-1 ${ac.stripe} ${selado ? '' : 'opacity-80'}`} />

      <div className="mt-1 flex items-start justify-between gap-1">
        <span className="font-display text-[11.5px] font-semibold leading-tight text-slate-50">{c.nome}</span>
        {c.tipo === 'controle' ? (
          <span className="whitespace-nowrap font-mono text-[9px] text-blue500">Def {c.defesa}</span>
        ) : null}
      </div>

      {c.cobertura.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-0.5">
          {c.cobertura.map((n) => (
            <span key={n} className="rounded bg-blue500/12 px-1 py-px font-mono text-[7.5px] text-blue300">
              {n}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-1 flex-1 font-body text-[9.5px] leading-snug text-slate-400">{c.texto}</p>

      {selado ? (
        <span className="font-mono text-[8px] text-cyan">prova selada</span>
      ) : c.tipo === 'controle' ? (
        <span className="font-mono text-[8px] text-warn">sele para +{ganho}</span>
      ) : null}

      <div className="mt-1 flex items-center justify-between">
        <span className="font-mono text-[10px] text-cyan">
          E {c.custoEnergia} . D {c.custoDias}
        </span>
        <span className={`font-mono text-[8px] uppercase tracking-wide ${ac.texto}`}>{c.tipo}</span>
      </div>
    </button>
  )
}
