import { useRef, useState } from 'react'
import { findMode, type ModeId } from '@/game/modes'
import { captureLead, updateLeadResult } from '@/lead/captureLeadClient'
import { toLeadPayload } from '@/lead/validation'
import type { GuardianForm } from '@/lead/types'
import { CosmicBackground } from '@/ui/cosmic/CosmicBackground'
import { MenuScreen } from '@/ui/screens/MenuScreen'
import { ComoJogarScreen } from '@/ui/screens/ComoJogarScreen'
import { CharacterCreatorScreen } from '@/ui/screens/CharacterCreatorScreen'
import { JourneyGame } from '@/ui/journey/JourneyGame'

type Screen = 'menu' | 'como-jogar' | 'criador' | 'jogo'

const CONTATO = 'contato@cosmosec.com.br'

// Shell do jogo. Fundo cosmico three.js atras de tudo. O jogo e a Jornada: um
// duelo de cartas pelos cinco verbos. A captura de lead nunca bloqueia.
export function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('menu')
  const [mode, setMode] = useState<ModeId>('auditoria')
  const leadIdRef = useRef<string | null>(null)

  function handleStart(form: GuardianForm): void {
    void (async () => {
      try {
        const r = await captureLead(toLeadPayload(form))
        leadIdRef.current = r.leadId
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[capture-lead] falhou, o jogo segue normalmente', err)
      }
    })()
    setScreen('jogo')
  }

  function enviarResultado(scoreFinal: number): void {
    void updateLeadResult(leadIdRef.current, { modoJogado: mode, scoreFinal }).catch(() => {
      // Falha aqui nunca afeta o jogador.
    })
  }

  function handleFalarCosmoSec(): void {
    window.open(`mailto:${CONTATO}`, '_blank', 'noopener')
  }

  return (
    <main className="relative h-full w-full overflow-hidden">
      <CosmicBackground />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ background: 'radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)' }}
      />

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
          <CharacterCreatorScreen modeId={mode} onBack={() => setScreen('menu')} onStart={handleStart} />
        ) : null}

        {screen === 'jogo' ? (
          <JourneyGame
            modo={mode}
            modoLabel={findMode(mode).titulo}
            onConcluir={enviarResultado}
            onFalarCosmoSec={handleFalarCosmoSec}
          />
        ) : null}
      </div>
    </main>
  )
}
