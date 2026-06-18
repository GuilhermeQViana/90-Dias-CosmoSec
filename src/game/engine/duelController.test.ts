import { describe, expect, it } from 'vitest'
import {
  cartasJogaveis,
  encerrarTurno,
  iniciarDuelo,
  jogarControle,
  selarComLacre,
  type EstadoJogo,
} from '@/game/engine/duelController'
import { buscarCarta } from '@/game/cards/catalog'
import type { CartaInstancia } from '@/game/cards/types'

const rngFixo = () => 0

function inst(id: string): CartaInstancia {
  return { uid: `${id}-test`, carta: buscarCarta(id), selado: false, seladoNoTurno: null }
}

// Coloca cartas conhecidas na mao, para nao depender da ordem do embaralhamento.
function comMao(jogo: EstadoJogo, mao: CartaInstancia[]): EstadoJogo {
  return { ...jogo, cartas: { ...jogo.cartas, mao } }
}

// Ajusta recursos direto, para testar jogadas sem depender do dano do vilao.
function comRecursos(jogo: EstadoJogo, energia: number, posture: number): EstadoJogo {
  return {
    ...jogo,
    duelo: {
      ...jogo.duelo,
      recursos: { ...jogo.duelo.recursos, energia, energiaMax: Math.max(energia, jogo.duelo.recursos.energiaMax), posture },
    },
  }
}

describe('iniciarDuelo', () => {
  it('comeca com mao inicial, recursos do modo e baralho do vilao', () => {
    const jogo = iniciarDuelo('auditoria', rngFixo)
    expect(jogo.cartas.mao.length).toBeGreaterThan(0)
    expect(jogo.duelo.recursos.dias).toBe(90)
    expect(jogo.duelo.fase).toBe('guardiao')
    expect(jogo.vilao.baralho.length).toBeGreaterThan(0)
  })
})

describe('jogarControle e selarComLacre', () => {
  it('joga controle no campo sem somar Postura ainda', () => {
    const mfa = inst('mfa')
    let jogo = comMao(comRecursos(iniciarDuelo('auditoria', rngFixo), 6, 40), [mfa])

    const postureAntes = jogo.duelo.recursos.posture
    jogo = jogarControle(jogo, mfa.uid)
    expect(jogo.cartas.campo.some((c) => c.uid === mfa.uid)).toBe(true)
    expect(jogo.duelo.recursos.posture).toBe(postureAntes)
  })

  it('selar com lacre soma Postura igual a Defesa e marca o turno do selo', () => {
    const mfa = inst('mfa')
    const lacre = inst('lacre-sha256')
    let jogo = comMao(comRecursos(iniciarDuelo('auditoria', rngFixo), 6, 40), [mfa, lacre])

    jogo = jogarControle(jogo, mfa.uid)
    const postureAntes = jogo.duelo.recursos.posture
    const seladosAntes = jogo.duelo.controlesSelados

    jogo = selarComLacre(jogo, lacre.uid, mfa.uid)
    expect(jogo.duelo.recursos.posture).toBe(postureAntes + mfa.carta.defesa)
    expect(jogo.duelo.controlesSelados).toBe(seladosAntes + 1)
    const selada = jogo.cartas.campo.find((c) => c.uid === mfa.uid)
    expect(selada?.selado).toBe(true)
    expect(selada?.seladoNoTurno).toBe(jogo.duelo.turno)
  })
})

describe('encerrarTurno com vilao', () => {
  it('o vilao consome Dias, gera eventos e o Guardiao compra no novo turno', () => {
    // Posture alta para o duelo nao terminar no teste.
    const jogo = comRecursos(iniciarDuelo('auditoria', rngFixo), 1, 100)
    const diasAntes = jogo.duelo.recursos.dias
    const maoAntes = jogo.cartas.mao.length

    const depois = encerrarTurno(jogo, rngFixo)
    expect(depois.duelo.recursos.dias).toBeLessThan(diasAntes)
    expect(depois.duelo.turno).toBe(jogo.duelo.turno + 1)
    expect(depois.cartas.mao.length).toBe(maoAntes + 1)
    expect(depois.ultimosEventos.length).toBeGreaterThan(0)
  })
})

describe('cartasJogaveis', () => {
  it('lista so cartas dentro da energia atual', () => {
    const jogo = iniciarDuelo('auditoria', rngFixo)
    for (const c of cartasJogaveis(jogo)) {
      expect(c.carta.custoEnergia).toBeLessThanOrEqual(jogo.duelo.recursos.energia)
    }
  })
})
