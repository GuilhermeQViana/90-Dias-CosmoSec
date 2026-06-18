import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { colors } from '@/brand/tokens'
import type { ModeId } from '@/game/modes'
import { DuelScene, type DuelFim } from '@/game/scenes/DuelScene'

interface DuelGameProps {
  modo: ModeId
  onFim: (fim: DuelFim) => void
}

// Monta uma instancia Phaser dedicada ao duelo, com a DuelScene. Recebe o modo
// e devolve o resultado ao React via onFim. Destroi o jogo no unmount.
export function DuelGame({ modo, onFim }: DuelGameProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  // onFim em ref para o efeito nao remontar o jogo a cada render.
  const onFimRef = useRef(onFim)
  onFimRef.current = onFim

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return
    }
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: colors.ink,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      audio: { noAudio: true },
      scene: [DuelScene],
    })
    game.scene.start('Duel', {
      modo,
      onFim: (fim: DuelFim) => onFimRef.current(fim),
    })
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [modo])

  return <div ref={containerRef} className="absolute inset-0" />
}
