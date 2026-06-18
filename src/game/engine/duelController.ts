import type { ModeId } from '@/game/modes'
import { BALANCE } from '@/game/engine/balance'
import {
  criarEstadoInicial,
  passarTurno,
  podeJogarCarta,
  podePublicarTrustCenter,
  reduzir,
} from '@/game/engine/engine'
import type { EstadoDuelo } from '@/game/engine/types'
import {
  comprar,
  descartarDaMao,
  estadoInicialCartas,
  jogarControleNoCampo,
  selarControle,
  type EstadoCartas,
} from '@/game/cards/deck'
import type { CartaInstancia } from '@/game/cards/types'
import { construirBaralhoVilao, resolverTurnoVilao } from '@/game/villain/ai'
import type { EstadoVilao } from '@/game/villain/types'

// Controlador do duelo: une o motor (recursos, vitoria), as cartas (mao, campo,
// baralho) e o vilao (M-06) em acoes de alto nivel. Puro e imutavel.

export interface EstadoJogo {
  duelo: EstadoDuelo
  cartas: EstadoCartas
  vilao: EstadoVilao
  // Eventos do ultimo turno do vilao, para a cena exibir.
  ultimosEventos: ReadonlyArray<string>
}

export function iniciarDuelo(modo: ModeId, rng: () => number = Math.random): EstadoJogo {
  const cartas = comprar(estadoInicialCartas(rng), BALANCE.MAO_INICIAL)
  return {
    duelo: criarEstadoInicial(modo),
    cartas,
    vilao: construirBaralhoVilao(rng),
    ultimosEventos: [],
  }
}

// Joga um controle da mao no campo, pagando energia e dias. Ainda nao gera
// Postura: a Postura vem ao selar com o Lacre.
export function jogarControle(estado: EstadoJogo, uid: string): EstadoJogo {
  const carta = estado.cartas.mao.find((c) => c.uid === uid)
  if (!carta || carta.carta.tipo !== 'controle') {
    return estado
  }
  const jogada = {
    custoEnergia: carta.carta.custoEnergia,
    custoDias: carta.carta.custoDias,
    ganhoPostura: 0,
    selaControle: false,
  }
  if (!podeJogarCarta(estado.duelo, jogada)) {
    return estado
  }
  return {
    ...estado,
    duelo: reduzir(estado.duelo, { tipo: 'jogar-carta', jogada }),
    cartas: jogarControleNoCampo(estado.cartas, uid),
  }
}

// Sela um controle em campo usando um Lacre da mao. Soma Postura igual a Defesa
// do controle e conta como prova para a regra de vitoria.
export function selarComLacre(estado: EstadoJogo, lacreUid: string, alvoUid: string): EstadoJogo {
  const lacre = estado.cartas.mao.find((c) => c.uid === lacreUid)
  const alvo = estado.cartas.campo.find((c) => c.uid === alvoUid)
  if (!lacre || lacre.carta.efeito !== 'lacre') {
    return estado
  }
  if (!alvo || alvo.carta.tipo !== 'controle' || alvo.selado) {
    return estado
  }
  const jogada = {
    custoEnergia: lacre.carta.custoEnergia,
    custoDias: lacre.carta.custoDias,
    // Defesa do controle mais o bonus de crosswalk pela cobertura de normas.
    ganhoPostura: alvo.carta.defesa + bonusCrosswalk(alvo.carta.cobertura.length),
    selaControle: true,
  }
  if (!podeJogarCarta(estado.duelo, jogada)) {
    return estado
  }
  const { estado: cartasSeladas } = selarControle(estado.cartas, alvoUid, estado.duelo.turno)
  return {
    ...estado,
    duelo: reduzir(estado.duelo, { tipo: 'jogar-carta', jogada }),
    cartas: descartarDaMao(cartasSeladas, lacreUid),
  }
}

