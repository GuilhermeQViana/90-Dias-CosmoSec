import { CAMPANHA } from '@/game/scenario/campaign'
import type { Rodada, Verbo } from '@/game/scenario/types'

// A jornada unificada divide o duelo em 5 atos, um por verbo. O ato atual deriva
// da fracao de Dias ja gastos: a narrativa do verbo se desenrola conforme a
// ampulheta corre. Cada ato reaproveita o cenario, o contexto, o alerta e a
// sugestao do SiriusAI da campanha.

export const VERBOS: ReadonlyArray<Verbo> = [
  'Diagnosticar',
  'Planejar',
  'Operar',
  'Monitorar',
  'Demonstrar',
]

// Indice do ato (0 a 4) a partir do prazo do modo e dos Dias restantes.
export function atoIndex(prazoDias: number, diasRestantes: number): number {
  if (prazoDias <= 0) return VERBOS.length - 1
  const gastosFrac = (prazoDias - diasRestantes) / prazoDias
  const idx = Math.floor(gastosFrac * VERBOS.length)
  return Math.max(0, Math.min(VERBOS.length - 1, idx))
}

export function narrativaDoAto(index: number): Rodada {
  const r = CAMPANHA[Math.max(0, Math.min(CAMPANHA.length - 1, index))]
  if (!r) {
    throw new Error('Ato sem narrativa')
  }
  return r
}
