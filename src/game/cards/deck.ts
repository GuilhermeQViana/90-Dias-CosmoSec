import { buscarCarta } from '@/game/cards/catalog'
import type { CartaInstancia } from '@/game/cards/types'

// Baralho e mao do Guardiao. Funcoes puras e imutaveis. O embaralhamento
// recebe um gerador injetavel para ser deterministico no teste.

export interface EstadoCartas {
  // Pilha de compra. O topo e o indice 0.
  baralho: ReadonlyArray<CartaInstancia>
  mao: ReadonlyArray<CartaInstancia>
  // Controles em campo.
  campo: ReadonlyArray<CartaInstancia>
  descarte: ReadonlyArray<CartaInstancia>
}

// Composicao do baralho inicial da fatia M-05. Os efeitos resolvidos nesta
// missao sao controle, lacre, politica e demonstrar. Frameworks, SiriusAI,
// armadilhas e os demais verbos entram com seus efeitos na M-06.
// GATE: a composicao e tunavel e influencia a dificuldade, tratar como proposta.
const BARALHO_INICIAL: ReadonlyArray<{ id: string; copias: number }> = [
  { id: 'mfa', copias: 1 },
  { id: 'cripto-repouso', copias: 1 },
  { id: 'backup-imutavel', copias: 1 },
  { id: 'segregacao-funcoes', copias: 1 },
  { id: 'edr', copias: 1 },
  { id: 'iam', copias: 1 },
  { id: 'trilha-auditoria', copias: 1 },
  { id: 'lacre-sha256', copias: 5 },
  { id: 'politica-aprovada', copias: 2 },
  { id: 'demonstrar', copias: 1 },
]

export function construirBaralho(): ReadonlyArray<CartaInstancia> {
  const cartas: CartaInstancia[] = []
  for (const { id, copias } of BARALHO_INICIAL) {
    const carta = buscarCarta(id)
    for (let i = 0; i < copias; i += 1) {
      cartas.push({ uid: `${id}-${i}`, carta, selado: false })
    }
  }
  return cartas
}

// Fisher-Yates puro. rng retorna um numero em [0, 1). Default Math.random.
export function embaralhar(
  cartas: ReadonlyArray<CartaInstancia>,
  rng: () => number = Math.random,
): ReadonlyArray<CartaInstancia> {
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

export function estadoInicialCartas(rng: () => number = Math.random): EstadoCartas {
  return {
    baralho: embaralhar(construirBaralho(), rng),
    mao: [],
    campo: [],
    descarte: [],
  }
}

// Compra n cartas do topo. Se o baralho acabar, compra o que houver.
export function comprar(estado: EstadoCartas, n: number): EstadoCartas {
  const compradas = estado.baralho.slice(0, n)
  return {
    ...estado,
    baralho: estado.baralho.slice(n),
    mao: [...estado.mao, ...compradas],
  }
}

function semCarta(lista: ReadonlyArray<CartaInstancia>, uid: string): CartaInstancia[] {
  return lista.filter((c) => c.uid !== uid)
}

export function acharNaMao(estado: EstadoCartas, uid: string): CartaInstancia | undefined {
  return estado.mao.find((c) => c.uid === uid)
}

// Move um controle da mao para o campo.
export function jogarControleNoCampo(estado: EstadoCartas, uid: string): EstadoCartas {
  const carta = acharNaMao(estado, uid)
  if (!carta || carta.carta.tipo !== 'controle') {
    return estado
  }
  return {
    ...estado,
    mao: semCarta(estado.mao, uid),
    campo: [...estado.campo, carta],
  }
}

// Descarta uma carta da mao (evidencia, jornada etc apos resolver o efeito).
export function descartarDaMao(estado: EstadoCartas, uid: string): EstadoCartas {
  const carta = acharNaMao(estado, uid)
  if (!carta) {
    return estado
  }
  return {
    ...estado,
    mao: semCarta(estado.mao, uid),
    descarte: [...estado.descarte, carta],
  }
}

// Sela um controle em campo, marcando como prova. Retorna o estado e a carta
// selada para quem precisa da Defesa dela (vira Postura no motor).
export function selarControle(
  estado: EstadoCartas,
  alvoUid: string,
): { estado: EstadoCartas; selada: CartaInstancia | null } {
  const alvo = estado.campo.find((c) => c.uid === alvoUid)
  if (!alvo || alvo.carta.tipo !== 'controle' || alvo.selado) {
    return { estado, selada: null }
  }
  const selada: CartaInstancia = { ...alvo, selado: true }
  return {
    estado: {
      ...estado,
      campo: estado.campo.map((c) => (c.uid === alvoUid ? selada : c)),
    },
    selada,
  }
}

export function controlesNaoSelados(estado: EstadoCartas): ReadonlyArray<CartaInstancia> {
  return estado.campo.filter((c) => !c.selado)
}
