// Modelo de dados das cartas. Camada pura, sem render. O catalogo vive em
// catalog.ts e o baralho em deck.ts.
//
// Sem overclaim (secao 1 do prompt mestre): SOC 2 e ISO 27001 sao sempre
// tratadas como cobertura de crosswalk no jogo, nunca como certificado obtido.

export type Norma = 'BCB/CMN' | 'LGPD' | 'ISO 27001' | 'SOC 2' | 'ISO 22301'

export type TipoCarta = 'controle' | 'evidencia' | 'framework' | 'aliado' | 'jornada'

// Categoria fina dentro de cada tipo, usada para resolver efeitos.
export type EfeitoCarta =
  // Controles
  | 'controle'
  // Evidencias
  | 'lacre'
  | 'snapshot'
  | 'politica'
  | 'resposta-incidente'
  // Frameworks de campo
  | 'campo-bacen'
  | 'campo-lgpd'
  | 'campo-iso'
  // Aliado IA
  | 'siriusai'
  // Jornada, os cinco verbos
  | 'diagnosticar'
  | 'planejar'
  | 'operar'
  | 'monitorar'
  | 'demonstrar'

export interface Carta {
  id: string
  nome: string
  tipo: TipoCarta
  efeito: EfeitoCarta
  custoEnergia: number
  custoDias: number
  // Defesa do controle. Vira Postura quando selado. Zero para nao controles.
  defesa: number
  // Normas que o controle cobre, base do combo de crosswalk.
  cobertura: ReadonlyArray<Norma>
  // Texto curto da carta. Sem travessoes, sem overclaim.
  texto: string
}

// Instancia de uma carta em jogo. Permite repetir a mesma carta no baralho.
export interface CartaInstancia {
  uid: string
  carta: Carta
  // Para controles em campo: se ja foi selado como prova.
  selado: boolean
}
