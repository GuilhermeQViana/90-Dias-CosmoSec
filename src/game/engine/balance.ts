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

  // Ataque placeholder do vilao na fatia M-05. A IA real, o baralho e o
  // escalonamento entram na M-06. Aqui o 90 Dias so consome o relogio.
  VILAO_M05_REDUCAO_DIAS: 6,
  VILAO_M05_DANO_POSTURE: 0,

  // A partir de qual turno Publicar Trust Center fica jogavel (custo alto, fim de jogo).
  TURNO_MIN_TRUST_CENTER: 6,
} as const
