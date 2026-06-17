import Phaser from 'phaser'
import { colorsHex } from '@/brand/tokens'

// Cena de boot do MVP tecnico da M-01. Prova que o pipeline do Phaser sobe:
// starfield procedural, glow contido e a ampulheta do vilao como marcador.
// As cenas reais de duelo entram a partir da M-04.
export class BootScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Arc[] = []

  constructor() {
    super('Boot')
  }

  create(): void {
    const { width, height } = this.scale

    // Fundo deep-space.
    this.cameras.main.setBackgroundColor(colorsHex.ink)

    // Starfield procedural simples. So para validar render e tween.
    for (let i = 0; i < 120; i += 1) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)
      const radius = Phaser.Math.FloatBetween(0.4, 1.6)
      const star = this.add.circle(x, y, radius, colorsHex.white, Phaser.Math.FloatBetween(0.3, 1))
      this.stars.push(star)
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.15 },
        duration: Phaser.Math.Between(1200, 2600),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500),
      })
    }

    // Marcador da ampulheta 90 Dias no topo. Placeholder vetorial.
    const cx = width / 2
    const cy = height * 0.32
    const hourglass = this.add.triangle(cx, cy, 0, -40, 40, 40, -40, 40, colorsHex.blue500, 0.18)
    hourglass.setStrokeStyle(2, colorsHex.cyan, 0.8)
    const hourglassBottom = this.add.triangle(cx, cy, 0, 40, 40, -40, -40, -40, colorsHex.blue500, 0.18)
    hourglassBottom.setStrokeStyle(2, colorsHex.cyan, 0.8)
    this.tweens.add({
      targets: [hourglass, hourglassBottom],
      scaleX: 1.05,
      scaleY: 0.95,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    // Texto de validacao. Sem travessoes em nenhuma string.
    this.add
      .text(cx, height * 0.6, 'Constelacao em standby', {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '14px',
        color: '#22D3EE',
      })
      .setOrigin(0.5)

    this.add
      .text(cx, height * 0.6 + 24, 'Phaser 3 online. Cenas de duelo a partir da M-04.', {
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        color: '#94A3B8',
      })
      .setOrigin(0.5)
  }
}
