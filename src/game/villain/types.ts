// Modelo do baralho do vilao 90 Dias. Camada pura.

export type CategoriaVilao = 'ameaca' | 'decadencia' | 'pressao'

export type EfeitoVilao =
  | 'phishing'
  | 'ransomware'
  | 'vazamento-fornecedor'
  | 'insider'
  | 'ddos'
  | 'evidencia-vencida'
  | 'prazo-apertado'
  | 'lacuna'
  | 'auditoria-surpresa'
  | 'achado-critico'

export interface CartaVilao {
  id: string
  nome: string
  categoria: CategoriaVilao
  efeito: EfeitoVilao
  texto: string
}

// Baralho do vilao em jogo: pilha de compra e descarte.
export interface EstadoVilao {
  baralho: ReadonlyArray<CartaVilao>
  descarte: ReadonlyArray<CartaVilao>
}
