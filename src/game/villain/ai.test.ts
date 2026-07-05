import { describe, expect, it } from 'vitest'
import { criarEstadoInicial } from '@/game/engine/engine'
import type { EstadoDuelo } from '@/game/engine/types'
import { buscarCarta } from '@/game/cards/catalog'
import type { CartaInstancia } from '@/game/cards/types'
import type { EstadoCartas } from '@/game/cards/deck'
import { CATALOGO_VILAO } from '@/game/villain/catalog'
import { construirBaralhoVilao, escalonamento, resolverTurnoVilao } from '@/game/villain/ai'
import type { CartaVilao, EstadoVilao } from '@/game/villain/types'

const rng = () => 0

function dueloVilao(posture = 50): EstadoDuelo {
  return { ...criarEstadoInicial('auditoria'), fase: 'vilao', recursos: { ...criarEstadoInicial('auditoria').recursos, posture } }
}

function controle(id: string, selado = false, seladoNoTurno: number | null = null): CartaInstancia {
  return { uid: id, carta: buscarCarta(id), selado, seladoNoTurno }
}

function cartasCom(...campo: CartaInstancia[]): EstadoCartas {
  return { baralho: [], mao: [], campo, descarte: [] }
}

function vilaoCom(id: string): EstadoVilao {
  const carta = CATALOGO_VILAO.find((c) => c.id === id) as CartaVilao
  return { baralho: [carta], descarte: [] }
}

describe('construirBaralhoVilao por modo', () => {
  const conta = (v: EstadoVilao, id: string): number => v.baralho.filter((c) => c.id === id).length

  it('Modo Auditoria tem Auditoria Surpresa frequente', () => {
    const v = construirBaralhoVilao('auditoria', rng)
    expect(conta(v, 'auditoria-surpresa')).toBe(3)
  })

  it('Outros modos mantem o baralho base', () => {
    expect(conta(construirBaralhoVilao('regulador', rng), 'auditoria-surpresa')).toBe(1)
    expect(construirBaralhoVilao('rfp', rng).baralho).toHaveLength(CATALOGO_VILAO.length)
  })
})

describe('perda de selo remove a Postura real', () => {
  it('Ransomware num selo dobrado da Auditoria remove o valor cheio', () => {
    // MFA selado: ganho de selo na Auditoria = (3 + 6) * 2 = 18.
    const r = resolverTurnoVilao(dueloVilao(50), cartasCom(controle('mfa', true, 1)), vilaoCom('ransomware'), rng)
    expect(r.cartas.campo).toHaveLength(0)
    expect(r.duelo.recursos.posture).toBe(50 - 18)
  })
})

describe('escalonamento', () => {
  it('comeca em 1 e cresce a cada janela de 18 dias gastos', () => {
    expect(escalonamento(0)).toBe(1)
    expect(escalonamento(17)).toBe(1)
    expect(escalonamento(18)).toBe(2)
    expect(escalonamento(36)).toBe(3)
  })
})

describe('relogio base', () => {
  it('a ampulheta consome Dias todo turno do vilao', () => {
    const r = resolverTurnoVilao(dueloVilao(), cartasCom(), vilaoCom('phishing'), rng)
    expect(r.duelo.recursos.dias).toBeLessThan(90)
  })
})

describe('Phishing', () => {
  it('e absorvido quando ha MFA em campo', () => {
    const r = resolverTurnoVilao(dueloVilao(), cartasCom(controle('mfa')), vilaoCom('phishing'), rng)
    expect(r.duelo.recursos.posture).toBe(50)
    expect(r.eventos.join(' ')).toContain('absorvido')
  })

  it('acerta a Postura sem MFA', () => {
    const r = resolverTurnoVilao(dueloVilao(50), cartasCom(), vilaoCom('phishing'), rng)
    expect(r.duelo.recursos.posture).toBeLessThan(50)
  })
})

describe('Ransomware', () => {
  it('e anulado pelo Backup Imutavel', () => {
    const r = resolverTurnoVilao(
      dueloVilao(),
      cartasCom(controle('backup-imutavel'), controle('edr')),
      vilaoCom('ransomware'),
      rng,
    )
    expect(r.cartas.campo).toHaveLength(2)
  })

  it('destroi um controle desprotegido', () => {
    const r = resolverTurnoVilao(dueloVilao(), cartasCom(controle('edr')), vilaoCom('ransomware'), rng)
    expect(r.cartas.campo).toHaveLength(0)
    expect(r.cartas.descarte).toHaveLength(1)
  })
})

describe('Auditoria Surpresa', () => {
  it('e respondida pela Trilha de Auditoria', () => {
    const r = resolverTurnoVilao(
      dueloVilao(),
      cartasCom(controle('trilha-auditoria')),
      vilaoCom('auditoria-surpresa'),
      rng,
    )
    expect(r.duelo.recursos.posture).toBe(50)
  })

  it('tira Postura sem Trilha de Auditoria', () => {
    const r = resolverTurnoVilao(dueloVilao(50), cartasCom(), vilaoCom('auditoria-surpresa'), rng)
    expect(r.duelo.recursos.posture).toBeLessThan(50)
  })
})

describe('Evidencia Vencida', () => {
  it('ignora selo fresco do turno atual', () => {
    // duelo no turno 1, selo feito no turno 1: idade 0, imune.
    const r = resolverTurnoVilao(
      dueloVilao(),
      cartasCom(controle('mfa', true, 1)),
      vilaoCom('evidencia-vencida'),
      rng,
    )
    expect(r.cartas.campo[0]?.selado).toBe(true)
    expect(r.duelo.recursos.posture).toBe(50)
  })

  it('derruba selo antigo e remove a Postura dele', () => {
    const duelo = { ...dueloVilao(), turno: 5 }
    const r = resolverTurnoVilao(duelo, cartasCom(controle('mfa', true, 1)), vilaoCom('evidencia-vencida'), rng)
    expect(r.cartas.campo[0]?.selado).toBe(false)
    expect(r.duelo.recursos.posture).toBeLessThan(50)
    expect(r.duelo.controlesSelados).toBe(0)
  })
})
