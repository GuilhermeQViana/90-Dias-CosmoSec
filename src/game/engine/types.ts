import type { ModeId } from '@/game/modes'

// Tipos do motor de duelo. Logica pura, sem arte e sem Phaser.
// O sistema de cartas (M-05) e a IA do vilao (M-06) consomem este motor.

export type Fase = 'guardiao' | 'vilao' | 'fim'

export type Resultado = 'em-andamento' | 'vitoria' | 'derrota'

export interface Recursos {
  // Dias restantes. Zero significa que a auditoria chegou e o vilao venceu.
  dias: number
  // Posture Score de 0 a 100. Barra de vitoria.
  posture: number
  // Energia de Sprint disponivel neste turno, tipo mana.
  energia: number
  // Teto de energia do turno, cresce devagar a cada turno.
  energiaMax: number
}

export interface EstadoDuelo {
  modo: ModeId
  turno: number
  fase: Fase
  recursos: Recursos
  resultado: Resultado
  // Quantos controles ja foram selados como prova. Dirigido pelo sistema de cartas.
  controlesSelados: number
  // Energia a menos no proximo turno do Guardiao, efeito do DDoS do vilao.
  penalidadeEnergia: number
  // Se Publicar Trust Center ja foi jogado com sucesso.
  trustCenterPublicado: boolean
  // Trilha legivel dos eventos, util para UI e teste.
  log: ReadonlyArray<string>
}

// Custo e efeito de uma jogada do Guardiao. O catalogo de cartas real vem na
// M-05; aqui o motor so precisa do contrato minimo para validar e aplicar.
export interface JogadaCarta {
  custoEnergia: number
  custoDias: number
  ganhoPostura: number
  // Se a jogada sela um controle (vira prova), conta para a regra de vitoria.
  selaControle: boolean
}

// Efeito de um turno do vilao. A IA real (baralho, escalonamento) vem na M-06.
export interface AtaqueVilao {
  danoPostura: number
  reducaoDias: number
}

export type Acao =
  | { tipo: 'iniciar-turno' }
  | { tipo: 'jogar-carta'; jogada: JogadaCarta }
  | { tipo: 'encerrar-turno' }
  | { tipo: 'turno-vilao'; ataque: AtaqueVilao }
  | { tipo: 'publicar-trust-center'; custoEnergia: number; custoDias: number }
