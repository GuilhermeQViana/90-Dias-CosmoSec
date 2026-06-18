import { describe, expect, it } from 'vitest'
import { CATALOGO, buscarCarta } from '@/game/cards/catalog'
import {
  comprar,
  construirBaralho,
  embaralhar,
  estadoInicialCartas,
  jogarControleNoCampo,
  selarControle,
} from '@/game/cards/deck'

describe('catalogo', () => {
  it('tem a carta MFA cobrindo quatro normas', () => {
    const mfa = buscarCarta('mfa')
    expect(mfa.cobertura).toHaveLength(4)
    expect(mfa.cobertura).toContain('BCB/CMN')
    expect(mfa.cobertura).toContain('LGPD')
  })

  it('nao tem custo negativo em nenhuma carta', () => {
    for (const c of CATALOGO) {
      expect(c.custoEnergia).toBeGreaterThanOrEqual(0)
      expect(c.custoDias).toBeGreaterThanOrEqual(0)
    }
  })

  it('nenhum texto de carta faz overclaim', () => {
    const proibidas = ['certificad', 'em conformidade', 'aprovado pela anpd', 'auditado']
    for (const c of CATALOGO) {
      const t = c.texto.toLowerCase()
      for (const termo of proibidas) {
        expect(t.includes(termo)).toBe(false)
      }
    }
  })

  it('nenhum texto tem travessao', () => {
    for (const c of CATALOGO) {
      expect(c.texto.includes('—')).toBe(false)
      expect(c.texto.includes('–')).toBe(false)
    }
  })
})

describe('embaralhar', () => {
  it('preserva todas as cartas, so muda a ordem', () => {
    const base = construirBaralho()
    // rng deterministico: sempre 0, manda cada carta para o inicio.
    const misturado = embaralhar(base, () => 0)
    expect(misturado).toHaveLength(base.length)
    const uids = new Set(misturado.map((c) => c.uid))
    expect(uids.size).toBe(base.length)
  })
})

describe('comprar', () => {
  it('move n cartas do topo para a mao', () => {
    const estado = estadoInicialCartas(() => 0)
    const tamanhoBaralho = estado.baralho.length
    const depois = comprar(estado, 5)
    expect(depois.mao).toHaveLength(5)
    expect(depois.baralho).toHaveLength(tamanhoBaralho - 5)
  })
})

describe('jogarControleNoCampo e selarControle', () => {
  it('move um controle para o campo e depois sela', () => {
    let estado = comprar(estadoInicialCartas(() => 0), 15)
    const controle = estado.mao.find((c) => c.carta.tipo === 'controle')
    expect(controle).toBeDefined()
    if (!controle) return

    estado = jogarControleNoCampo(estado, controle.uid)
    expect(estado.campo.some((c) => c.uid === controle.uid)).toBe(true)
    expect(estado.mao.some((c) => c.uid === controle.uid)).toBe(false)

    const { estado: selado, selada } = selarControle(estado, controle.uid)
    expect(selada?.selado).toBe(true)
    expect(selado.campo.find((c) => c.uid === controle.uid)?.selado).toBe(true)
  })

  it('nao sela duas vezes', () => {
    let estado = comprar(estadoInicialCartas(() => 0), 15)
    const controle = estado.mao.find((c) => c.carta.tipo === 'controle')
    if (!controle) throw new Error('precisa de um controle na mao')
    estado = jogarControleNoCampo(estado, controle.uid)
    const primeiro = selarControle(estado, controle.uid)
    const segundo = selarControle(primeiro.estado, controle.uid)
    expect(segundo.selada).toBeNull()
  })
})
