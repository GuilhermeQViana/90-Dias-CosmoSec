import { findMode, type ModeId } from '@/game/modes'
import { BALANCE } from '@/game/engine/balance'
import type {
  Acao,
  AtaqueVilao,
  EstadoDuelo,
  JogadaCarta,
  Recursos,
} from '@/game/engine/types'

// Motor de duelo. Funcoes puras: recebem estado e devolvem novo estado, sem
// mutar o original. Toda transicao passa por reduzir. O resultado e reavaliado
// apos cada acao para detectar vitoria ou derrota.

function clamp(valor: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, valor))
}

function comLog(estado: EstadoDuelo, linha: string): EstadoDuelo {
  return { ...estado, log: [...estado.log, linha] }
}

export function criarEstadoInicial(modo: ModeId): EstadoDuelo {
  const mode = findMode(modo)
  const recursos: Recursos = {
    dias: mode.prazoDias,
    posture: BALANCE.POSTURE_INICIAL,
    energia: BALANCE.ENERGIA_INICIAL,
    energiaMax: BALANCE.ENERGIA_MAX_INICIAL,
  }
  return {
    modo,
    turno: 1,
    fase: 'guardiao',
    recursos,
    resultado: 'em-andamento',
    controlesSelados: 0,
    trustCenterPublicado: false,
    log: [`Duelo iniciado no modo ${mode.titulo}.`],
  }
}

// Condicao de vitoria por Posture, sem depender de jogar Trust Center.
// Vence quem atinge o alvo do modo com o minimo de controles selados, desde
// que o modo nao exija fechar pelo Trust Center.
export function atingiuAlvo(estado: EstadoDuelo): boolean {
  const mode = findMode(estado.modo)
  return (
    estado.recursos.posture >= mode.alvoPostura &&
    estado.controlesSelados >= mode.minControlesSelados
  )
}

// Reavalia o resultado apos uma acao. Derrota tem prioridade: relogio zera ou
// Posture cai ao piso critico. Vitoria por alvo so vale se o modo nao exigir
// Trust Center; nesse caso a vitoria vem da acao publicar-trust-center.
function avaliarResultado(estado: EstadoDuelo): EstadoDuelo {
  if (estado.resultado !== 'em-andamento') {
    return estado
  }

  if (estado.recursos.dias <= 0) {
    return comLog({ ...estado, fase: 'fim', resultado: 'derrota' }, 'Os Dias zeraram. O 90 Dias prevaleceu.')
  }
  if (estado.recursos.posture <= BALANCE.POSTURE_PISO_CRITICO) {
    return comLog({ ...estado, fase: 'fim', resultado: 'derrota' }, 'A Posture caiu ao piso critico.')
  }

  const mode = findMode(estado.modo)
  if (!mode.exigeTrustCenter && atingiuAlvo(estado)) {
    return comLog({ ...estado, fase: 'fim', resultado: 'vitoria' }, 'Alvo de Postura batido. A constelacao acende.')
  }

  return estado
}

export function podeJogarCarta(estado: EstadoDuelo, jogada: JogadaCarta): boolean {
  return (
    estado.resultado === 'em-andamento' &&
    estado.fase === 'guardiao' &&
    estado.recursos.energia >= jogada.custoEnergia &&
    estado.recursos.dias >= jogada.custoDias
  )
}

export function podePublicarTrustCenter(
  estado: EstadoDuelo,
  custoEnergia: number,
  custoDias: number,
): boolean {
  return (
    estado.resultado === 'em-andamento' &&
    estado.fase === 'guardiao' &&
    estado.turno >= BALANCE.TURNO_MIN_TRUST_CENTER &&
    estado.recursos.energia >= custoEnergia &&
    estado.recursos.dias >= custoDias &&
    atingiuAlvo(estado)
  )
}

