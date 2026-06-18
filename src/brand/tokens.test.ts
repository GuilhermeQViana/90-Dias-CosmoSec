import { describe, expect, it } from 'vitest'
import { colors, colorsHex } from './tokens'

// Teste de fumaca da M-01. Garante que as cores hex string e numerica
// nao saem de sincronia, ja que Phaser usa 0x e o CSS usa #.
describe('tokens da marca', () => {
  it('mantem cores string e numerica em sincronia', () => {
    for (const key of Object.keys(colors) as Array<keyof typeof colors>) {
      const fromString = Number.parseInt(colors[key].replace('#', ''), 16)
      expect(colorsHex[key]).toBe(fromString)
    }
  })
})
