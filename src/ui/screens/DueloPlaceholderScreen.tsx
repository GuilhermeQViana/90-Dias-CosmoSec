import { findMode, type ModeId } from '@/game/modes'
import { Button } from '@/ui/components/Button'

interface DueloPlaceholderScreenProps {
  modeId: ModeId
  guardiao: string
  onBackToMenu: () => void
}

// Placeholder honesto. O motor de duelo entra na M-04, as cenas na M-05 em diante.
export function DueloPlaceholderScreen({
  modeId,
  guardiao,
  onBackToMenu,
}: DueloPlaceholderScreenProps): JSX.Element {
  const mode = findMode(modeId)
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5 px-6 py-12 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan/80">
        Constelacao iniciada
      </span>
      <h2 className="font-display text-3xl font-bold text-white">
        Bem vindo, Guardiao {guardiao || 'sem nome'}
      </h2>
      <p className="font-body text-sm text-white/70">
        Sua ficha foi registrada e a arena {mode.titulo} esta carregada. O motor de duelo entra na
        M-04, com turnos, recursos e o vilao 90 Dias. Por enquanto, isto e um marcador honesto do
        fluxo.
      </p>
      <div className="grid w-full grid-cols-2 gap-3 font-mono text-sm">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-white/40">Alvo de Postura</p>
          <p className="text-cyan">{mode.alvoPostura}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-white/40">Prazo</p>
          <p className="text-cyan">{mode.prazoDias} dias</p>
        </div>
      </div>
      <Button variant="ghost" onClick={onBackToMenu}>
        Voltar ao menu
      </Button>
    </div>
  )
}
