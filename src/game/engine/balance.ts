// Constantes de balanceamento do duelo.
//
// GATE HUMANO: a logica e os valores de score sao area sensivel (secao 14 do
// prompt mestre). Tudo aqui e PROPOSTA para revisao, nao final. Ajustar o
// balanceamento e mudar a curva de dificuldade exige aprovacao humana.
//
// Honestidade do score (secao 5): o Posture comeca baixo de proposito. Subir e
// merito. O jogo nunca infla a nota nem aplica um zero falso.

export const BALANCE = {
  // Posture comeca baixo. Alvo de vitoria vem do modo.
  POSTURE_INICIAL: 10,
  POSTURE_MIN: 0,
  POSTURE_MAX: 100,
  // Piso critico: se a Posture cair ate aqui, derrota. Comeca acima dele.
  POSTURE_PISO_CRITICO: 0,

  // Energia de Sprint, tipo mana. Recarrega no inicio do turno e cresce devagar.
  ENERGIA_INICIAL: 1,
  ENERGIA_MAX_INICIAL: 1,
  ENERGIA_MAX_TETO: 6,
  ENERGIA_CRESCIMENTO_POR_TURNO: 1,

  // Compra de cartas por turno do Guardiao.
  COMPRA_POR_TURNO: 1,
  // Tamanho da mao inicial no comeco do duelo.
  MAO_INICIAL: 5,

  // A partir de qual turno Publicar Trust Center fica jogavel (custo alto, fim de jogo).
  TURNO_MIN_TRUST_CENTER: 6,
} as const

// Balanceamento do vilao 90 Dias (M-06). PROPOSTA sob gate de score (secao 14).
// Os danos respondem as defesas do Guardiao: o controle certo no campo absorve
// ou reduz o golpe. Isso ensina que prova e cobertura valem mais que improviso.
export const VILAO_BALANCE = {
  // Relogio que cai a cada turno do vilao, antes dos efeitos das cartas.
  REDUCAO_DIAS_BASE: 5,
  // A cada tantos Dias gastos, o vilao saca uma carta a mais por turno.
  ESCALONAMENTO_DIAS: 18,

  // Ameacas
  PHISHING_DANO: 8, // absorvido por MFA
  VAZAMENTO_DANO: 6, // reduzido por IAM
  VAZAMENTO_DANO_REDUZIDO: 2,
  INSIDER_DANO: 6, // reduzido por Segregacao de Funcoes
  INSIDER_DANO_REDUZIDO: 3,
  DDOS_PENALIDADE_ENERGIA: 1, // bloqueia uma carta no proximo turno

  // Decadencia
  EVIDENCIA_VENCIDA_IDADE: 2, // selo com idade a partir disso fica vulneravel
  PRAZO_APERTADO_DIAS: 8, // acelera o relogio
  LACUNA_DANO: 4, // gap nao coberto

  // Pressao
  AUDITORIA_SURPRESA_DANO: 10, // defendido por Trilha de Auditoria
  ACHADO_CRITICO_DANO: 6,
} as const
