import { describe, expect, it } from 'vitest'
import { emptyGuardianForm, type GuardianForm } from '@/lead/types'
import {
  isFreeEmailDomain,
  isValidEmail,
  toLeadPayload,
  validateForm,
} from '@/lead/validation'

function validForm(overrides: Partial<GuardianForm> = {}): GuardianForm {
  return {
    ...emptyGuardianForm(),
    nome: 'Guilherme',
    email: 'guilherme@cosmosec.com.br',
    cargo: 'CISO',
    consentimento: true,
    ...overrides,
  }
}

describe('isValidEmail', () => {
  it('aceita email bem formado', () => {
    expect(isValidEmail('ana@empresa.com.br')).toBe(true)
  })

  it('rejeita formato quebrado', () => {
    expect(isValidEmail('ana@empresa')).toBe(false)
    expect(isValidEmail('ana empresa.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('isFreeEmailDomain', () => {
  it('detecta dominio gratuito', () => {
    expect(isFreeEmailDomain('ana@gmail.com')).toBe(true)
    expect(isFreeEmailDomain('ana@outlook.com')).toBe(true)
  })

  it('nao marca dominio corporativo', () => {
    expect(isFreeEmailDomain('ana@cosmosec.com.br')).toBe(false)
  })
})

describe('validateForm', () => {
  it('aprova um form completo e valido', () => {
    const result = validateForm(validForm())
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('exige nome, email, cargo e consentimento', () => {
    const result = validateForm(emptyGuardianForm())
    expect(result.valid).toBe(false)
    expect(result.errors.nome).toBeDefined()
    expect(result.errors.email).toBeDefined()
    expect(result.errors.cargo).toBeDefined()
    expect(result.errors.consentimento).toBeDefined()
  })

  it('bloqueia sem consentimento mesmo com o resto valido', () => {
    const result = validateForm(validForm({ consentimento: false }))
    expect(result.valid).toBe(false)
    expect(result.errors.consentimento).toBeDefined()
  })

  it('avisa sobre email pessoal sem bloquear', () => {
    const result = validateForm(validForm({ email: 'ana@gmail.com' }))
    expect(result.valid).toBe(true)
    expect(result.warnings.email).toBeDefined()
  })

  it('genero vazio e valido por ser opcional', () => {
    const result = validateForm(validForm({ genero: '' }))
    expect(result.valid).toBe(true)
    expect(result.errors.genero).toBeUndefined()
  })
})

describe('toLeadPayload', () => {
  it('monta payload com genero null quando vazio', () => {
    const payload = toLeadPayload(validForm({ genero: '' }))
    expect(payload.genero).toBeNull()
    expect(payload.consentimento).toBe(true)
    expect(payload.email).toBe('guilherme@cosmosec.com.br')
  })

  it('normaliza email para minusculo e mantem genero escolhido', () => {
    const payload = toLeadPayload(validForm({ email: 'ANA@Empresa.COM', genero: 'Feminino' }))
    expect(payload.email).toBe('ana@empresa.com')
    expect(payload.genero).toBe('Feminino')
  })

  it('lanca se o form for invalido', () => {
    expect(() => toLeadPayload(emptyGuardianForm())).toThrow()
  })
})
