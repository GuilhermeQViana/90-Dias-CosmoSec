import { VILAO_BALANCE } from '@/game/engine/balance'
import { aplicarDanoVilao } from '@/game/engine/engine'
import type { EstadoDuelo } from '@/game/engine/types'
import { findMode } from '@/game/modes'
import {
  destruirControle,
  dessellarControle,
  temControleEmCampo,
  type EstadoCartas,
} from '@/game/cards/deck'
import type { CartaInstancia } from '@/game/cards/types'
import { CATALOGO_VILAO } from '@/game/villain/catalog'
import type { CartaVilao, EstadoVilao } from '@/game/villain/types'

// IA do vilao 90 Dias. Pura e testavel. A cada turno o vilao saca cartas
// (com escalonamento) e resolve seus efeitos contra as defesas do Guardiao.

export interface ResultadoTurnoVilao {
  duelo: EstadoDuelo
  cartas: EstadoCartas
  vilao: EstadoVilao
  eventos: ReadonlyArray<string>
}

// Quantas cartas o vilao saca neste turno. Comeca em 1 e cresce a cada janela
// de Dias gastos (secao 9: a cada 18 dias que caem, uma carta a mais).
export function escalonamento(diasGastos: number): number {
  const extra = Math.floor(Math.max(0, diasGastos) / VILAO_BALANCE.ESCALONAMENTO_DIAS)
  return 1 + extra
}

function embaralharVilao(
  cartas: ReadonlyArray<CartaVilao>,
  rng: () => number,
): ReadonlyArray<CartaVilao> {
  const out = [...cartas]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    const a = out[i]
    const b = out[j]
    if (a && b) {
      out[i] = b
      out[j] = a
    }
  }
  return out
}

export function construirBaralhoVilao(rng: () => number = Math.random): EstadoVilao {
  return { baralho: embaralharVilao(CATALOGO_VILAO, rng), descarte: [] }
}

// Compra n cartas do vilao. Se o baralho acabar, reembaralha o descarte.
function comprarVilao(
  vilao: EstadoVilao,
  n: number,
  rng: () => number,
): { cartas: CartaVilao[]; vilao: EstadoVilao } {
  let baralho = [...vilao.baralho]
  let descarte = [...vilao.descarte]
  const compradas: CartaVilao[] = []
  for (let i = 0; i < n; i += 1) {
    if (baralho.length === 0) {
      if (descarte.length === 0) break
      baralho = [...embaralharVilao(descarte, rng)]
      descarte = []
    }
    const topo = baralho.shift()
    if (topo) compradas.push(topo)
  }
  return { cartas: compradas, vilao: { baralho, descarte } }
}

// Tira a Postura e a contagem de uma prova selada que foi perdida.
function removerProva(duelo: EstadoDuelo, defesa: number): EstadoDuelo {
  const aposDano = aplicarDanoVilao(duelo, { danoPostura: defesa, reducaoDias: 0 })
  return { ...aposDano, controlesSelados: Math.max(0, aposDano.controlesSelados - 1) }
}

function alvoRansomware(cartas: EstadoCartas): CartaInstancia | null {
  const naoSelado = cartas.campo.find((c) => !c.selado)
  if (naoSelado) return naoSelado
  return cartas.campo[0] ?? null
}

function seloVulneravel(cartas: EstadoCartas, turnoAtual: number): CartaInstancia | null {
  return (
    cartas.campo.find(
      (c) =>
        c.selado &&
        c.seladoNoTurno !== null &&
        turnoAtual - c.seladoNoTurno >= VILAO_BALANCE.EVIDENCIA_VENCIDA_IDADE,
    ) ?? null
  )
}

interface Passo {
  duelo: EstadoDuelo
  cartas: EstadoCartas
  evento: string
}