// Anexa uma Politica Aprovada a um controle ja selado, somando 1 Postura.
export function aplicarPolitica(estado: EstadoJogo, politicaUid: string, alvoUid: string): EstadoJogo {
  const politica = estado.cartas.mao.find((c) => c.uid === politicaUid)
  const alvo = estado.cartas.campo.find((c) => c.uid === alvoUid)
  if (!politica || politica.carta.efeito !== 'politica') {
    return estado
  }
  if (!alvo || alvo.carta.tipo !== 'controle' || !alvo.selado) {
    return estado
  }
  const jogada = {
    custoEnergia: politica.carta.custoEnergia,
    custoDias: politica.carta.custoDias,
    ganhoPostura: 1,
    selaControle: false,
  }
  if (!podeJogarCarta(estado.duelo, jogada)) {
    return estado
  }
  return {
    ...estado,
    duelo: reduzir(estado.duelo, { tipo: 'jogar-carta', jogada }),
    cartas: descartarDaMao(estado.cartas, politicaUid),
  }
}

// Bonus de Postura do combo de crosswalk: a Defesa mais um extra por cada norma
// alem da primeira que o controle cobre. E o moat virado mecanica.
export function bonusCrosswalk(normas: number): number {
  return Math.max(0, normas - 1) * BALANCE.CROSSWALK_BONUS_POR_NORMA
}

export function podePublicar(estado: EstadoJogo, demonstrarUid: string): boolean {
  const carta = estado.cartas.mao.find((c) => c.uid === demonstrarUid)
  if (!carta || carta.carta.efeito !== 'demonstrar') {
    return false
  }
  return podePublicarTrustCenter(estado.duelo, carta.carta.custoEnergia, carta.carta.custoDias)
}

export function publicarTrustCenter(estado: EstadoJogo, demonstrarUid: string): EstadoJogo {
  const carta = estado.cartas.mao.find((c) => c.uid === demonstrarUid)
  if (!carta || carta.carta.efeito !== 'demonstrar') {
    return estado
  }
  if (!podePublicar(estado, demonstrarUid)) {
    return estado
  }
  return {
    ...estado,
    duelo: reduzir(estado.duelo, {
      tipo: 'publicar-trust-center',
      custoEnergia: carta.carta.custoEnergia,
      custoDias: carta.carta.custoDias,
    }),
    cartas: descartarDaMao(estado.cartas, demonstrarUid),
  }
}

// Encerra o turno do Guardiao, resolve o turno do vilao 90 Dias (IA da M-06) e
// compra as cartas do novo turno.
export function encerrarTurno(estado: EstadoJogo, rng: () => number = Math.random): EstadoJogo {
  if (estado.duelo.fase !== 'guardiao' || estado.duelo.resultado !== 'em-andamento') {
    return estado
  }
  const naFaseVilao = reduzir(estado.duelo, { tipo: 'encerrar-turno' })
  const res = resolverTurnoVilao(naFaseVilao, estado.cartas, estado.vilao, rng)

  if (res.duelo.resultado !== 'em-andamento') {
    return { duelo: res.duelo, cartas: res.cartas, vilao: res.vilao, ultimosEventos: res.eventos }
  }
  return {
    duelo: passarTurno(res.duelo),
    cartas: comprar(res.cartas, BALANCE.COMPRA_POR_TURNO),
    vilao: res.vilao,
    ultimosEventos: res.eventos,
  }
}

// Cartas da mao que o Guardiao consegue jogar agora, para a UI destacar.
export function cartasJogaveis(estado: EstadoJogo): ReadonlyArray<CartaInstancia> {
  return estado.cartas.mao.filter((c) => {
    if (c.carta.efeito === 'demonstrar') {
      return podePublicar(estado, c.uid)
    }
    return podeJogarCarta(estado.duelo, {
      custoEnergia: c.carta.custoEnergia,
      custoDias: c.carta.custoDias,
      ganhoPostura: 0,
      selaControle: false,
    })
  })
}
