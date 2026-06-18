// Jogo de cenarios: o Guardiao percorre os cinco verbos da metodologia
// CosmoSec (Diagnosticar, Planejar, Operar, Monitorar, Demonstrar). Cada rodada
// traz um cenario e tres escolhas. Score honesto, sem inflar nem zerar falso.

export type Verbo = 'Diagnosticar' | 'Planejar' | 'Operar' | 'Monitorar' | 'Demonstrar'

export interface Escolha {
  id: string
  titulo: string
  descricao: string
  // Custo em Dias e variacao de Posture. delta pode ser negativo.
  custoDias: number
  deltaScore: number
  // Normas ou frameworks que a escolha acende. So rotulo, sem overclaim.
  normas: ReadonlyArray<string>
  resultado: string
  licao: string
  // A jogada mais alinhada a metodologia. Usada so para telemetria interna.
  melhor: boolean
}

export interface Rodada {
  verbo: Verbo
  contexto: string
  cenario: string
  // Alerta de incidente opcional (Ameaca em andamento).
  alerta?: string
  // Sugestao do aliado de IA SiriusAI, opcional. Humano no loop.
  sirius?: string
  escolhas: ReadonlyArray<Escolha>
}

export type FaseCenario = 'escolha' | 'resultado' | 'fim'

export interface EstadoCenario {
  step: number
  score: number
  days: number
  fase: FaseCenario
  ultimaEscolha: Escolha | null
}
