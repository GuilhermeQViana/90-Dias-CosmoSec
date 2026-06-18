// Metadados dos tres modos da secao 10. Usados na selecao do menu.
// As regras de combate de cada modo entram a partir da M-07.

export type ModeId = 'auditoria' | 'regulador' | 'rfp'

export type Dificuldade = 'Iniciante' | 'Avancada' | 'Estrategica'

export interface GameMode {
  id: ModeId
  titulo: string
  subtitulo: string
  chefe: string
  dificuldade: Dificuldade
  alvoPostura: number
  prazoDias: number
  // Minimo de controles selados exigido para vencer. Regra de vitoria do modo.
  minControlesSelados: number
  // Se true, a vitoria so fecha jogando Publicar Trust Center (modo RFP).
  exigeTrustCenter: boolean
  // Multiplicador de Postura ao selar. Modo 1 Auditoria: prova selada vale
  // dobrado (2). Demais modos: 1. PROPOSTA sob gate de score.
  seloMultiplicador: number
  regra: string
  licao: string
}

export const MODES: readonly GameMode[] = [
  {
    id: 'auditoria',
    titulo: 'A Auditoria Externa',
    subtitulo: 'Modo 1',
    chefe: 'O Auditor',
    dificuldade: 'Iniciante',
    alvoPostura: 70,
    prazoDias: 90,
    minControlesSelados: 4,
    exigeTrustCenter: false,
    seloMultiplicador: 2,
    regra: 'Prova selada vale dobrado. Auditoria Surpresa e frequente.',
    licao: 'Prova lacrada vence o improviso.',
  },
  {
    id: 'regulador',
    titulo: 'O Regulador Externo, BACEN',
    subtitulo: 'Modo 2',
    chefe: 'O Regulador',
    dificuldade: 'Avancada',
    alvoPostura: 80,
    prazoDias: 75,
    minControlesSelados: 4,
    exigeTrustCenter: false,
    seloMultiplicador: 1,
    regra: 'Exige o Campo BACEN CMN com residencia sa-east-1 ativo. Prazo Apertado e Achado Critico frequentes.',
    licao: 'O crosswalk BCB CMN e LGPD e o moat, uma prova vale varias normas.',
  },
  {
    id: 'rfp',
    titulo: 'A ISO 27001 da RFP do Cliente',
    subtitulo: 'Modo 3',
    chefe: 'O Cliente Enterprise',
    dificuldade: 'Estrategica',
    alvoPostura: 85,
    prazoDias: 90,
    minControlesSelados: 6,
    exigeTrustCenter: true,
    seloMultiplicador: 1,
    regra: 'Campo ISO 27001 ativo e 6 controles selados. Termina com Publicar Trust Center.',
    licao: 'Demonstrar fecha negocio, o Trust Center e a arma de saida.',
  },
] as const

export function findMode(id: ModeId): GameMode {
  const mode = MODES.find((m) => m.id === id)
  if (!mode) {
    throw new Error(`Modo desconhecido: ${id}`)
  }
  return mode
}
