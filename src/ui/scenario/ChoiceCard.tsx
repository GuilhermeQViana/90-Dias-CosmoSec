import type { Escolha } from '@/game/scenario/types'

interface ChoiceCardProps {
  escolha: Escolha
  index: number
  onEscolher: (e: Escolha) => void
}

// Cartao de escolha: titulo, descricao, custo em Dias e chips das normas que
// a jogada acende. A entrada e escalonada por index para um leve stagger.
export function ChoiceCard({ escolha, index, onEscolher }: ChoiceCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onEscolher(escolha)}
      style={{ animationDelay: `${90 + index * 90}ms` }}
      className="flex min-h-[150px] animate-[fadeUp_0.4s_ease_forwards] flex-col gap-2.5 rounded-2xl border border-blue500/20 bg-gradient-to-br from-blue900/70 to-ink/60 p-4 text-left opacity-0 backdrop-blur transition hover:-translate-y-1 hover:border-cyan hover:shadow-[0_16px_36px_-18px_rgba(34,211,238,0.5)]"
    >
      <h3 className="font-display text-[15px] font-semibold leading-tight text-slate-50">{escolha.titulo}</h3>
      <p className="flex-1 text-[12.8px] leading-relaxed text-slate-300">{escolha.descricao}</p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-blue300">- {escolha.custoDias} dias</span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {escolha.normas.map((n) => (
            <span
              key={n}
              className="rounded border border-blue500/35 bg-blue500/10 px-1.5 py-0.5 font-mono text-[8.5px] tracking-wide text-blue300"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
