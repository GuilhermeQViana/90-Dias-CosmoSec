import { describe, expect, it } from 'vitest'
import {
  cartasJogaveis,
  encerrarTurno,
  iniciarDuelo,
  jogarControle,
  selarComLacre,
  type EstadoJogo,
} from '@/game/engine/duelController'

// rng deterministico para baralho reproduzivel nos testes.
const rngFixo = () => 0

function maoTem(estado: EstadoJogo, efeito: string): string | undefined {
  return estado.cartas.mao.find((c) => c.carta.efeito === efeito)?.uid
}

describe('iniciarDuelo', () => {
  it('comeca com mao inicial e recursos do modo', () => {
    const jogo = iniciarDuelo('auditoria', rngFixo)
    expect(jogo.cartas.mao.length).toBeGreaterThan(0)
    expect(jogo.duelo.recursos.dias).toBe(90)
    expect(jogo.duelo.fase).toBe('guardiao')
  })
})

describe('jogarControle e selarComLacre', () => {
  it('joga controle no campo gastando recursos, sem somar Postura ainda', () => {
    let jogo = iniciarDuelo('auditoria', rngFixo)
    // Garante energia e dias suficientes avancando ate ter folga de energia.
    jogo = encerrarTurno(jogo) // turno 2, energia recarregada e maior
    const controleUid = jogo.cartas.mao.find((c) => c.carta.tipo === 'controle')?.uid
    if (!controleUid) throw new Error('precisa de um controle na mao')

    const postureAntes = jogo.duelo.recursos.posture
    jogo = jogarControle(jogo, controleUid)
    expect(jogo.cartas.campo.some((c) => c.uid === controleUid)).toBe(true)
    // Controle sozinho nao soma Postura. So ao selar.
    expect(jogo.duelo.recursos.posture).toBe(postureAntes)
  })

  it('selar com lacre soma Postura igual a Defesa e conta como prova', () => {
    let jogo = iniciarDuelo('auditoria', rngFixo)
    // Avanca alguns turnos para ter energia para controle e lacre no mesmo turno.
    jogo = encerrarTurno(jogo)
    jogo = encerrarTurno(jogo)
    jogo = encerrarTurno(jogo)

    const controle = jogo.cartas.mao.find((c) => c.carta.tipo === 'controle')
    const lacreUid = maoTem(jogo, 'lacre')
    if (!controle || !lacreUid) throw new Error('precisa de controle e lacre na mao')

    jogo = jogarControle(jogo, controle.uid)
    const postureAntes = jogo.duelo.recursos.posture
    const seladosAntes = jogo.duelo.controlesSelados

    jogo = selarComLacre(jogo, lacreUid, controle.uid)
    expect(jogo.duelo.recursos.posture).toBe(postureAntes + controle.carta.defesa)
    expect(jogo.duelo.controlesSelados).toBe(seladosAntes + 1)
    expect(jogo.cartas.campo.find((c) => c.uid === controle.uid)?.selado).toBe(true)
  })
})

describe('encerrarTurno', () => {
  it('consome Dias do vilao e compra carta no novo turno', () => {
    const jogo = iniciarDuelo('auditoria', rngFixo)
    const diasAntes = jogo.duelo.recursos.dias
    const maoAntes = jogo.cartas.mao.length
    const depois = encerrarTurno(jogo)
    expect(depois.duelo.recursos.dias).toBeLessThan(diasAntes)
    expect(depois.duelo.turno).toBe(jogo.duelo.turno + 1)
    expect(depois.cartas.mao.length).toBe(maoAntes + 1)
  })
})

describe('cartasJogaveis', () => {
  it('lista so cartas dentro da energia atual', () => {
    const jogo = iniciarDuelo('auditoria', rngFixo) // energia 1 no turno 1
    const jogaveis = cartasJogaveis(jogo)
    for (const c of jogaveis) {
      expect(c.carta.custoEnergia).toBeLessThanOrEqual(jogo.duelo.recursos.energia)
    }
  })
})
