import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '@/game/config'

// Ponte React para Phaser. Monta o jogo no container e destroi no unmount.
// O React cuida do shell e da UI; o Phaser cuida da cena.
export function PhaserGame(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return
    }

    const game = new Phaser.Game(createGameConfig(containerRef.current))
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />
}
