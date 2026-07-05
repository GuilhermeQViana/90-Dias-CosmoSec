import { BALANCE } from '@/game/engine/balance'

// Pontuacao de selo, compartilhada pelo controlador e pela IA do vilao (evita
// ciclo de import). GATE de score: os valores vem de balance.ts e modes.ts.

// Bonus do combo de crosswalk: a Defesa mais um extra por cada norma alem da
// primeira que o controle cobre. O moat virado mecanica.
export function bonusCrosswalk(normas: number): number {
  return Math.max(0, normas - 1) * BALANCE.CROSSWALK_BONUS_POR_NORMA
}

// Ganho de Postura ao selar um controle: (Defesa + crosswalk) vezes o
// multiplicador do modo (Modo 1 Auditoria: prova selada vale dobrado).
export function ganhoAoSelar(defesa: number, normas: number, multiplicador: number): number {
  return (defesa + bonusCrosswalk(normas)) * multiplicador
}
