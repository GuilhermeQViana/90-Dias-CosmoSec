import { PhaserGame } from '@/game/PhaserGame'

// Shell do jogo. Na M-01 e so a casca: canvas do Phaser ao fundo e um HUD
// minimo por cima para provar a composicao React sobre Phaser.
// Menu cosmico e criador de personagem entram na M-02.
export function App(): JSX.Element {
  return (
    <main className="relative h-full w-full overflow-hidden bg-deep-space">
      <PhaserGame />

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-start p-6">
        <header className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.25)]">
            90 Dias
          </h1>
          <p className="mt-1 font-body text-sm text-blue500">CosmoSec · Guardiao da Constelacao</p>
        </header>
      </div>
    </main>
  )
}
