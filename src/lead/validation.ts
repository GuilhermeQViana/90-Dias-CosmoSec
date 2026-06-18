import { CARGOS, GENEROS, type Cargo, type GuardianForm, type LeadPayload } from '@/lead/types'

// Validacao pura da ficha do Guardiao. Sem efeitos, facil de testar.
// errors bloqueiam o envio. warnings sao avisos amigaveis que nao bloqueiam,
// como o caso de email de dominio gratuito (rejeicao opcional pelo spec).

export type LeadField = 'nome' | 'email' | 'cargo' | 'genero' | 'consentimento'

export interface ValidationResult {
  valid: boolean
  errors: Partial<Record<LeadField, string>>
  warnings: Partial<Record<LeadField, string>>
}

// Dominios gratuitos comuns. Lista curta de proposito, so para o aviso amigavel.
const DOMINIOS_GRATUITOS = new Set([
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'bol.com.br',
  'uol.com.br',
  'terra.com.br',
  'proton.me',
  'protonmail.com',
])

// Regex de email simples e estrito o suficiente para validar formato.
// A validacao forte de verdade acontece no servidor na M-03.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}

export function emailDomain(email: string): string {
  const at = email.lastIndexOf('@')
  if (at < 0) {
    return ''
  }
  return email.slice(at + 1).trim().toLowerCase()
}

export function isFreeEmailDomain(email: string): boolean {
  return DOMINIOS_GRATUITOS.has(emailDomain(email))
}

export function isCargo(value: string): value is Cargo {
  return (CARGOS as readonly string[]).includes(value)
}

export function validateForm(form: GuardianForm): ValidationResult {
  const errors: Partial<Record<LeadField, string>> = {}
  const warnings: Partial<Record<LeadField, string>> = {}

  if (form.nome.trim().length < 2) {
    errors.nome = 'Informe o nome do Guardiao.'
  }

  if (form.email.trim().length === 0) {
    errors.email = 'Informe o email corporativo.'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Esse email nao parece valido. Confira o formato.'
  } else if (isFreeEmailDomain(form.email)) {
    warnings.email = 'Esse parece um email pessoal. Se puder, use o corporativo para falarmos certo.'
  }

  if (form.cargo === '' || !isCargo(form.cargo)) {
    errors.cargo = 'Selecione o seu cargo.'
  }

  if (form.genero !== '' && !(GENEROS as readonly string[]).includes(form.genero)) {
    errors.genero = 'Opcao de genero invalida.'
  }

  if (!form.consentimento) {
    errors.consentimento = 'Marque o consentimento para iniciar.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  }
}

// Monta o payload a partir de um form ja validado. Lanca se invalido,
// para nunca enviar dado fora do contrato. genero vazio vira null.
export function toLeadPayload(form: GuardianForm): LeadPayload {
  const result = validateForm(form)
  if (!result.valid || form.cargo === '' || !isCargo(form.cargo)) {
    throw new Error('Form invalido, nao deveria virar payload.')
  }

  return {
    nome: form.nome.trim(),
    email: form.email.trim().toLowerCase(),
    genero: form.genero === '' ? null : form.genero,
    cargo: form.cargo,
    consentimento: true,
    honeypot: form.website,
  }
}
