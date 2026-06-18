import { veredito } from '@/game/scenario/engine'
import { Constellation } from '@/ui/scenario/Constellation'
import { Button } from '@/ui/components/Button'

interface EndScreenProps {
  score: number
  diasUsados: number
  onJogarDeNovo: () => void
  onFalarCosmoSec: () => void
}

// Tela final: score honesto em destaque, constelacao, veredito por faixa e o
// pitch da CosmoSec. CTA, ja que o lead foi capturado no inicio.
export function EndScreen({ score, diasUsados, onJogarDeNovo, onFalarCosmoSec }: EndScreenProps): JSX.Element {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-2 px-6 py-10 text-center">
      <span className="font-mono text-[11px] tracking-[0.28em] text-cyan">
        AUDITORIA CONCLUIDA · {diasUsados} DIAS USADOS
      </span>
      <h1 className="mt-1 font-display text-3xl font-bold text-white">Banco Meridiano</h1>

      <div className="my-1 bg-gradient-to-r from-blue500 to-cyan bg-clip-text font-display text-7xl font-bold tabular-nums text-transparent">
        {Math.round(score)}
        <span className="ml-1 font-mono text-lg font-normal text-slate-400">/100</span>
      </div>

      <div className="my-2 h-20 w-[min(420px,80vw)]">
        <Constellation score={score} width={420} height={80} />
      </div>

      <p className="max-w-md font-body text-[15px] leading-relaxed text-slate-100">{veredito(score)}</p>

      <p className="mt-3 max-w-lg border-t border-blue500/20 pt-4 font-body text-[13.5px] leading-relaxed text-blue300">
        Na CosmoSec a jornada e a mesma, mas o sistema faz o trabalho pesado:{' '}
        <b className="text-cyan">uma prova vale varias normas</b>, a evidencia{' '}
        <b className="text-cyan">nao vence</b> e o <b className="text-cyan">Trust Center</b> demonstra a
        sua postura de forma publica e honesta. Sem o modo dificil.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="ghost" onClick={onJogarDeNovo}>
          Jogar de novo
        </Button>
        <Button variant="primary" onClick={onFalarCosmoSec}>
          Falar com a CosmoSec
        </Button>
      </div>
    </div>
  )
}