// Resolve uma carta do vilao contra o estado atual. Cada Ameaca responde a uma
// defesa: o controle certo no campo absorve ou reduz o golpe.
function resolverCarta(duelo: EstadoDuelo, cartas: EstadoCartas, carta: CartaVilao): Passo {
  const dano = (n: number): EstadoDuelo =>
    aplicarDanoVilao(duelo, { danoPostura: n, reducaoDias: 0 })

  switch (carta.efeito) {
    case 'phishing':
      if (temControleEmCampo(cartas, 'mfa')) {
        return { duelo, cartas, evento: 'Phishing absorvido pelo MFA.' }
      }
      return { duelo: dano(VILAO_BALANCE.PHISHING_DANO), cartas, evento: 'Phishing acerta a Postura.' }

    case 'ransomware': {
      if (temControleEmCampo(cartas, 'backup-imutavel')) {
        return { duelo, cartas, evento: 'Ransomware anulado pelo Backup Imutavel.' }
      }
      const alvo = alvoRansomware(cartas)
      if (!alvo) {
        return { duelo, cartas, evento: 'Ransomware sem alvo no campo.' }
      }
      const cartasPos = destruirControle(cartas, alvo.uid)
      const dueloPos = alvo.selado ? removerProva(duelo, alvo.carta.defesa) : duelo
      return { duelo: dueloPos, cartas: cartasPos, evento: `Ransomware destroi ${alvo.carta.nome}.` }
    }

    case 'vazamento-fornecedor':
      if (temControleEmCampo(cartas, 'iam')) {
        return {
          duelo: dano(VILAO_BALANCE.VAZAMENTO_DANO_REDUZIDO),
          cartas,
          evento: 'Vazamento contido pelo IAM, dano reduzido.',
        }
      }
      return { duelo: dano(VILAO_BALANCE.VAZAMENTO_DANO), cartas, evento: 'Vazamento de Fornecedor acerta.' }

    case 'insider':
      if (temControleEmCampo(cartas, 'segregacao-funcoes')) {
        return {
          duelo: dano(VILAO_BALANCE.INSIDER_DANO_REDUZIDO),
          cartas,
          evento: 'Insider contido pela Segregacao de Funcoes.',
        }
      }
      return { duelo: dano(VILAO_BALANCE.INSIDER_DANO), cartas, evento: 'Insider acerta a Postura.' }

    case 'ddos':
      return {
        duelo: { ...duelo, penalidadeEnergia: duelo.penalidadeEnergia + VILAO_BALANCE.DDOS_PENALIDADE_ENERGIA },
        cartas,
        evento: 'DDoS bloqueia uma carta no proximo turno.',
      }

    case 'evidencia-vencida': {
      const selo = seloVulneravel(cartas, duelo.turno)
      if (!selo) {
        return { duelo, cartas, evento: 'Evidencia Vencida nao achou selo antigo.' }
      }
      return {
        duelo: removerProva(duelo, selo.carta.defesa),
        cartas: dessellarControle(cartas, selo.uid),
        evento: `Evidencia Vencida derruba o selo de ${selo.carta.nome}.`,
      }
    }

    case 'prazo-apertado':
      return {
        duelo: aplicarDanoVilao(duelo, { danoPostura: 0, reducaoDias: VILAO_BALANCE.PRAZO_APERTADO_DIAS }),
        cartas,
        evento: 'Prazo Apertado acelera o relogio.',
      }

    case 'lacuna':
      return { duelo: dano(VILAO_BALANCE.LACUNA_DANO), cartas, evento: 'Lacuna abre um gap nao coberto.' }

    case 'auditoria-surpresa':
      if (temControleEmCampo(cartas, 'trilha-auditoria')) {
        return { duelo, cartas, evento: 'Auditoria Surpresa respondida pela Trilha de Auditoria.' }
      }
      return {
        duelo: dano(VILAO_BALANCE.AUDITORIA_SURPRESA_DANO),
        cartas,
        evento: 'Auditoria Surpresa sem prova, perde Postura.',
      }

    case 'achado-critico':
      return { duelo: dano(VILAO_BALANCE.ACHADO_CRITICO_DANO), cartas, evento: 'Achado Critico cobra Postura.' }

    default: {
      const _exausto: never = carta.efeito
      return { duelo, cartas, evento: `Efeito desconhecido ${String(_exausto)}.` }
    }
  }
}

export function resolverTurnoVilao(
  duelo: EstadoDuelo,
  cartas: EstadoCartas,
  vilao: EstadoVilao,
  rng: () => number = Math.random,
): ResultadoTurnoVilao {
  const eventos: string[] = []
  if (duelo.fase !== 'vilao' || duelo.resultado !== 'em-andamento') {
    return { duelo, cartas, vilao, eventos }
  }

  // Relogio base do turno do vilao.
  let estadoDuelo = aplicarDanoVilao(duelo, {
    danoPostura: 0,
    reducaoDias: VILAO_BALANCE.REDUCAO_DIAS_BASE,
  })
  eventos.push(`O 90 Dias gira a ampulheta. Dias ${estadoDuelo.recursos.dias}.`)
  if (estadoDuelo.resultado !== 'em-andamento') {
    return { duelo: estadoDuelo, cartas, vilao, eventos }
  }

  const mode = findMode(estadoDuelo.modo)
  const diasGastos = mode.prazoDias - estadoDuelo.recursos.dias
  const quantas = escalonamento(diasGastos)

  const { cartas: sacadas, vilao: vilaoPos } = comprarVilao(vilao, quantas, rng)
  let estadoCartas = cartas
  const descarte = [...vilaoPos.descarte]

  for (const carta of sacadas) {
    if (estadoDuelo.resultado !== 'em-andamento') {
      descarte.push(carta)
      continue
    }
    const passo = resolverCarta(estadoDuelo, estadoCartas, carta)
    estadoDuelo = passo.duelo
    estadoCartas = passo.cartas
    descarte.push(carta)
    eventos.push(passo.evento)
  }

  return {
    duelo: estadoDuelo,
    cartas: estadoCartas,
    vilao: { baralho: vilaoPos.baralho, descarte },
    eventos,
  }
}
