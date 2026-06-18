import { useRef, useState } from 'react'
import { PhaserGame } from '@/game/PhaserGame'
import { DuelGame } from '@/game/DuelGame'
import type { DuelFim } from '@/game/scenes/DuelScene'
import type { ModeId } from '@/game/modes'
import { captureLead, updateLeadResult } from '@/lead/captureLeadClient'
import { toLeadPayload } from '@/lead/validation'
import type { GuardianForm } from '@/lead/types'
import { MenuScreen } from '@/ui/screens/MenuScreen'
import { ComoJogarScreen } from '@/ui/screens/ComoJogarScreen'
import { CharacterCreatorScreen } from '@/ui/screens/CharacterCreatorScreen'
import { ResultadoScreen } from '@/ui/screens/ResultadoScreen'

type Screen = 'menu' | 'como-jogar' | 'criador' | 'duelo' | 'resultado'

// Shell do jogo. O canvas Phaser do menu e o fundo cosmico; no duelo, uma cena
// Phaser dedicada assume a tela. A captura de lead nunca bloqueia o jogo.
export function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('menu')
  const [mode, setMode] = useState<ModeId>('auditoria')
  const [fim, setFim] = useState<DuelFim | null>(null)
  // leadId guardado para o segundo POST com modo e score ao fim da partida.
  const leadIdRef = useRef<string | null>(null)

  function handleStart(form: GuardianForm): void {
    // Captura nao bloqueante. O jogo segue mesmo se o envio falhar.
    void (async () => {
      try {
        const r = await captureLead(toLeadPayload(form))
        leadIdRef.current = r.leadId
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[capture-lead] falhou, o jogo segue normalmente', err)
      }
    })()

    setFim(null)
    setScreen('duelo')
  }

  function handleFimDuelo(resultado: DuelFim): void {
    setFim(resultado)
    setScreen('resultado')

    // Segundo POST: atualiza o registro com modo jogado e score final. Nao bloqueia.
    void updateLeadResult(leadIdRef.current, {
      modoJogado: resultado.modo,
      scoreFinal: resultado.posture,
    }).catch(() => {
      // Falha aqui nunca afeta o jogador.
    })
  }

  const noDuelo = screen === 'duelo'

  return (
    <main className="relative h-full w-full overflow-hidden bg-deep-space">
      {/* Fundo cosmico do menu. Sai de cena durante o duelo. */}
      {!noDuelo ? <PhaserGame /> : null}

      {noDuelo ? <DuelGame modo={mode} onFim={handleFimDuelo} /> : null}

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

        {screen === 'resultado' && fim ? (
          <ResultadoScreen
            modo={fim.modo}
            resultado={fim.resultado}
            posture={fim.posture}
            onJogarDeNovo={() => {
              setFim(null)
              setScreen('duelo')
            }}
            onMenu={() => setScreen('menu')}
          />
        ) : null}
      </div>
    </main>
  )
}
