import { findMode, type ModeId } from '@/game/modes'
import { Button } from '@/ui/components/Button'

interface ResultadoScreenProps {
  modo: ModeId
  resultado: 'vitoria' | 'derrota'
  posture: number
  onJogarDeNovo: () => void
  onMenu: () => void
}

// Veredito honesto por faixa (secao 12). O cartao compartilhavel completo e o
// CTA final entram na M-13.
function veredito(posture: number): string {
  if (posture >= 75) {
    return 'Postura defensavel. Voce tem prova para mostrar.'
  }
  if (posture >= 50) {
    return 'Demonstravel com lacunas. Da para evoluir com mais evidencia selada.'
  }
  return 'Sobrevivencia no improviso. A prova ainda nao sustenta a postura.'
}

export function ResultadoScreen({
  modo,
  resultado,
  posture,
  onJogarDeNovo,
  onMenu,
}: ResultadoScreenProps): JSX.Element {
  const mode = findMode(modo)
  const venceu = resultado === 'vitoria'

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5 px-6 py-12 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan/80">
        {mode.titulo}
      </span>
      <h2 className={`font-display text-3xl font-bold ${venceu ? 'text-cyan' : 'text-red-300'}`}>
        {venceu ? 'A constelacao acende' : 'O 90 Dias prevaleceu'}
      </h2>

      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-5xl font-medium text-white">{posture}</span>
        <span className="font-body text-xs text-white/45">Posture final</span>
      </div>

      <p className="font-body text-sm text-white/75">{veredito(posture)}</p>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 font-body text-sm text-white/70">
        Na CosmoSec a jornada e a mesma, mas o sistema faz o trabalho pesado. Uma prova vale varias
        normas, a evidencia nao vence e o Trust Center demonstra a sua postura de forma publica e
        honesta.
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={onJogarDeNovo}>
          Jogar de novo
        </Button>
        <Button variant="ghost" onClick={onMenu}>
          Voltar ao menu
        </Button>
      </div>
    </div>
  )
}
