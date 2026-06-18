import { describe, expect, it } from 'vitest'
import { BALANCE } from '@/game/engine/balance'
import {
  atingiuAlvo,
  criarEstadoInicial,
  podeJogarCarta,
  podePublicarTrustCenter,
  reduzir,
} from '@/game/engine/engine'
import type { EstadoDuelo, JogadaCarta } from '@/game/engine/types'

const carta = (over: Partial<JogadaCarta> = {}): JogadaCarta => ({
  custoEnergia: 1,
  custoDias: 1,
  ganhoPostura: 5,
  selaControle: false,
  ...over,
})

// Avanca o jogo ate o turno desejado, sem dano do vilao, para testar fases.
function avancarTurnos(estado: EstadoDuelo, quantos: number): EstadoDuelo {
  let s = estado
  for (let i = 0; i < quantos; i += 1) {
    s = reduzir(s, { tipo: 'encerrar-turno' })
    s = reduzir(s, { tipo: 'turno-vilao', ataque: { danoPostura: 0, reducaoDias: 1 } })
  }
  return s
}

describe('criarEstadoInicial', () => {
  it('comeca com Posture baixo e Dias do modo', () => {
    const s = criarEstadoInicial('auditoria')
    expect(s.recursos.posture).toBe(BALANCE.POSTURE_INICIAL)
    expect(s.recursos.dias).toBe(90)
    expect(s.turno).toBe(1)
    expect(s.fase).toBe('guardiao')
    expect(s.resultado).toBe('em-andamento')
  })
})

describe('energia', () => {
  it('cresce devagar a cada turno ate o teto', () => {
    let s = criarEstadoInicial('auditoria')
    s = reduzir(s, { tipo: 'iniciar-turno' })
    expect(s.recursos.energiaMax).toBe(BALANCE.ENERGIA_MAX_INICIAL + 1)
    s = avancarTurnos(s, 20)
    expect(s.recursos.energiaMax).toBe(BALANCE.ENERGIA_MAX_TETO)
  })
})

describe('jogarCarta', () => {
  it('gasta energia e dias e soma Posture', () => {
    let s = criarEstadoInicial('auditoria')
    s = reduzir(s, { tipo: 'iniciar-turno' }) // energia vira 2
    const antes = s.recursos
    s = reduzir(s, { tipo: 'jogar-carta', jogada: carta({ custoEnergia: 2, custoDias: 8, ganhoPostura: 5 }) })
    expect(s.recursos.energia).toBe(antes.energia - 2)
    expect(s.recursos.dias).toBe(antes.dias - 8)
    expect(s.recursos.posture).toBe(antes.posture + 5)
  })

  it('ignora jogada sem energia suficiente', () => {
    const s = criarEstadoInicial('auditoria') // energia 1
    const depois = reduzir(s, { tipo: 'jogar-carta', jogada: carta({ custoEnergia: 3 }) })
    expect(depois.recursos).toEqual(s.recursos)
    expect(podeJogarCarta(s, carta({ custoEnergia: 3 }))).toBe(false)
  })

  it('nao deixa a Posture passar de 100', () => {
    let s = criarEstadoInicial('auditoria')
    s = reduzir(s, { tipo: 'iniciar-turno' })
    s = reduzir(s, { tipo: 'jogar-carta', jogada: carta({ custoEnergia: 0, custoDias: 0, ganhoPostura: 999 }) })
    expect(s.recursos.posture).toBe(BALANCE.POSTURE_MAX)
  })
})

describe('vitoria por alvo', () => {
  it('vence ao bater o alvo com controles selados suficientes', () => {
    let s = criarEstadoInicial('auditoria') // alvo 70, min 4 selados
    s = reduzir(s, { tipo: 'iniciar-turno' })
    // Sela 4 controles e sobe a Posture acima de 70, sem custo para focar no alvo.
    for (let i = 0; i < 4; i += 1) {
      s = reduzir(s, {
        tipo: 'jogar-carta',
        jogada: carta({ custoEnergia: 0, custoDias: 0, ganhoPostura: 20, selaControle: true }),
      })
    }
    expect(s.controlesSelados).toBe(4)
    expect(atingiuAlvo(s)).toBe(true)
    expect(s.resultado).toBe('vitoria')
  })

  it('nao vence com Posture alta mas controles selados de menos', () => {
    let s = criarEstadoInicial('auditoria')
    s = reduzir(s, { tipo: 'iniciar-turno' })
    s = reduzir(s, {
      tipo: 'jogar-carta',
      jogada: carta({ custoEnergia: 0, custoDias: 0, ganhoPostura: 80, selaControle: false }),
    })
    expect(s.recursos.posture).toBeGreaterThanOrEqual(70)
    expect(s.resultado).toBe('em-andamento')
  })
})

describe('derrota', () => {
  it('perde quando os Dias zeram', () => {
    let s = criarEstadoInicial('regulador') // 75 dias
    s = reduzir(s, { tipo: 'encerrar-turno' })
    s = reduzir(s, { tipo: 'turno-vilao', ataque: { danoPostura: 0, reducaoDias: 999 } })
    expect(s.recursos.dias).toBeLessThanOrEqual(0)
    expect(s.resultado).toBe('derrota')
    expect(s.fase).toBe('fim')
  })

  it('perde quando a Posture cai ao piso critico', () => {
    let s = criarEstadoInicial('auditoria')
    s = reduzir(s, { tipo: 'encerrar-turno' })
    s = reduzir(s, { tipo: 'turno-vilao', ataque: { danoPostura: 999, reducaoDias: 1 } })
    expect(s.recursos.posture).toBe(BALANCE.POSTURE_PISO_CRITICO)
    expect(s.resultado).toBe('derrota')
  })
})

describe('publicar Trust Center', () => {
  it('so libera a partir do turno minimo e com alvo batido', () => {
    let s = criarEstadoInicial('rfp') // alvo 85, min 6 selados, exige trust center
    s = reduzir(s, { tipo: 'iniciar-turno' })
    // Antes do turno minimo e sem alvo, indisponivel.
    expect(podePublicarTrustCenter(s, 3, 0)).toBe(false)

    // Avanca ate o turno minimo.
    s = avancarTurnos(s, BALANCE.TURNO_MIN_TRUST_CENTER)
    // Bate o alvo: 6 controles selados e Posture alta.
    for (let i = 0; i < 6; i += 1) {
      s = reduzir(s, {
        tipo: 'jogar-carta',
        jogada: carta({ custoEnergia: 0, custoDias: 0, ganhoPostura: 20, selaControle: true }),
      })
    }
    expect(atingiuAlvo(s)).toBe(true)
    // Modo RFP exige Trust Center: nao vence so por bater o alvo.
    expect(s.resultado).toBe('em-andamento')
    expect(podePublicarTrustCenter(s, 3, 0)).toBe(true)

    s = reduzir(s, { tipo: 'publicar-trust-center', custoEnergia: 3, custoDias: 0 })
    expect(s.trustCenterPublicado).toBe(true)
    expect(s.resultado).toBe('vitoria')
  })
})

describe('imutabilidade', () => {
  it('nao muta o estado anterior', () => {
    const s = criarEstadoInicial('auditoria')
    const copia = JSON.parse(JSON.stringify(s)) as EstadoDuelo
    reduzir(s, { tipo: 'iniciar-turno' })
    expect(s).toEqual(copia)
  })
})
