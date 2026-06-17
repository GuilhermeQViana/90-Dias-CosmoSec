// Envio de email via Resend. Destino unico: contato@cosmosec.com.br (G0).
// A chave vive como secret no Supabase, nunca no cliente. Minimizacao: o email
// leva so o necessario para o time de contato dar seguimento.

import type { LeadNormalizado } from './validation.ts'

const DESTINO = 'contato@cosmosec.com.br'

export async function enviarEmailLead(lead: LeadNormalizado): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const remetente = Deno.env.get('RESEND_FROM') ?? 'Jogo 90 Dias <no-reply@cosmosec.com.br>'

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY ausente, pulando envio')
    return false
  }

  // Sem travessoes na copy. Minimo de PII.
  const linhas = [
    'Novo lead capturado pelo jogo 90 Dias.',
    '',
    `Nome: ${lead.nome}`,
    `Email: ${lead.email}`,
    `Cargo: ${lead.cargo}`,
    `Genero: ${lead.genero ?? 'nao informado'}`,
    `Consentimento LGPD: sim`,
  ]

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: remetente,
        to: [DESTINO],
        subject: `Novo lead 90 Dias: ${lead.nome}`,
        text: linhas.join('\n'),
      }),
    })
    if (!resp.ok) {
      console.warn('[email] Resend respondeu', resp.status)
      return false
    }
    return true
  } catch (err) {
    console.warn('[email] falha ao chamar Resend', err)
    return false
  }
}
