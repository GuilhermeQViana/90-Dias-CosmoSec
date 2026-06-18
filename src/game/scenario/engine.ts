import { CAMPANHA } from '@/game/scenario/campaign'
import type { Escolha, EstadoCenario } from '@/game/scenario/types'

// Motor do jogo de cenarios. Funcoes puras e imutaveis. Score honesto:
// comeca baixo, tem piso de 5 (nunca zero falso) e teto de 100.

const SCORE_INICIAL = 24
const SCORE_MIN = 5
const SCORE_MAX = 100
const DIAS_INICIAIS = 90

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function totalRodadas(): number {
  return CAMPANHA.length
}

export function rodadaAtual(estado: EstadoCenario) {
  return CAMPANHA[estado.step]
}

export function estadoInicial(): EstadoCenario {
  return { step: 0, score: SCORE_INICIAL, days: DIAS_INICIAIS, fase: 'escolha', ultimaEscolha: null }
}

// Aplica uma escolha: ajusta Posture e Dias e passa a mostrar o resultado.
export function escolher(estado: EstadoCenario, escolha: Escolha): EstadoCenario {
  if (estado.fase !== 'escolha') {
    return estado
  }
  return {
    ...estado,
    score: clamp(estado.score + escolha.deltaScore, SCORE_MIN, SCORE_MAX),
    days: Math.max(0, estado.days - escolha.custoDias),
    fase: 'resultado',
    ultimaEscolha: escolha,
  }
}

// Avanca para a proxima rodada ou encerra a campanha.
export function continuar(estado: EstadoCenario): EstadoCenario {
  if (estado.fase !== 'resultado') {
    return estado
  }
  const proximo = estado.step + 1
  if (proximo >= CAMPANHA.length) {
    return { ...estado, fase: 'fim', ultimaEscolha: null }
  }
  return { ...estado, step: proximo, fase: 'escolha', ultimaEscolha: null }
}

export type Faixa = 'defensavel' | 'demonstravel' | 'sobrevivencia'

export function faixa(score: number): Faixa {
  if (score >= 75) return 'defensavel'
  if (score >= 50) return 'demonstravel'
  return 'sobrevivencia'
}

// Veredito honesto por faixa (secao 12 do prompt mestre).
export function veredito(score: number): string {
  switch (faixa(score)) {
    case 'defensavel':
      return 'Postura defensavel. Voce chega a auditoria com prova que se sustenta sozinha, publica e honesta.'
    case 'demonstravel':
      return 'Da para demonstrar, mas com lacunas. Ainda ha controles em unknown que o auditor vai cobrar.'
    case 'sobrevivencia':
      return 'Voce sobreviveu, mas no improviso. O auditor faria perguntas que a sua prova nao responde.'
  }
}
