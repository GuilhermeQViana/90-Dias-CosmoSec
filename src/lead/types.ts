// Tipos do lead e da ficha do Guardiao. Alinhados ao schema do G0.

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

export type Cargo = (typeof CARGOS)[number]

// G0: genero opcional, tres opcoes. Em branco equivale a nao informar.
export const GENEROS = ['Feminino', 'Masculino', 'Outro'] as const

export type Genero = (typeof GENEROS)[number]

// Estado do formulario na UI. Genero e cargo podem estar vazios antes do envio.
export interface GuardianForm {
  nome: string
  email: string
  genero: Genero | ''
  cargo: Cargo | ''
  consentimento: boolean
  // Honeypot: deve ficar sempre vazio. Se vier preenchido, e bot.
  website: string
}

export function emptyGuardianForm(): GuardianForm {
  return {
    nome: '',
    email: '',
    genero: '',
    cargo: '',
    consentimento: false,
    website: '',
  }
}

// Payload enviado ao backend. origem e forcada pelo servidor, nao vai daqui.
// modo_jogado e score_final entram no segundo POST, ao fim da partida.
export interface LeadPayload {
  nome: string
  email: string
  genero: Genero | null
  cargo: Cargo
  consentimento: true
  honeypot: string
}

// Resultado da captura, comum ao mock e ao cliente HTTP real.
export interface CaptureResult {
  ok: boolean
  // id do lead, usado depois para atualizar o score. null se descartado.
  leadId: string | null
  // descartado por honeypot. Do ponto de vista do jogo, segue normal.
  dropped: boolean
}

// Segundo POST, ao fim da partida.
export interface MatchResult {
  modoJogado: string
  scoreFinal: number
}