function iniciarTurno(estado: EstadoDuelo): EstadoDuelo {
  // Recarrega energia e faz o teto crescer devagar ate o limite.
  const energiaMax = Math.min(
    estado.recursos.energiaMax + BALANCE.ENERGIA_CRESCIMENTO_POR_TURNO,
    BALANCE.ENERGIA_MAX_TETO,
  )
  const recursos: Recursos = {
    ...estado.recursos,
    energiaMax,
    energia: energiaMax,
  }
  // A compra de carta em si e do sistema de cartas (M-05). Aqui so registra.
  return comLog(
    { ...estado, fase: 'guardiao', recursos },
    `Turno ${estado.turno} do Guardiao. Energia ${energiaMax}. Compra ${BALANCE.COMPRA_POR_TURNO}.`,
  )
}

function jogarCarta(estado: EstadoDuelo, jogada: JogadaCarta): EstadoDuelo {
  if (!podeJogarCarta(estado, jogada)) {
    return comLog(estado, 'Jogada invalida ignorada.')
  }
  const recursos: Recursos = {
    ...estado.recursos,
    energia: estado.recursos.energia - jogada.custoEnergia,
    dias: estado.recursos.dias - jogada.custoDias,
    posture: clamp(
      estado.recursos.posture + jogada.ganhoPostura,
      BALANCE.POSTURE_MIN,
      BALANCE.POSTURE_MAX,
    ),
  }
  const proximo: EstadoDuelo = {
    ...estado,
    recursos,
    controlesSelados: estado.controlesSelados + (jogada.selaControle ? 1 : 0),
  }
  return avaliarResultado(comLog(proximo, `Carta jogada. Posture ${recursos.posture}.`))
}

function encerrarTurno(estado: EstadoDuelo): EstadoDuelo {
  if (estado.fase !== 'guardiao' || estado.resultado !== 'em-andamento') {
    return estado
  }
  return comLog({ ...estado, fase: 'vilao' }, 'Guardiao encerra o turno.')
}

function turnoVilao(estado: EstadoDuelo, ataque: AtaqueVilao): EstadoDuelo {
  if (estado.fase !== 'vilao' || estado.resultado !== 'em-andamento') {
    return estado
  }
  const recursos: Recursos = {
    ...estado.recursos,
    dias: estado.recursos.dias - ataque.reducaoDias,
    posture: clamp(
      estado.recursos.posture - ataque.danoPostura,
      BALANCE.POSTURE_MIN,
      BALANCE.POSTURE_MAX,
    ),
  }
  // Apos o vilao agir, passa a vez de volta e abre o proximo turno do Guardiao.
  const aposAtaque: EstadoDuelo = {
    ...estado,
    recursos,
    turno: estado.turno + 1,
  }
  const avaliado = avaliarResultado(
    comLog(aposAtaque, `O 90 Dias ataca. Dias ${recursos.dias}, Posture ${recursos.posture}.`),
  )
  if (avaliado.resultado !== 'em-andamento') {
    return avaliado
  }
  return iniciarTurno(avaliado)
}

function publicarTrustCenter(
  estado: EstadoDuelo,
  custoEnergia: number,
  custoDias: number,
): EstadoDuelo {
  if (!podePublicarTrustCenter(estado, custoEnergia, custoDias)) {
    return comLog(estado, 'Trust Center indisponivel agora.')
  }
  const recursos: Recursos = {
    ...estado.recursos,
    energia: estado.recursos.energia - custoEnergia,
    dias: estado.recursos.dias - custoDias,
  }
  // Vitoria instantanea: o alvo ja esta batido (checado em podePublicar).
  return comLog(
    { ...estado, recursos, trustCenterPublicado: true, fase: 'fim', resultado: 'vitoria' },
    'Trust Center publicado. A postura e selada e a ampulheta estilhaca.',
  )
}

export function reduzir(estado: EstadoDuelo, acao: Acao): EstadoDuelo {
  switch (acao.tipo) {
    case 'iniciar-turno':
      return iniciarTurno(estado)
    case 'jogar-carta':
      return jogarCarta(estado, acao.jogada)
    case 'encerrar-turno':
      return encerrarTurno(estado)
    case 'turno-vilao':
      return turnoVilao(estado, acao.ataque)
    case 'publicar-trust-center':
      return publicarTrustCenter(estado, acao.custoEnergia, acao.custoDias)
    default: {
      // Exaustividade: se um novo tipo de acao surgir, o TS aponta aqui.
      const _exausto: never = acao
      return _exausto
    }
  }
}
