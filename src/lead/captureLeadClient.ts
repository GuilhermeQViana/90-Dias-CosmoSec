import type { LeadPayload } from '@/lead/types'

// Cliente de captura de lead. Na M-02 e um MOCK: nao chama rede de verdade.
// A Edge Function capture-lead real entra na M-03.
//
// Contrato que o mock respeita, igual ao servidor futuro:
// - Honeypot preenchido: trata como bot, descarta em silencio, finge sucesso.
// - Falha de envio NUNCA bloqueia o jogo. Quem chama deve seguir o jogo de qualquer jeito.
// - Resposta opaca: ok ou erro generico, sem ecoar a base.

export interface CaptureResult {
  ok: boolean
  // id do lead, usado depois no segundo POST para atualizar score. Mock gera um placeholder.
  leadId: string | null
  // descartado por honeypot. Do ponto de vista do jogo, segue normal.
  dropped: boolean
}

export interface CaptureOptions {
  // injetavel para teste. Em producao usa o relogio real.
  now?: () => number
  // injetavel para teste. Simula latencia. Em producao nao espera.
  delayMs?: number
}

function fakeLeadId(seed: number): string {
  // id legivel so para o mock. O id real vem do banco (uuid) na M-03.
  return `mock-${seed.toString(36)}`
}

export async function captureLead(
  payload: LeadPayload,
  options: CaptureOptions = {},
): Promise<CaptureResult> {
  const now = options.now ?? (() => performance.now())
  const delayMs = options.delayMs ?? 0

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  // Honeypot: campo escondido que humano nunca preenche.
  if (payload.honeypot.trim().length > 0) {
    return { ok: true, leadId: null, dropped: true }
  }

  // Mock: registra no console para inspecao no dev e finge persistencia.
  // Nao loga PII alem do necessario para depurar o fluxo.
  // eslint-disable-next-line no-console
  console.info('[mock capture-lead] lead recebido', {
    cargo: payload.cargo,
    temGenero: payload.genero !== null,
    consentimento: payload.consentimento,
  })

  return { ok: true, leadId: fakeLeadId(Math.floor(now())), dropped: false }
}

// Segundo POST, ao fim da partida. Mock por enquanto.
export interface MatchResult {
  modoJogado: string
  scoreFinal: number
}

export async function updateLeadResult(
  leadId: string | null,
  result: MatchResult,
): Promise<CaptureResult> {
  if (leadId === null) {
    return { ok: false, leadId: null, dropped: false }
  }
  // eslint-disable-next-line no-console
  console.info('[mock capture-lead] resultado da partida', { leadId, ...result })
  return { ok: true, leadId, dropped: false }
}
