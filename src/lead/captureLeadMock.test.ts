import { describe, expect, it } from 'vitest'
import type { LeadPayload } from '@/lead/types'
import { captureLeadMock, updateLeadResultMock } from '@/lead/captureLeadMock'

function payload(overrides: Partial<LeadPayload> = {}): LeadPayload {
  return {
    nome: 'Guilherme',
    email: 'guilherme@cosmosec.com.br',
    genero: null,
    cargo: 'CISO',
    consentimento: true,
    honeypot: '',
    ...overrides,
  }
}

describe('captureLeadMock', () => {
  it('retorna leadId em captura valida', async () => {
    const result = await captureLeadMock(payload(), { now: () => 1000 })
    expect(result.ok).toBe(true)
    expect(result.dropped).toBe(false)
    expect(result.leadId).toBeTypeOf('string')
  })

  it('descarta em silencio quando o honeypot vem preenchido', async () => {
    const result = await captureLeadMock(payload({ honeypot: 'http://bot' }))
    expect(result.ok).toBe(true)
    expect(result.dropped).toBe(true)
    expect(result.leadId).toBeNull()
  })
})

describe('updateLeadResultMock', () => {
  it('falha sem bloquear quando nao ha leadId', async () => {
    const result = await updateLeadResultMock(null, { modoJogado: 'auditoria', scoreFinal: 70 })
    expect(result.ok).toBe(false)
  })

  it('atualiza quando ha leadId', async () => {
    const result = await updateLeadResultMock('mock-abc', { modoJogado: 'auditoria', scoreFinal: 72 })
    expect(result.ok).toBe(true)
  })
})
