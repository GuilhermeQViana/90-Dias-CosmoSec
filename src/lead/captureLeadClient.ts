import type { CaptureResult, LeadPayload, MatchResult } from '@/lead/types'
import { captureLeadMock, updateLeadResultMock } from '@/lead/captureLeadMock'
import { captureLeadHttp, updateLeadResultHttp } from '@/lead/captureLeadHttp'

// Fachada de captura de lead. Escolhe a implementacao por env:
// VITE_CAPTURE_LEAD === 'http' usa a Edge Function real; qualquer outro valor
// (ou ausencia) usa o mock. Assim o jogo roda em dev sem backend.

export type { CaptureResult, MatchResult } from '@/lead/types'

function usandoHttp(): boolean {
  return import.meta.env.VITE_CAPTURE_LEAD === 'http'
}

export function captureLead(payload: LeadPayload): Promise<CaptureResult> {
  return usandoHttp() ? captureLeadHttp(payload) : captureLeadMock(payload)
}

export function updateLeadResult(
  leadId: string | null,
  result: MatchResult,
): Promise<CaptureResult> {
  return usandoHttp() ? updateLeadResultHttp(leadId, result) : updateLeadResultMock(leadId, result)
}
