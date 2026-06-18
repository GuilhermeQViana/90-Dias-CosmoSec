import { useState } from 'react'
import { PhaserGame } from '@/game/PhaserGame'
import type { ModeId } from '@/game/modes'
import { captureLead } from '@/lead/captureLeadClient'
import { toLeadPayload } from '@/lead/validation'
import type { GuardianForm } from '@/lead/types'
import { MenuScreen } from '@/ui/screens/MenuScreen'
import { ComoJogarScreen } from '@/ui/screens/ComoJogarScreen'
import { CharacterCreatorScreen } from '@/ui/screens/CharacterCreatorScreen'
import { DueloPlaceholderScreen } from '@/ui/screens/DueloPlaceholderScreen'

type Screen = 'menu' | 'como-jogar' | 'criador' | 'duelo'

// Shell do jogo. O canvas Phaser e o fundo cosmico animado; o React desenha
// as telas por cima. A captura de lead acontece ao iniciar e nunca bloqueia o jogo.
export function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('menu')
  const [mode, setMode] = useState<ModeId>('auditoria')
  const [guardiao, setGuardiao] = useState('')

  function handleStart(form: GuardianForm): void {
    setGuardiao(form.nome.trim())

    // Captura nao bloqueante. O jogo segue mesmo se o envio falhar.
    void (async () => {
      try {
        const payload = toLeadPayload(form)
        await captureLead(payload)
      } catch (err) {
        // Falha de captura nunca trava o jogador. Apenas registra para depurar.
        // eslint-disable-next-line no-console
        console.warn('[capture-lead] falhou, o jogo segue normalmente', err)
      }
    })()

    setScreen('duelo')
  }

  return (
    <main className="relative h-full w-full overflow-hidden bg-deep-space">
      <PhaserGame />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center overflow-y-auto">
        {screen === 'menu' ? (
          <MenuScreen
            selectedMode={mode}
            onSelectMode={setMode}
            onPlay={() => setScreen('criador')}
            onHowToPlay={() => setScreen('como-jogar')}
          />
        ) : null}

        {screen === 'como-jogar' ? <ComoJogarScreen onBack={() => setScreen('menu')} /> : null}

        {screen === 'criador' ? (
          <CharacterCreatorScreen
            modeId={mode}
            onBack={() => setScreen('menu')}
            onStart={handleStart}
          />
        ) : null}

        {screen === 'duelo' ? (
          <DueloPlaceholderScreen
            modeId={mode}
            guardiao={guardiao}
            onBackToMenu={() => setScreen('menu')}
          />
        ) : null}
      </div>
    </main>
  )
}
