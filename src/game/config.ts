import Phaser from 'phaser'
import { colors } from '@/brand/tokens'
import { BootScene } from '@/game/scenes/BootScene'

// Fabrica da config do Phaser. Recebe o container onde o canvas monta.
// Scale RESIZE para responder em desktop, Safari e iOS (Definition of Done).
export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: colors.ink,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%',
    },
    render: {
      antialias: true,
      powerPreference: 'high-performance',
    },
    // Audio fica desligado aqui. So liga apos gesto do usuario, na M-11.
    audio: { noAudio: true },
    scene: [BootScene],
  }
}
