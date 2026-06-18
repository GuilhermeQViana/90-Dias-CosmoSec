// Edge Function capture-lead. Roda no Deno, regiao sa-east-1.
//
// Dois tipos de POST:
// - tipo 'captura': valida, insere o lead via service role, dispara email.
// - tipo 'resultado': atualiza modo_jogado e score_final ao fim da partida.
//
// Principios (ver docs/security/M-00-threat-model-stride.md):
// - Servidor e a fonte da verdade. origem forcada, consentimento exige true.
// - Resposta opaca: ok ou erro generico. Nunca ecoa a base nem stack trace.
// - Segredos so aqui (service role, Resend). Nunca no cliente.
// - Falha de email nao bloqueia: o lead ja foi persistido, retry em background.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { validarCaptura, validarResultado } from '../_shared/validation.ts'
import { checarRateLimit, ipDoRequest } from '../_shared/rateLimit.ts'
import { verificarTurnstile } from '../_shared/turnstile.ts'
import { enviarEmailLead } from '../_shared/email.ts'

const ORIGEM = 'jogo-90dias'

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

function service() {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) {
    throw new Error('config ausente')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

Deno.serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin') ?? ''

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) })
  }
  if (req.method !== 'POST') {
    return json({ ok: false }, 405, origin)
  }

  // Anti-abuso: rate limit por IP antes de qualquer trabalho pesado.
  const ip = ipDoRequest(req)
  const limite = checarRateLimit(ip)
  if (!limite.permitido) {
    return json({ ok: false, erro: 'muitas tentativas' }, 429, origin)
  }

  // Limite de tamanho do corpo, barreira simples contra payload gigante.
  const raw = await req.text()
  if (raw.length > 8_000) {
    return json({ ok: false }, 413, origin)
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ ok: false }, 400, origin)
  }

  const tipo = (body as { tipo?: unknown }).tipo

  // ----- Segundo POST: resultado da partida -----
  if (tipo === 'resultado') {
    const v = validarResultado(body)
    if (!v.ok) {
      return json({ ok: false }, 400, origin)
    }
    try {
      const { error } = await service()
        .from('leads')
        .update({ modo_jogado: v.resultado.modoJogado, score_final: v.resultado.scoreFinal })
        .eq('id', v.resultado.leadId)
      if (error) {
        console.warn('[capture-lead] update falhou', error.message)
        return json({ ok: false }, 200, origin) // opaco, nao bloqueia o jogo
      }
      return json({ ok: true }, 200, origin)
    } catch (err) {
      console.warn('[capture-lead] erro no resultado', err)
      return json({ ok: false }, 200, origin)
    }
  }

  // ----- Primeiro POST: captura do lead -----
  // Honeypot: campo escondido. Se veio preenchido, finge sucesso e descarta.
  const honeypot = (body as { honeypot?: unknown }).honeypot
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return json({ ok: true, leadId: null }, 200, origin)
  }

  // Turnstile opcional. So bloqueia se o secret estiver configurado.
  const turnstileToken = (body as { turnstileToken?: unknown }).turnstileToken
  const humano = await verificarTurnstile(
    typeof turnstileToken === 'string' ? turnstileToken : null,
    ip,
  )
  if (!humano) {
    return json({ ok: false, erro: 'verificacao' }, 403, origin)
  }

  const v = validarCaptura(body)
  if (!v.ok) {
    return json({ ok: false }, 400, origin)
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 400) ?? null

  let leadId: string | null = null
  try {
    const { data, error } = await service()
      .from('leads')
      .insert({
        nome: v.lead.nome,
        email: v.lead.email,
        genero: v.lead.genero,
        cargo: v.lead.cargo,
        consentimento: true,
        origem: ORIGEM, // forcada pelo servidor, o cliente nao decide
        user_agent: userAgent,
      })
      .select('id')
      .single()

    if (error || !data) {
      console.warn('[capture-lead] insert falhou', error?.message)
      // Nao bloqueia o jogador. Cliente segue mesmo com ok false.
      return json({ ok: false }, 200, origin)
    }
    leadId = data.id as string
  } catch (err) {
    console.warn('[capture-lead] erro no insert', err)
    return json({ ok: false }, 200, origin)
  }

  // Email em background. Nao espera para responder ao cliente: o lead ja foi
  // persistido, e a captura nunca pode travar o jogo.
  const tarefaEmail = enviarEmailLead(v.lead).then((enviado) => {
    if (!enviado) {
      console.warn('[capture-lead] email nao enviado, lead persistido mesmo assim')
    }
  })
  if ('waitUntil' in globalThis && typeof (globalThis as { waitUntil?: unknown }).waitUntil === 'function') {
    ;(globalThis as { waitUntil: (p: Promise<unknown>) => void }).waitUntil(tarefaEmail)
  } else {
    void tarefaEmail
  }

  return json({ ok: true, leadId }, 200, origin)
})
