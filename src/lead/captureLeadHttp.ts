import type { CaptureResult, LeadPayload, MatchResult } from '@/lead/types'

// Implementacao HTTP real: chama a Edge Function capture-lead. Usada quando
// VITE_CAPTURE_LEAD === 'http' e as variaveis do Supabase estao definidas.
// Mantem o contrato: nunca lanca para o chamador, falha vira ok false sem travar.

interface SupabaseEnv {
  url: string
  anonKey: string
}

function readEnv(): SupabaseEnv | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (typeof url !== 'string' || typeof anonKey !== 'string' || url === '' || anonKey === '') {
    return null
  }
  return { url, anonKey }
}

function endpoint(env: SupabaseEnv): string {
  return `${env.url.replace(/\/$/, '')}/functions/v1/capture-lead`
}

async function postJson(env: SupabaseEnv, body: unknown): Promise<CaptureResult> {
  try {
    const resp = await fetch(endpoint(env), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.anonKey}`,
        apikey: env.anonKey,
      },
      body: JSON.stringify(body),
    })
    const data = (await resp.json().catch(() => ({}))) as { ok?: boolean; leadId?: string | null }
    return {
      ok: data.ok === true,
      leadId: typeof data.leadId === 'string' ? data.leadId : null,
      dropped: false,
    }
  } catch {
    // Falha de rede nunca bloqueia. O jogo segue.
    return { ok: false, leadId: null, dropped: false }
  }
}

export async function captureLeadHttp(payload: LeadPayload): Promise<CaptureResult> {
  const env = readEnv()
  if (!env) {
    return { ok: false, leadId: null, dropped: false }
  }
  return postJson(env, {
    nome: payload.nome,
    email: payload.email,
    genero: payload.genero,
    cargo: payload.cargo,
    consentimento: payload.consentimento,
    honeypot: payload.honeypot,
  })
}

export async function updateLeadResultHttp(
  leadId: string | null,
  result: MatchResult,
): Promise<CaptureResult> {
  const env = readEnv()
  if (!env || leadId === null) {
    return { ok: false, leadId: null, dropped: false }
  }
  return postJson(env, {
    tipo: 'resultado',
    leadId,
    modoJogado: result.modoJogado,
    scoreFinal: result.scoreFinal,
  })
}
