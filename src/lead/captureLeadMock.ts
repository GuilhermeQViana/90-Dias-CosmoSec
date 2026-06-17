import type { CaptureResult, LeadPayload, MatchResult } from '@/lead/types'

// Implementacao MOCK da captura. Nao chama rede. Usada por padrao em dev e
// quando VITE_CAPTURE_LEAD nao for 'http'. Respeita o mesmo contrato do servidor:
// honeypot descarta em silencio, resposta opaca, falha nunca bloqueia o jogo.

export interface CaptureOptions {
  // injetavel para teste. Em producao usa o relogio real.
  now?: () => number
  // injetavel para teste. Simula latencia.
  delayMs?: number
}

function fakeLeadId(seed: number): string {
  return `mock-${seed.toString(36)}`
}

export async function captureLeadMock(
  payload: LeadPayload,
  options: CaptureOptions = {},
): Promise<CaptureResult> {
  const now = options.now ?? (() => performance.now())
  const delayMs = options.delayMs ?? 0

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  if (payload.honeypot.trim().length > 0) {
    return { ok: true, leadId: null, dropped: true }
  }

  // eslint-disable-next-line no-console
  console.info('[mock capture-lead] lead recebido', {
    cargo: payload.cargo,
    temGenero: payload.genero !== null,
    consentimento: payload.consentimento,
  })

  return { ok: true, leadId: fakeLeadId(Math.floor(now())), dropped: false }
}

export async function updateLeadResultMock(
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
