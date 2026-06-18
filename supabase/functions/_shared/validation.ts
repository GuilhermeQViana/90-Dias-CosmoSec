// Validacao server-side autoritativa. Espelha as regras testadas no cliente
// (src/lead/validation.ts), mas o servidor e a fonte da verdade: o cliente
// nunca e confiado. Sem dependencia externa, roda no Deno.

export const CARGOS = [
  'CISO',
  'Gerente de Segurança da Informação',
  'Analista de Segurança da Informação',
  'Gerente de Risco Operacional',
  'Analista de Risco Operacional',
  'Gerente de Compliance',
  'Analista de Compliance',
  'Outro',
] as const

export const GENEROS = ['Feminino', 'Masculino', 'Outro'] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface CapturaInput {
  nome: string
  email: string
  genero: string | null
  cargo: string
  consentimento: boolean
  honeypot: string
}

export interface LeadNormalizado {
  nome: string
  email: string
  genero: string | null
  cargo: string
  consentimento: true
}

export type ValidacaoCaptura =
  | { ok: true; lead: LeadNormalizado }
  | { ok: false; motivo: string }

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

// Valida e normaliza o corpo da captura. Retorna motivo generico em caso de
// falha, sem vazar detalhe util a um atacante. O honeypot e tratado fora daqui.
export function validarCaptura(body: unknown): ValidacaoCaptura {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, motivo: 'payload invalido' }
  }
  const b = body as Record<string, unknown>

  if (!isString(b.nome) || b.nome.trim().length < 2 || b.nome.trim().length > 120) {
    return { ok: false, motivo: 'nome invalido' }
  }
  if (!isString(b.email) || !EMAIL_RE.test(b.email.trim()) || b.email.length > 254) {
    return { ok: false, motivo: 'email invalido' }
  }
  if (!isString(b.cargo) || !(CARGOS as readonly string[]).includes(b.cargo)) {
    return { ok: false, motivo: 'cargo invalido' }
  }

  let genero: string | null = null
  if (b.genero !== null && b.genero !== undefined && b.genero !== '') {
    if (!isString(b.genero) || !(GENEROS as readonly string[]).includes(b.genero)) {
      return { ok: false, motivo: 'genero invalido' }
    }
    genero = b.genero
  }

  // Consentimento precisa chegar explicitamente true. Qualquer outra coisa nega.
  if (b.consentimento !== true) {
    return { ok: false, motivo: 'consentimento ausente' }
  }

  return {
    ok: true,
    lead: {
      nome: b.nome.trim(),
      email: b.email.trim().toLowerCase(),
      genero,
      cargo: b.cargo,
      consentimento: true,
    },
  }
}

export interface ResultadoInput {
  leadId: string
  modoJogado: string
  scoreFinal: number
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MODOS = ['auditoria', 'regulador', 'rfp'] as const

export type ValidacaoResultado =
  | { ok: true; resultado: ResultadoInput }
  | { ok: false; motivo: string }

export function validarResultado(body: unknown): ValidacaoResultado {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, motivo: 'payload invalido' }
  }
  const b = body as Record<string, unknown>

  if (!isString(b.leadId) || !UUID_RE.test(b.leadId)) {
    return { ok: false, motivo: 'leadId invalido' }
  }
  if (!isString(b.modoJogado) || !(MODOS as readonly string[]).includes(b.modoJogado)) {
    return { ok: false, motivo: 'modo invalido' }
  }
  if (
    typeof b.scoreFinal !== 'number' ||
    !Number.isInteger(b.scoreFinal) ||
    b.scoreFinal < 0 ||
    b.scoreFinal > 100
  ) {
    return { ok: false, motivo: 'score invalido' }
  }

  return {
    ok: true,
    resultado: { leadId: b.leadId, modoJogado: b.modoJogado, scoreFinal: b.scoreFinal },
  }
}
