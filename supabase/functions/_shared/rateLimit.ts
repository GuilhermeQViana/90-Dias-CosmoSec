// Rate limit por IP. Implementacao best-effort em memoria do isolate.
// AVISO: a Edge Function pode escalar em varios isolates, entao isto nao e
// um limite duravel global. Serve como primeira barreira barata. Para limite
// forte e global, trocar por um store compartilhado (tabela no Postgres ou
// Upstash Redis). Decisao registrada para a M-14 de hardening.

interface Janela {
  count: number
  reset: number
}

const baldes = new Map<string, Janela>()

export interface RateLimitResult {
  permitido: boolean
  restante: number
}

export function checarRateLimit(
  ip: string,
  limite = 5,
  janelaMs = 60_000,
  agora: number = Date.now(),
): RateLimitResult {
  const atual = baldes.get(ip)

  if (!atual || agora > atual.reset) {
    baldes.set(ip, { count: 1, reset: agora + janelaMs })
    return { permitido: true, restante: limite - 1 }
  }

  if (atual.count >= limite) {
    return { permitido: false, restante: 0 }
  }

  atual.count += 1
  return { permitido: true, restante: limite - atual.count }
}

// Extrai o IP do cliente dos cabecalhos do proxy. Fallback para desconhecido.
export function ipDoRequest(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) {
    const first = fwd.split(',')[0]
    if (first) {
      return first.trim()
    }
  }
  return req.headers.get('x-real-ip') ?? 'desconhecido'
}
