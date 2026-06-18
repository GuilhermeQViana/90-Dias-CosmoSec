// Verificacao opcional do Cloudflare Turnstile. So roda se TURNSTILE_SECRET
// estiver configurado. Sem o secret, a verificacao e ignorada (flag desligada),
// para nao bloquear o MVP. Decisao final sobre tornar obrigatorio fica na M-14.

export async function verificarTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET')
  if (!secret) {
    return true // flag desligada
  }
  if (!token) {
    return false
  }

  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  form.append('remoteip', ip)

  try {
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    const data = (await resp.json()) as { success?: boolean }
    return data.success === true
  } catch {
    // Falha ao verificar nao deve travar. Loga e deixa passar para nao perder lead.
    console.warn('[turnstile] falha na verificacao, seguindo sem bloquear')
    return true
  }
}
