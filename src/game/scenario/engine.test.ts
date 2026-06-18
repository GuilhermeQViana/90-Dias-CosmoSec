import { describe, expect, it } from 'vitest'
import { CAMPANHA } from '@/game/scenario/campaign'
import {
  continuar,
  escolher,
  estadoInicial,
  faixa,
  totalRodadas,
  veredito,
} from '@/game/scenario/engine'

describe('campanha', () => {
  it('tem os cinco verbos na ordem', () => {
    expect(CAMPANHA.map((r) => r.verbo)).toEqual([
      'Diagnosticar',
      'Planejar',
      'Operar',
      'Monitorar',
      'Demonstrar',
    ])
  })

  it('cada rodada tem tres escolhas e exatamente uma melhor', () => {
    for (const r of CAMPANHA) {
      expect(r.escolhas).toHaveLength(3)
      expect(r.escolhas.filter((e) => e.melhor)).toHaveLength(1)
    }
  })

  it('nenhuma copy tem travessao nem overclaim', () => {
    const proibidas = ['certificado', 'em conformidade', 'aprovado pela anpd', 'auditado']
    for (const r of CAMPANHA) {
      const texto = [r.cenario, r.contexto, r.alerta ?? '', r.sirius ?? '']
        .concat(r.escolhas.flatMap((e) => [e.titulo, e.descricao, e.resultado, e.licao]))
        .join(' ')
        .toLowerCase()
      expect(texto.includes('—')).toBe(false)
      expect(texto.includes('–')).toBe(false)
      for (const termo of proibidas) expect(texto.includes(termo)).toBe(false)
    }
  })
})

describe('motor', () => {
  it('comeca baixo e honesto', () => {
    const s = estadoInicial()
    expect(s.score).toBe(24)
    expect(s.days).toBe(90)
    expect(s.fase).toBe('escolha')
  })

  it('escolher ajusta score e dias e mostra o resultado', () => {
    const s = estadoInicial()
    const escolha = CAMPANHA[0]!.escolhas[1]!
    const depois = escolher(s, escolha)
    expect(depois.score).toBe(24 + escolha.deltaScore)
    expect(depois.days).toBe(90 - escolha.custoDias)
    expect(depois.fase).toBe('resultado')
    expect(depois.ultimaEscolha).toBe(escolha)
  })

  it('score nunca cai abaixo do piso de 5', () => {
    let s = estadoInicial()
    s = { ...s, score: 6 }
    const escolha = { ...CAMPANHA[2]!.escolhas[1]!, deltaScore: -50 }
    expect(escolher(s, escolha).score).toBe(5)
  })

  it('continuar avanca a rodada e fecha no fim', () => {
    let s = estadoInicial()
    for (let i = 0; i < totalRodadas(); i += 1) {
      s = escolher(s, CAMPANHA[i]!.escolhas[0]!)
      s = continuar(s)
    }
    expect(s.fase).toBe('fim')
  })
})

describe('veredito', () => {
  it('classifica por faixa honesta', () => {
    expect(faixa(80)).toBe('defensavel')
    expect(faixa(60)).toBe('demonstravel')
    expect(faixa(40)).toBe('sobrevivencia')
    expect(veredito(80)).toContain('defensavel')
  })
})
