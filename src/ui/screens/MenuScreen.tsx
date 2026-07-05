import { MODES, type ModeId } from '@/game/modes'
import { Button } from '@/ui/components/Button'
import { StarCompass } from '@/ui/components/StarCompass'
import { Wordmark } from '@/ui/components/Wordmark'

interface MenuScreenProps {
  selectedMode: ModeId
  onSelectMode: (id: ModeId) => void
  onPlay: () => void
  onHowToPlay: () => void
}

export function MenuScreen({
  selectedMode,
  onSelectMode,
  onPlay,
  onHowToPlay,
}: MenuScreenProps): JSX.Element {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-10 text-center">
      <header className="flex flex-col items-center gap-3">
        <StarCompass size={84} />
        <h1 className="font-display text-6xl font-bold tracking-tight text-white drop-shadow-[0_0_32px_rgba(34,211,238,0.35)]">
          90 Dias
        </h1>
        <Wordmark variante="escuro" tamanho={20} comSimbolo={false} />
        <p className="max-w-md font-body text-sm text-blue300">
          Voce foi nomeado Guardiao da Constelacao da sua organizacao. Prove a postura antes que a
          ampulheta zere.
        </p>
      </header>

      <section className="w-full" aria-label="Selecao de modo">
        <h2 className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-cyan/80">
          Escolha a arena
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODES.map((mode) => {
            const active = mode.id === selectedMode
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                aria-pressed={active}
                className={`pointer-events-auto flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-cyan bg-cyan/10 shadow-[0_0_24px_rgba(34,211,238,0.25)]'
                    : 'border-white/12 bg-white/5 hover:border-blue500/60'
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {mode.subtitulo} · {mode.dificuldade}
                </span>
                <span className="font-display text-sm font-semibold text-white">{mode.titulo}</span>
                <span className="font-mono text-[11px] text-cyan/90">
                  Postura {mode.alvoPostura} em {mode.prazoDias} dias
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={onPlay}>
            Iniciar a jornada
          </Button>
          <Button variant="ghost" onClick={onHowToPlay}>
            Como jogar
          </Button>
        </div>
        <p className="max-w-md font-body text-[11px] leading-relaxed text-slate-500">
          Um duelo de cartas pelos cinco verbos da metodologia, dos primeiros controles ao Trust
          Center, contra o vilao 90 Dias.
        </p>
      </div>
    </div>
  )
}
